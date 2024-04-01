// Importing external modules and libraries
const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const schema = require("./schemas/index.js");
const cors = require("cors");
const http = require("http");
const fs = require("fs");
const { PrismaClient } = require("@prisma/client");
require("dotenv").config();
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

// Creating an Express application instance
const app = express();
// Initializing the Prisma client
const prisma = new PrismaClient();

// Prisma event listeners
prisma.$on("query", (event) => {
	console.log("Query: " + event.query);
	console.log("Params: " + event.params);
	console.log("Duration: " + event.duration + "ms");
});

prisma.$on("info", (event) => {
	console.log("Info: " + event.message);
});

prisma.$on("warn", (event) => {
	console.log("Warning: " + event.message);
});

prisma.$on("error", (event) => {
	console.error("Error: " + event.message);
});

// Configuring CORS options
app.use(
	cors({
		origin: ["http://localhost:5173", "http://127.0.0.1:5173/"],
		methods: "*",
	})
);

// Configuring the Google OAuth strategy
passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.CLIENT_ID, // Retrieving the client ID from environment variables
			clientSecret: process.env.CLIENT_SECRET, // Retrieving the client secret from environment variables
			callbackURL: "/auth/google/callback", // Specifying the callback URL for Google OAuth
			scope: ["profile", "email"], // Requesting access to user's profile and email
		},
		(accessToken, refreshToken, profile, done) => {
			done(null, profile); // Callback function to handle the user profile data
		}
	)
);

// Initializing the Passport middleware
app.use(passport.initialize());

// Creating a Map to store user sessions
const sessions = new Map();

// Defining the Google OAuth route
app.get(
	"/auth/google",
	passport.authenticate("google", { scope: ["profile", "email"] })
);

// Creating an array to store memory data
const memory = [];

// Defining the Google OAuth callback route
app.get(
	"/auth/google/callback",
	passport.authenticate("google", { session: false }),
	async (req, res) => {
		// Handling the authentication callback
		if (req.user) {
			const { profile, accessToken } = req.user;

			// Checking if the user exists in the database
			const exists = await prisma.user.count({
				where: { id: req.user.id },
			});

			// Generating a new API key
			const { nanoid } = await import("nanoid");
			const apiKey = nanoid();

			let user;

			// If the user exists, find their data and redirect with their ID and secret key
			if (exists) {
				user = await prisma.userData.findFirst({
					where: { id: req.user.id },
					select: { id: true, secretkey: true },
				});
				res.redirect(
					`http://localhost:5173/?u=${user.id}&k=${user.secretkey}`
				);
			} else {
				// If the user doesn't exist, create a new user and redirect with their ID and API key
				user = await prisma.user.create({
					data: {
						name: req.user.displayName,
						username: req.user.displayName.replace(/\s+/g, ""),
						userData: {
							create: { secretkey: apiKey, password: "" },
						},
					},
				});
				res.redirect(`http://localhost:5173/?u=${user.id}&k=${apiKey}`);
			}
		} else {
			// If authentication fails, return an error response
			res.status(401).json({ error: "Authentication failed" });
		}
	}
);

// Creating an HTTP server from the Express app
const server = http.createServer(app);
// Configuring Socket.IO with options
const io = require("socket.io")(server, {
	cors: { origin: "*" },
	reconnection: true,
	reconnectionAttempts: 5,
	reconnectionDelay: 1000,
});

// Handling Socket.IO connections
io.on("connection", (socket) => {
	socket.on("initialConnection", async (data) => {
		try {
			// Sanitizing the incoming data
			data = sanitise(data);
			console.log(data);
			console.log(socket.id, "ID");
			// Checking if the user data exists and is valid
			const exists = await prisma.userData.count({
				where: {
					AND: [
						{ id: data.id },
						{ secretkey: data.key },
						{ expiry: { gt: new Date(Date.now()) } },
					],
				},
			});

			if (!exists) {
				// If the user data is invalid, emit an 'auth' event with false
				io.to(socket.id).emit("auth", false);
				return;
			} else {
				// If the user data is valid, update the user's socket ID and emit an 'auth' event with true
				const id = await prisma.user.update({
					where: { id: data.id },
					data: {
						socket: socket.id,
					},
				});

				if (id) {
					io.to(socket.id).emit("auth", true);
				}
			}
		} catch (e) {
			// Logging any errors that occur
			log(e);
		}
	});

	socket.on("getChats", async (data) => {
		try {
			// Sanitizing the incoming data
			data = sanitise(data);
			// Authenticating the user
			await auth(data.id, data.secretkey);

			// Fetching the user's chatrooms and messages
			const chatrooms = await prisma.user.findFirst({
				where: { id: data.id },
				select: {
					id: true,
					chatroomUsers: {
						select: {
							chatroom: {
								select: {
									id: true,
									chatroomUsers: { select: { user: true } },
									messages: {
										orderBy: { date: "desc" },
										take: 1,
										select: {
											id: true,
											content: true,
											sender: {
												select: {
													name: true,
													username: true,
												},
											},
											date: true,
										},
									},
								},
							},
						},
					},
				},
			});

			// Emitting the 'getChats' event with the user's chatrooms and messages
			io.to(socket.id).emit("getChats", chatrooms.chatroomUsers);
		} catch (e) {
			// Logging any errors that occur
			log(e);
		}
	});
});

