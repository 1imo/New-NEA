const {GraphQLString} = require('graphql')
const ChatroomType = require('../TypeDefs/ChatroomType')
const MessageType = require('../TypeDefs/MessageType')
const LinkType = require('../TypeDefs/LinkType.js')

// Changing Chatroom Data
const ChatroomMutations = {
  // Create Chatroom and return path to user
  getLocation: {
    type: ChatroomType,
    args: {
      id: {type: GraphQLString},
      secretkey: {type: GraphQLString},
      username: {type: GraphQLString},
    },
    async resolve(parent, args, {prisma, io, auth, log, req}) {
      try {
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

        const {nanoid} = await import('nanoid')
        const id = nanoid()

        const chatroom = await prisma.chatroom.create({
          data: {
            id,
          },
        })

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

        const chat = {
          id: data.id,
          chatroomUsers: data.chatroomUsers,
          messages: [],
          lastMessage: {},
        }

        io.to(userOne.socket).emit('updatedChat', chat)

        return chat
      } catch (e) {
        log(e)
        return
      }
    },
  },
  sendMessage: {
    type: MessageType,
    args: {
      id: {type: GraphQLString},
      secretkey: {type: GraphQLString},
      chatroom: {type: GraphQLString},
      content: {type: GraphQLString},
      type: {type: GraphQLString},
    },
    async resolve(parent, args, {io, prisma, auth, req}) {
      try {
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
  editMessage: {
    type: LinkType,
    args: {
      id: {type: GraphQLString},
      secretkey: {type: GraphQLString},
      chatroom: {type: GraphQLString},
      message: {type: GraphQLString},
      edit: {type: GraphQLString},
    },
    async resolve(parent, args, {prisma, io, socket, req}) {
      try {
        const exists = await auth(args.id, args.secretkey, req)

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
