const {GraphQLString, GraphQLList} = require('graphql')
const ChatroomType = require('../TypeDefs/ChatroomType')

const ChatroomQueries = {
  getChats: {
    type: new GraphQLList(ChatroomType),
    args: {id: {type: GraphQLString}, secretkey: {type: GraphQLString}},
    async resolve(parent, args, {prisma, auth, sanitise, log}) {
      try {
        args = sanitise(args)
        const exists = await auth(args.id, args.secretkey)

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
