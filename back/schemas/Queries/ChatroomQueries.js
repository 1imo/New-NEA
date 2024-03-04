const {GraphQLString, GraphQLList} = require('graphql')
const ChatroomType = require('../TypeDefs/ChatroomType')

const ChatroomQueries = {
  getChatroomData: {
    type: ChatroomType,
    args: {
      id: {type: GraphQLString},
      secretkey: {type: GraphQLString},
      chatId: {type: GraphQLString},
    },
    async resolve(parent, args, {prisma, sanitise, auth, log, req}) {
      try {
        args = sanitise(args)
        const exists = auth(args.id, args.secretkey, req)
        let chatroom = {}

        chatroom = await prisma.chatroom.findFirst({
          where: {
            id: args.chatId,
          },
          select: {
            id: true,
            messages: {
              orderBy: {
                date: 'desc',
              },
              select: {
                id: true,
                content: true,
                date: true,
                type: true,
                sender: {
                  select: {
                    id: true,
                    name: true,
                    username: true,
                  },
                },
                read: true,
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
        })

        const chatters = chatroom.chatroomUsers.map((user) => user.user)

        return {
          id: chatroom.id,
          chatroomUsers: chatters,
          messages: chatroom.messages,
          lastMessage: '',
        }
      } catch (e) {
        log(e)
        return
      }
    },
  },
  getChats: {
    type: new GraphQLList(ChatroomType),
    args: {id: {type: GraphQLString}, secretkey: {type: GraphQLString}},
    async resolve(parent, args, {prisma, auth, sanitise, log, req}) {
      try {
        args = sanitise(args)
        const exists = await auth(args.id, args.secretkey, req)

        const chatrooms = await prisma.user.findFirst({
          where: {
            id: args.id,
          },
          select: {
            chatroomUsers: {
              select: {
                chatroom: {
                  select: {
                    id: true,
                    chatroomUsers: {
                      select: {
                        user: {
                          select: {
                            name: true,
                            id: true,
                            username: true,
                          },
                        },
                      },
                    },
                    messages: {
                      orderBy: {
                        date: 'desc',
                      },
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
        })

        const insights = []

        chatrooms.chatroomUsers.map((chatroomUser) => {
          const chatroom = chatroomUser.chatroom
          const lastMessage = chatroom.messages[0]

          const recipients = chatroom.chatroomUsers.map((author) => author.user)

          insights.push({
            id: chatroom.id,
            chatroomUsers: recipients,
            lastMessage,
          })
        })

        return insights
      } catch (e) {
        log(e)
        return
      }
    },
  },
}

module.exports = ChatroomQueries
