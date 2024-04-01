const crypto = require("crypto");

class Chatroom {
	constructor(prisma, log, io) {
		this.prisma = prisma;
		this.log = log;
		this.io = io;
	}

	// Create a new chatroom or return an existing one
	// Arguments: id (user), username (recipient)
	async findChatroom(args) {
		try {
			// Retreive users
			const users = await this.prisma.user.findMany({
				where: {
					OR: [
						{
							id: args.id,
						},
						{
							username: args.username,
						},
					],
				},
				select: {
					id: true,
					socket: true,
				},
			});

			if (users.length < 2) return;

			// Find Chatrooms with the users
			const chatroom = await this.prisma.chatroom.findFirst({
				where: {
					chatroomUsers: {
						every: {
							userId: {
								in: users.map((user) => user.id),
							},
						},
					},
				},
				select: {
					id: true,
				},
			});

			// Return the chatroom id if it exists
			if (chatroom) return { id: chatroom.id };

			// Create a new chatroom if it doesn't exist
			const c = await this.prisma.chatroom.create({
				data: {
					id: crypto.randomBytes(32).toString("hex"),
					chatroomUsers: {
						create: users.map((user) => {
							return {
								userId: user.id,
							};
						}),
					},
				},
				select: {
					id: true,
					chatroomUsers: {
						select: {
							user: {
								select: {
									id: true,
									name: true,
									username: true,
									socket: true,
								},
							},
						},
					},
				},
			});

			// Prepare the chatroom data to be sent to the client
			const chat = {
				id: c.id,
				chatroomUsers: c.chatroomUsers,
				messages: [],
				lastMessage: {},
			};

			// Emit the new chatroom to all users
			users.forEach((user) =>
				this.io.to(user.socket).emit("updatedChat", chat)
			);

			return chat;
		} catch (e) {
			this.log(e);
			return;
		}
	}

	// Get a chatroom
	// Arguments: chatId
	async getChatroom(args) {
		try {
			const chatroom = await this.prisma.chatroom.findFirst({
				where: {
					id: args.chatId,
				},
				select: {
					id: true,
					messages: {
						orderBy: {
							date: "desc",
						},
						select: {
							id: true,
							content: true,
							date: true,
							type: true,
							read: true,
							sender: {
								select: {
									id: true,
									name: true,
									username: true,
								},
							},
						},
					},
					chatroomUsers: {
						select: {
							user: {
								select: {
									id: true,
									name: true,
									username: true,
								},
							},
						},
					},
				},
			});

			return {
				id: chatroom.id,
				chatroomUsers: chatroom.chatroomUsers.map((user) => user.user),
				messages: chatroom.messages,
			};
		} catch (e) {
			this.log(e);
			return;
		}
	}

	// Send a message to a chatroom
	// Arguments: id (user), secretkey, chatroom, content, type
	async sendMessage(args) {
		try {
			// Join query to retrieve the participants of the chatroom
			const chatroom = await this.prisma.chatroom.findFirst({
				where: { id: args.chatroom },
				include: {
					chatroomUsers: {
						select: {
							user: {
								select: {
									socket: true,
								},
							},
						},
					},
				},
			});

			// Create a new message
			const message = await this.prisma.message.create({
				data: {
					content: args.content,
					senderId: args.id,
					chatroomId: chatroom.id,
					type: args.type,
				},
				select: {
					id: true,
					sender: {
						select: {
							id: true,
							username: true,
							name: true,
						},
					},
					content: true,
					type: true,
					date: true,
					read: true,
				},
			});

			// Emit the new message to all users in the chatroom
			chatroom.chatroomUsers.forEach((user) => {
				this.io.to(user.user.socket).emit("chatroom", message);
				this.io.to(user.user.socket).emit("updatedChat", message);
			});

			return message;
		} catch (e) {
			this.log(e);
			return;
		}
	}

	// Edit a message in a chatroom
	// Arguments: id (user), chatroom, message, edit
	async editMessage(args) {
		try {
			// Fetch the chatroom data with associated users' sockets
			const chatroom = await this.prisma.chatroom.findFirst({
				where: {
					id: args.chatroom,
				},
				select: {
					chatroomUsers: {
						select: {
							user: {
								select: {
									socket: true,
								},
							},
						},
					},
				},
			});

			let updatedData = {};

			// Prepare update data based on the edit action
			if (args.edit === "read") {
				updatedData.read = true;
			} else if (args.edit === "unread") {
				updatedData.read = false;
			} else if (args.edit === "delete") {
				updatedData.content = "This message has been deleted";
			}

			// One store of message for DRY
			let msg;

			// Update the message if necessary
			if (Object.keys(updatedData).length > 0) {
				// Check so that only the sender can delete their message
				if (args.edit === "delete") {
					msg = await this.prisma.message.update({
						where: {
							id: args.message,
							senderId: args.id,
						},
						data: updatedData,
						select: {
							id: true,
							sender: {
								select: {
									id: true,
									username: true,
									name: true,
								},
							},
							content: true,
							type: true,
							date: true,
							read: true,
						},
					});
				} else {
					msg = await this.prisma.message.update({
						where: {
							id: args.message,
						},
						data: updatedData,
						select: {
							id: true,
							sender: {
								select: {
									id: true,
									username: true,
									name: true,
								},
							},
							content: true,
							type: true,
							date: true,
							read: true,
						},
					});
				}
			}

			// Emit the updated chat data to all users in the chatroom
			chatroom.chatroomUsers.forEach((user) => {
				this.io.to(user.user.socket).emit("chatroom", msg);
			});

			return;
		} catch (e) {
			this.log(e);
			return;
		}
	}
}

module.exports = Chatroom;
