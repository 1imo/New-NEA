// Importing the required modules and types
const { GraphQLString } = require("graphql");
const bcrypt = require("bcrypt");

const UserType = require("../TypeDefs/UserType");
const SensitiveUserDataType = require("../TypeDefs/SensitiveUserDataType");
const LinkType = require("../TypeDefs/LinkType");
const User = require("../../classes/user");

// Defining mutations related to user data
const UserMutations = {
	// Mutation to create a new user
	createUser: {
		// The return type is SensitiveUserDataType
		type: SensitiveUserDataType,
		args: {
			firstName: { type: GraphQLString }, // User's first name
			lastName: { type: GraphQLString }, // User's last name
			username: { type: GraphQLString }, // User's username
			password: { type: GraphQLString }, // User's password
		},
		async resolve(parent, args, { prisma, sanitise, log }) {
			try {
				// Sanitize the input arguments
				args = sanitise(args);

				// Create a new User object
				const user = new User(prisma, log);

				// Return the user ID and API key
				return await user.createUser(args);
			} catch (e) {
				// Log any errors
				log(e);
				return;
			}
		},
	},

	// Mutation to sign in a user
	signIn: {
		type: SensitiveUserDataType,
		args: {
			username: { type: GraphQLString }, // User's username
			pass: { type: GraphQLString }, // User's password
		},
		async resolve(parent, args, { prisma, sanitise, log }) {
			try {
				// Sanitize the input arguments
				args = sanitise(args);

				// Create a new User object
				const user = new User(prisma, log);

				return await user.signIn_details(args);
			} catch (e) {
				// Log any errors
				log(e);
				return;
			}
		},
	},

	// Mutation to follow or unfollow a user
	followUnfollowUser: {
		type: LinkType,
		args: {
			id: { type: GraphQLString }, // User ID
			secretkey: { type: GraphQLString }, // User's API key
			username: { type: GraphQLString }, // Username of the user to follow/unfollow
		},
		async resolve(parent, args, { io, prisma, sanitise, log }) {
			try {
				// Sanitize the input arguments
				args = sanitise(args);

				// Create a new User object
				const user = new User(prisma, log, io);

				// Authenticate the user
				const exists = await user.signIn_apiKey({
					id: args.id,
					secretkey: args.secretkey,
				});

				// Return if the user is invalid
				if (!exists) return;

				// Follow, unfollow, friend and unfriend the user based on the context
				return await user.followUnfollowUser({
					id: args.id,
					username: args.username,
				});
			} catch (e) {
				// Log any errors
				log(e);
				return;
			}
		},
	},

	// Mutation to accept or reject a follow request
	pendingRequest: {
		type: LinkType,
		args: {
			id: { type: GraphQLString }, // User ID
			secretkey: { type: GraphQLString }, // User's API key
			request: { type: GraphQLString }, // Request ID
			action: { type: GraphQLString }, // Action to perform ('add' or 'remove')
		},
		async resolve(parent, args, { io, prisma, sanitise, log }) {
			try {
				// Sanitize the input arguments
				args = sanitise(args);

				// Create a new User object
				const user = new User(prisma, log, io);

				// Authenticate the user
				const exists = await user.signIn_apiKey({
					id: args.id,
					secretkey: args.secretkey,
				});

				// Return if the user is invalid
				if (!exists) return;

				// Accept or reject the follow request based on the action
				return await user.pendingRequest({
					id: args.id,
					request: args.request,
					action: args.action,
				});
			} catch (e) {
				// Log any errors
				log(e);
				return;
			}
		},
	},

	// Mutation to edit user details (name, username, password)
	editDetails: {
		type: SensitiveUserDataType,
		args: {
			id: { type: GraphQLString }, // User ID
			secretkey: { type: GraphQLString }, // User's API key
			request: { type: GraphQLString }, // Type of request ('name', 'username', or 'password')
			data: { type: GraphQLString }, // New data to update
		},
		async resolve(parent, args, { io, prisma, sanitise, log }) {
			try {
				// Sanitize the input arguments
				args = sanitise(args);

				// Create a new User object
				const user = new User(prisma, log, io);

				// Authenticate the user
				const exists = await user.signIn_apiKey({
					id: args.id,
					secretkey: args.secretkey,
				});

				// Return if the user is invalid
				if (!exists) return;

				// Edit the user details based on the request
				return await user.editDetails(args);
			} catch (e) {
				// Log any errors
				log(e);
				return;
			}
		},
	},
};

// Export the UserMutations object
module.exports = UserMutations;
