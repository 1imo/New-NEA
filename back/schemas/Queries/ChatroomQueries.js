const users = require("../../USER_DATA.json")
const graphql = require("graphql")
const { GraphQLObjectType, GraphQLSchema, GraphQLInt, GraphQLString, GraphQLList } = require("graphql")
const { graphqlHTTP } = require("express-graphql")
const ChatroomType = require("../TypeDefs/ChatroomType")
const UserType = require("../TypeDefs/UserType")

const users = require("../../USER_DATA.json")
const posts = require("../../POST_DATA.json")
const chatrooms = require("../../CHATROOM_DATA.json")



const ChatroomQueries = {
        getChats: {
            type: GraphQLList(ChatroomType),
            args: { id: { type: GraphQLString }, secretkey: { type: GraphQLString }},
            async resolve(parent, args, { io, socket }) {

                const exists = await prisma.userData.count({
                    where: { 
                        AND: [
                            {id: args.id},
                            {secretkey: args.secretkey}
                        ] 
                    }
                })
    
                if(!exists) {
                    return
                }

                
                const chatrooms = await prisma.user.findFirst({
                    where: {
                        id: args.id
                    },
                    select: {
                        id: true,
                        chatroomUser: {
                            select: {
                                chatroom: {
                                    select: {
                                        id: true,
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
                                        }
                                    }
                                }
                            }
                        }
                    }
                })

                // hidden gem of idk what code lol
                // const chats = user.chatrooms.map(chat => { return chat })

                const insights = chatrooms.chatroomUser.map((chatroomUser) => {
                    const chatroom = chatroomUser.chatroom
                    const lastMessage = chatroom.messages[0]
                  
                    return {
                      id: chatroom.id,
                      chatters: chatroom.chatroomUsers.map(user => user.user),
                      lastMessage
                    }
                  })

                return insights
            }
        }
    }


module.exports = ChatroomQueries