// Handling Socket.IO connection errors
io.on("connect_error", (err) => {
	console.error(`Socket.IO connection error: ${err.message}`);
});

// Authentication function
async function auth(id, key, req) {
	let session = sessions.has(id);
	console.log(sessions); // Checking if a session exists for the given ID
	if (session && req) {
		// If a session exists and a request is provided
		const current = sessions.get(id);
		// Checking if the session is valid based on IP, user agent, and expiry
		if (
			current.ip !== req.ip ||
			current.userAgent !== req.headers["user-agent"] ||
			current.expiry < new Date(Date.now())
		) {
			if (current.expiry < new Date(Date.now())) {
				sessions.delete(id); // Expired session
			}
			session = false;
		} else {
			return true; // If the session is valid, return true
		}
	}
	if (!session || req) {
		// If no session exists or a request is provided
		// Checking if the user data exists and is valid
		const exists = await prisma.userData.count({
			where: {
				AND: [
					{ id: id },
					{ secretkey: key },
					{ expiry: { gt: new Date(Date.now()) } },
				],
			},
		});

		if (!exists) {
			// If the user data is invalid, throw an error
			// throw new Error('Invalid Credentials')
			console.log("INVALID");
			throw new Error("Invalid Credentials");
		} else {
			if (req != null) {
				// If a request is provided
				// Fetching the user data and creating a new session
				const userData = await prisma.userData.findFirst({
					where: { AND: [{ id: id }, { secretkey: key }] },
					select: { expiry: true },
				});
				sessions.delete(id);
				sessions.set(id, {
					ip: req.ip,
					userAgent: req.headers["user-agent"],
					expiry: new Date(userData.expiry),
				});
			}
			return true; // If the user data is valid, return true
		}
	}
}

// Sanitization function
function sanitise(input) {
	const sanitizedObj = {};

	// Iterating over the keys in the input object
	Object.keys(input).forEach((key) => {
		const value = input[key];
		let sanitizedValue = value;

		// Escaping special characters
		const sanitisedValue = htmlSpecialChars(sanitizedValue);

		function htmlSpecialChars(text) {
			if (typeof text !== "string") {
				return text; // Return as is if not a string
			}

			const map = {
				"<": "&lt;",
				">": "&gt;",
				'"': "&quot;",
				"'": "&apos;",
				"&": "&amp;",
			};
			return text.replace(/[<>"&]/g, (char) => map[char]);
		}

		// Length limitation and canonicalization
		if (typeof data === "string") {
			sanitisedValue = sanitisedValue.slice(0, maxLength);
			sanitizedValue = sanitizedValue.trim();
		} else if (typeof data === "number") {
			sanitisedValue = parseFloat(
				sanitisedValue.toString().slice(0, maxLength)
			);
		}

		// Assigning the sanitized value to the corresponding key
		sanitizedObj[key] = sanitizedValue;
	});

	return sanitizedObj;
}

// Error logging function
function log(e) {
	const timestamp = Date.now();

	const currentDate = new Date(timestamp);

	// Options for formatting the date
	const day = {
		day: "2-digit",
		month: "2-digit",
		year: "2-digit",
		hour12: false,
	};

	// Options for formatting the time
	const time = {
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		hour12: false,
	};

	const formattedDate = currentDate.toLocaleString("en-US", day);
	const formattedTime = currentDate.toLocaleString("en-US", time);

	try {
		// Appending the error message to a log file
		fs.appendFile(
			`${__dirname}/logs/${formattedDate.replace(/\//g, "-")}.txt`,
			`${formattedTime}    ${e.message} \n`,
			(err) => console.log(err)
		);
	} catch (e) {
		console.log(e, "ERROR LOGGING");
	}
}

// Middleware function to add the request object to the context
function addRequestToContext(req, res, next) {
	req = { req };
	next();
}

// Defining the GraphQL endpoint
app.use(
	"/graphql",
	addRequestToContext,
	graphqlHTTP((req) => ({
		schema,
		graphiql: true,
		context: { io, prisma, auth, sanitise, log, req },
	}))
);

// Starting the server on port 8000
server.listen(8000);
