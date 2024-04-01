// Importing required types from the 'graphql' package
const { GraphQLString, GraphQLList } = require("graphql");

// Importing the ChatroomType
const ChatroomType = require("../TypeDefs/ChatroomType");

// Importing classes
const User = require("../../classes/User");
const Chatroom = require("../../classes/Chatroom");

// Defining the ChatroomQueries object
const ChatroomQueries = {
	// Query to get data for a specific chatroom
	getChatroomData: {
		type: ChatroomType,
		args: {
			id: { type: GraphQLString }, // User ID
			secretkey: { type: GraphQLString }, // User's secret key for authentication
			chatId: { type: GraphQLString }, // Chatroom ID
		},
		async resolve(parent, args, { prisma, sanitise, auth, log, req }) {
			try {
				// Sanitize the input arguments
				args = sanitise(args);

				// Create a new User object
				const user = new User(prisma, log);

				// Authenticate the user
				const exists = await user.signIn_apiKey({
					id: args.id,
					secretkey: args.secretkey,
				});

				// Return if the user is invalid
				if (!exists) return;

				const chatroom = new Chatroom(prisma, log);

				return await chatroom.getChatroom({ chatId: args.chatId });
			} catch (e) {
				// Log any errors
				log(e);
				return;
			}
		},
	},

	// Query to get a list of chatrooms for a user
	getChats: {
		type: new GraphQLList(ChatroomType), // Return type is a list of ChatroomType
		args: {
			id: { type: GraphQLString }, // User ID
			secretkey: { type: GraphQLString }, // User's secret key for authentication
		},
		async resolve(parent, args, { prisma, auth, sanitise, log, req }) {
			try {
				// Sanitize the input arguments
				args = sanitise(args);

				// Create a new User object
				const user = new User(prisma, log);

				// Authenticate the user
				const exists = await user.signIn_apiKey({
					id: args.id,
					secretkey: args.secretkey,
				});

				// Return if the user is invalid
				if (!exists) return;

				return await user.getChats({ id: args.id });
			} catch (e) {
				// Log any errors
				log(e);
				return;
			}
		},
	},
};

// Export the ChatroomQueries object
module.exports = ChatroomQueries;
