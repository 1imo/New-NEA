const graphql = require("graphql")
const { GraphQLObjectType, GraphQLSchema, GraphQLInt, GraphQLString, GraphQLList } = require("graphql")
const { graphqlHTTP } = require("express-graphql")
const fs = require("fs")

const update = require("../../index.js");

const UserType = require("../TypeDefs/UserType")
const PostType = require("../TypeDefs/PostType")

const users = require("../../USER_DATA.json")
const posts = require("../../POST_DATA.json")
const chatrooms = require("../../CHATROOM_DATA.json")
const sensitive = require("../../SENSITIVE_USER_DATA.json")
const ChatroomType = require("../TypeDefs/ChatroomType")
const MessageType = require("../TypeDefs/MessageType");
const LinkType = require("../TypeDefs/LinkType.js")


const ChatroomMutations = {
    getLocation: {
        type: ChatroomType,
        args: { id: { type: GraphQLString }, secretkey: { type: GraphQLString }, username: { type: GraphQLString }},
        async resolve(parent, args, { prisma, io }) {
            
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

            

            
            const userOne = await prisma.user.findFirst({
                where: {
                    id: args.id
                },
                select: {
                    id: true,
                    socket: true
                }
            })

            const userTwo = await prisma.user.findFirst({
                where: {
                    username: args.username
                },
                select: {
                    id: true
                }
            })

            console.log("BELOW")

            const { nanoid } = await import('nanoid')
            const id = nanoid()

            try {
                const chatroom = await prisma.chatroom.create({
                    data: {
                        id
                    }
                })

                console.log(chatroom, "CHAT")
    
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
                        id: chatroom.id
                    },
                    select: { 
                        id: true, 
                        chatroomUsers: {
                            select: {
                                user: {
                                    select: {
                                        id: true,
                                        name: true,
                                        username: true
                                    }
                                }
                            }
                        }
                    }
                })
    
                console.log(data)


                const chat = {
                    id: data.id,
                    chatters: data.chatroomUsers,
                    messages: [],
                    lastMessage: {}
                }
    
    
    
                io.to(userOne.socket).emit("updatedChat", chat)
    
    
                return chat
            } catch(e) {
                console.log(e)
            }


        }
    },
    sendMessage: {
        type: MessageType,
        args: { id: { type: GraphQLString }, secretkey: { type: GraphQLString }, chatroom: { type: GraphQLString }, content: { type: GraphQLString }},
        async resolve(parent, args, { io, prisma }) {
            
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


            const chatroom = await prisma.chatroom.findFirst({
                where: {
                    id: args.chatroom
                },
                select: {
                    id: true,
                    chatroomUsers: {
                        select: {
                            user: {
                                select: {
                                    socket: true
                                }
                            }
                        }
                    }
                }
            })

            


            const sender = await prisma.user.findFirst({
                where: {
                    id: args.id
                },
                select: {
                    id: true,
                }
            })

            const message = await prisma.message.create({
                data: {
                    content: args.content,
                    senderId: sender.id,
                    chatroomId: chatroom.id
                },
                select: {
                    id: true,
                    sender: {
                        select: {
                            id: true,
                            username: true,
                            name: true
                        }
                    },
                    content: true,
                    date: true,
                    read: true
                }
            })

            
            chatroom.chatroomUsers.map(user => {
                io.to(user.user.socket).emit("chatroom", message)
                io.to(user.user.socket).emit("updatedChat", message)
            })



            return message
        }
    },
    editMessage: {
        type: LinkType,
        args: { id: { type: GraphQLInt}, secretkey: { type: GraphQLString }, chatroom: { type: GraphQLString }, message: { type: GraphQLString }, edit: { type: GraphQLString }},
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
            

            const chatroom = await prisma.chatroom.findFirst({
                where: {
                    id: args.chatroom
                },
                select: {
                    chatroomUsers: {
                        select: {
                            user: {
                                select: {
                                    socket
                                }
                            }
                        }
                    }
                }
            })

            switch(args.edit) {
                case "read":
                    await prisma.message.update({
                        where: {
                            id: args.message
                        },
                        data: {
                            read: true
                        }
                    })
                case "unread":
                    await prisma.message.update({
                        where: {
                            id: args.message
                        },
                        data: {
                            read: false
                        }
                    })
                case "delete":
                    await prisma.message.update({
                        where: {
                            id: args.message
                        },
                        data: {
                            content: "This message has been deleted"
                        }
                    })
            }


            chatroom.chatroomUsers.map(user => {
                io.to(user.socket).emit("chatroom", chatroom)
                io.to(user.socket).emit("updatedChat", chatroom)
            })



            return {
                url: "#"
            }

        }
    }
}

module.exports = ChatroomMutations