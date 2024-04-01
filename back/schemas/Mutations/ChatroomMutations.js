// Importing required modules and types
const { GraphQLString } = require("graphql");
const ChatroomType = require("../TypeDefs/ChatroomType");
const MessageType = require("../TypeDefs/MessageType");
const LinkType = require("../TypeDefs/LinkType.js");

const User = require("../../classes/user");
const Chatroom = require("../../classes/chatroom");

// Chatroom Mutations for creating, sending, and editing messages
const ChatroomMutations = {
	// Mutation to get location (create a new chatroom) and return its data
	getLocation: {
		type: ChatroomType,
		args: {
			id: { type: GraphQLString }, // User ID
			secretkey: { type: GraphQLString }, // User secret key for authentication
			username: { type: GraphQLString }, // Username of the other user to create chatroom with
		},
		async resolve(parent, args, { sanitise, prisma, io, auth, log, req }) {
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

				const chatroom = new Chatroom(prisma, log, io);

				return await chatroom.findChatroom({
					id: args.id,
					username: args.username,
				});
			} catch (e) {
				log(e);
				return;
			}
		},
	},

	// Mutation to send a message in a chatroom
	sendMessage: {
		type: MessageType,
		args: {
			id: { type: GraphQLString }, // User ID
			secretkey: { type: GraphQLString }, // User secret key for authentication
			chatroom: { type: GraphQLString }, // Chatroom ID
			content: { type: GraphQLString }, // Message content
			type: { type: GraphQLString }, // Message type (e.g., text, image, etc.)
		},
		async resolve(parent, args, { sanitise, io, prisma, auth, req, log }) {
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

				const chatroom = new Chatroom(prisma, log, io);

				return await chatroom.sendMessage({
					id: args.id,
					chatroom: args.chatroom,
					content: args.content,
					type: args.type,
				});
			} catch (e) {
				log(e);
				return;
			}
		},
	},

	// Mutation to edit a message in a chatroom
	editMessage: {
		type: LinkType,
		args: {
			id: { type: GraphQLString }, // User ID
			secretkey: { type: GraphQLString }, // User secret key for authentication
			chatroom: { type: GraphQLString }, // Chatroom ID
			message: { type: GraphQLString }, // Message ID
			edit: { type: GraphQLString }, // Edit action (read, unread, delete)
		},
		async resolve(parent, args, { prisma, io, req, log, sanitise, auth }) {
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

				const chatroom = new Chatroom(prisma, log, io);

				return chatroom.editMessage({
					id: args.id,
					chatroom: args.chatroom,
					message: args.message,
					edit: args.edit,
				});
			} catch (e) {
				log(e);
				return;
			}
		},
	},
};

module.exports = ChatroomMutations;
