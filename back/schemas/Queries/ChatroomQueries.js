// Importing required types from the 'graphql' package
const {GraphQLString, GraphQLList} = require('graphql')

// Importing the ChatroomType (likely a custom GraphQL type definition)
const ChatroomType = require('../TypeDefs/ChatroomType')

// Defining the ChatroomQueries object
const ChatroomQueries = {
  // Query to get data for a specific chatroom
  getChatroomData: {
    type: ChatroomType,
    args: {
      id: {type: GraphQLString}, // User ID
      secretkey: {type: GraphQLString}, // User's secret key for authentication
      chatId: {type: GraphQLString}, // Chatroom ID
    },
    async resolve(parent, args, {prisma, sanitise, auth, log, req}) {
      try {
        // Sanitize the input arguments
        args = sanitise(args)
        // Authenticate the user
        const exists = auth(args.id, args.secretkey, req)

        let chatroom = {}

        // Fetch the chatroom data along with messages and chatroom users
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

        // Extract the list of chatters from the chatroom data
        const chatters = chatroom.chatroomUsers.map((user) => user.user)

        // Return the chatroom data along with the list of chatters
        return {
          id: chatroom.id,
          chatroomUsers: chatters,
          messages: chatroom.messages,
          lastMessage: '',
        }
      } catch (e) {
        // Log any errors
        log(e)
        return
      }
    },
  },

  // Query to get a list of chatrooms for a user
  getChats: {
    type: new GraphQLList(ChatroomType), // Return type is a list of ChatroomType
    args: {
      id: {type: GraphQLString}, // User ID
      secretkey: {type: GraphQLString}, // User's secret key for authentication
    },
    async resolve(parent, args, {prisma, auth, sanitise, log, req}) {
      try {
        // Sanitize the input arguments
        args = sanitise(args)
        // Authenticate the user
        const exists = await auth(args.id, args.secretkey, req)

        // Fetch the user's chatrooms along with chatroom users and last message
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
                      take: 1, // Get only the last message
                      select: {
                        id: true,
                        content: true,
                        sender: {
                          select: {
                            name: true,
                            username: true,
                          },
                        },
                        read: true,
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

        // Process the chatroom data and prepare the response
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
        // Log any errors
        log(e)
        return
      }
    },
  },
}

// Export the ChatroomQueries object
module.exports = ChatroomQueries
