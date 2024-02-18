// const users = require("../../USER_DATA.json")
const graphql = require("graphql")
const { GraphQLObjectType, GraphQLSchema, GraphQLInt, GraphQLString, GraphQLList } = require("graphql")
const { graphqlHTTP } = require("express-graphql")
const ChatroomType = require("../TypeDefs/ChatroomType")
const UserType = require("../TypeDefs/UserType")

// const users = require("../../USER_DATA.json")
// const posts = require("../../POST_DATA.json")
// const chatrooms = require("../../CHATROOM_DATA.json")



const ChatroomQueries = {
        getChats: {
            type: new GraphQLList(ChatroomType),
            args: { id: { type: GraphQLString }, secretkey: { type: GraphQLString }},
            async resolve(parent, args, { prisma, io, socket }) {
                console.log("HIT")
                console.log(args)

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
                                                        username: true
                                                    }
                                                }
                                            }
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
                                        }
                                    }
                                }
                            }
                        }
                    }
                })

                // console.log(chatrooms)
                const insights = []

                chatrooms.chatroomUsers.map(chatroomUser => {
                    // console.log(chatroomUser)
                    const chatroom = chatroomUser.chatroom
                    const lastMessage = chatroom.messages[0]

                    
                    const recipients = chatroom.chatroomUsers.map(author => author.user)
                    
                    // console.log(recipient)
                    console.log(recipients)
                  
                    insights.push({
                      id: chatroom.id,
                      chatroomUsers: recipients,
                      lastMessage
                    })
                })

                

                console.log(insights)

                return insights
            }
        }
    }


module.exports = ChatroomQueries