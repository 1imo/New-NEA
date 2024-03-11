// Importing required modules and types
const {GraphQLString} = require('graphql')
const ChatroomType = require('../TypeDefs/ChatroomType')
const MessageType = require('../TypeDefs/MessageType')
const LinkType = require('../TypeDefs/LinkType.js')

// Chatroom Mutations for creating, sending, and editing messages
const ChatroomMutations = {
  // Mutation to get location (create a new chatroom) and return its data
  getLocation: {
    type: ChatroomType,
    args: {
      id: {type: GraphQLString}, // User ID
      secretkey: {type: GraphQLString}, // User secret key for authentication
      username: {type: GraphQLString}, // Username of the other user to create chatroom with
    },
    async resolve(parent, args, {prisma, io, auth, log, req}) {
      try {
        // Authenticate the user and fetch user data
        const [exists, userOne, userTwo] = await Promise.all([
          auth(args.id, args.secretkey, req),
          prisma.user.findFirst({
            where: {
              id: args.id,
            },
            select: {
              id: true,
              socket: true,
            },
          }),
          prisma.user.findFirst({
            where: {
              username: args.username,
            },
            select: {
              id: true,
            },
          }),
        ])

        // Generate a unique chatroom ID
        const {nanoid} = await import('nanoid')
        const id = nanoid()

        // Create a new chatroom
        const chatroom = await prisma.chatroom.create({
          data: {
            id,
          },
        })

        // Associate the two users with the newly created chatroom
        await prisma.chatroomUser.create({
          data: {
            chatroomId: chatroom.id,
            userId: userOne.id,
          },
        })

        await prisma.chatroomUser.create({
          data: {
            chatroomId: chatroom.id,
            userId: userTwo.id,
          },
        })

        // Fetch the chatroom data with associated users
        const data = await prisma.chatroom.findFirst({
          where: {
            id: chatroom.id,
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
                  },
                },
              },
            },
          },
        })

        // Prepare the chatroom data to be sent to the client
        const chat = {
          id: data.id,
          chatroomUsers: data.chatroomUsers,
          messages: [],
          lastMessage: {},
        }

        // Emit the updated chat data to the first user
        io.to(userOne.socket).emit('updatedChat', chat)

        return chat
      } catch (e) {
        log(e)
        return
      }
    },
  },

  // Mutation to send a message in a chatroom
  sendMessage: {
    type: MessageType,
    args: {
      id: {type: GraphQLString}, // User ID
      secretkey: {type: GraphQLString}, // User secret key for authentication
      chatroom: {type: GraphQLString}, // Chatroom ID
      content: {type: GraphQLString}, // Message content
      type: {type: GraphQLString}, // Message type (e.g., text, image, etc.)
    },
    async resolve(parent, args, {io, prisma, auth, req}) {
      try {
        // Authenticate the user, fetch chatroom data, and sender data
        const [exists, chatroom, sender] = await Promise.all([
          auth(args.id, args.secretkey, req),
          prisma.chatroom.findFirst({
            where: {id: args.chatroom},
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
          }),
          prisma.user.findFirst({where: {id: args.id}, select: {id: true}}),
        ])

        // Create a new message
        const message = await prisma.message.create({
          data: {
            content: args.content,
            senderId: sender.id,
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
        })

        // Emit the new message to all users in the chatroom
        chatroom.chatroomUsers.map((user) => {
          console.log(user.user.socket, 'SOCKETS EMITTING TO')
          io.to(user.user.socket).emit('chatroom', message)
          io.to(user.user.socket).emit('updatedChat', message)
        })

        return message
      } catch (e) {
        console.log(e)
        return
      }
    },
  },

  // Mutation to edit a message in a chatroom
  editMessage: {
    type: LinkType,
    args: {
      id: {type: GraphQLString}, // User ID
      secretkey: {type: GraphQLString}, // User secret key for authentication
      chatroom: {type: GraphQLString}, // Chatroom ID
      message: {type: GraphQLString}, // Message ID
      edit: {type: GraphQLString}, // Edit action (read, unread, delete)
    },
    async resolve(parent, args, {prisma, io, socket, req}) {
      try {
        // Authenticate the user
        const exists = await auth(args.id, args.secretkey, req)

        // Fetch the chatroom data with associated users' sockets
        const chatroom = await prisma.chatroom.findFirst({
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
        })

        let updateData = {}

        // Prepare update data based on the edit action
        if (args.edit === 'read') {
          updateData.read = true
        } else if (args.edit === 'unread') {
          updateData.read = false
        } else if (args.edit === 'delete') {
          updateData.content = 'This message has been deleted'
        }

        // Update the message if necessary
        if (Object.keys(updateData).length > 0) {
          await prisma.message.update({
            where: {
              id: args.message,
            },
            data: updateData,
          })
        }

        // Emit the updated chat data to all users in the chatroom
        chatroom.chatroomUsers.map((user) => {
          io.to(user.socket).emit('updatedChat', updateData)
        })

        return
      } catch (e) {
        log(e)
        return
      }
    },
  },
}

module.exports = ChatroomMutations
