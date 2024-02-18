const graphql = require("graphql")
const { GraphQLObjectType, GraphQLSchema, GraphQLInt, GraphQLString, GraphQLList } = require("graphql")
const { graphqlHTTP } = require("express-graphql")
const fs = require("fs")
const bcrypt = require("bcrypt")

const users = require("../../USER_DATA.json")
const sensitive = require("../../SENSITIVE_USER_DATA.json")


const UserType = require("../TypeDefs/UserType")
const SensitiveUserDataType = require("../TypeDefs/SensitiveUserDataType")
const AuthorType = require("../TypeDefs/AuthorType")
const LinkType = require("../TypeDefs/LinkType")




const UserMutations = {
    createUser: {
        type: SensitiveUserDataType,
        args: {
            firstName: { type: GraphQLString},
            lastName: { type: GraphQLString},
            username: { type: GraphQLString},
            password: { type: GraphQLString},
        },
        async resolve(parent, args, { prisma }) {

            try {
                const pass = await bcrypt.hash(args.password, 10)
                const { nanoid } = await import('nanoid')
                const apiKey = nanoid()
                console.log(args)
    
    
                const user = await prisma.user.create({
                    data: {
                        name: `${args.firstName} ${args.lastName}`,
                        username: args.username,
                        userData: {
                            create: {
                                password: pass,
                                secretkey: apiKey
                            }
                        }
                    }
                })
    
    
                return {
                    id: user.id,
                    secretkey: apiKey
                }
            } catch (e) {
                console.log(e)
                return
            }


        }
        },
        signIn: {
            type: SensitiveUserDataType,
            args: { 
                username: { type: GraphQLString },
                pass: { type: GraphQLString}, 
            },
            async resolve(parent, args, { io, prisma }) {
                const input = [ args.username.trim(), args.pass.trim() ]
                for(let i = 0; i < input.length; i++) {
                    const isValidLength = input[i].length > 0 && input[i].length <= 100
                    if(!isValidLength) return
                    input[i] = htmlSpecialChars(input[i])
                }
            
                function htmlSpecialChars(text) {
                  const map = {
                    '<': '&lt;',
                    '>': '&gt;',
                    '"': '&quot;',
                    "'": '&apos;',
                    '&': '&amp;',
                  }
              
                  return text.replace(/[<>"&]/g, (char) => map[char])
                }

                try {
                    const userData = await prisma.userData.findFirst({
                        where: {
                            user: {
                                username: input[0]
                            }
                        },
                        select: {
                            id: true,
                            secretkey: true,
                            password: true
                        }
                    })

                    const hash = await bcrypt.compare(input[1], userData.password)


                    if(hash) {
                        return {
                            id: userData.id,
                            secretkey: userData.secretkey
                        }
                    } else {
                        return
                    }
                } catch(e) {
                    console.log(e)
                    return
                }
            }
        },
        followUnfollowUser: {
            type: LinkType,
            args: { 
                id: { type: GraphQLString}, 
                secretkey: { type: GraphQLString }, 
                username: { type: GraphQLString }
            },
            async resolve(parent, args, { io, prisma }) {

                try {
                    
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
                
    
                    const recipient = await prisma.user.findFirst({
                        where: {
                            username: args.username
                        },
                        select: {
                            id: true,
                            socket: true
                        }
                    })
    
                    const followExists = await prisma.follow.count({
                        where: { 
                            OR: [
                                { AND: [ { followerId: args.id}, { followingId: recipient.id} ] },
                                { AND: [ { followerId: recipient.id}, { followingId: args.id} ] }
                            ]
                        }
                    })
    
                    
    
                    if (followExists) {
                        const follow = await prisma.follow.findFirst({
                            where: { 
                                OR: [
                                    { AND: [ { followerId: args.id}, { followingId: recipient.id} ] },
                                    { AND: [ { followerId: recipient.id}, { followingId: args.id} ] }
                                ]
                            },
                            select: {
                                id: true
                            }
                        })
                        await prisma.follow.delete({
                          where: { id: follow.id },
                        })
                    } else {
                        let follow = await prisma.follow.create({
                            data: {
                              followerId: args.id,
                              followingId: recipient.id
                            },
                            select: {
                                id: true,
                                follower: {
                                    select: {
                                        id: true,
                                        name: true,
                                        username: true
                                    }
                                }
                            }
                        })

                        io.to(recipient.socket).emit("followed", follow)
                    }
    
                    
    
                    return 

                } catch(e) {
                    console.log(e)
                    return
                }
            }
        },
        pendingRequest: {
            type: UserType,
            args: { id: { type: GraphQLString }, secretkey: { type: GraphQLString }, request: { type: GraphQLString}, action: { type: GraphQLString } },
            async resolve(parent, args, { io, prisma }) {

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

                
                const follow = await prisma.follow.findFirst({
                    where: { id: args.request },
                    select: {
                      follower: {
                        select: {
                          id: true,
                          username: true,
                          name: true
                        },
                      },
                      following: {
                        select: {
                          id: true,
                          username: true,
                          name: true
                        },
                      },
                      id: true
                    },
                })

                console.log(follow, "follow")

                



                switch(args.action) {
                    case "add":
                        await prisma.friendship.create({
                            data: {
                                userOneId: follow.follower.id,
                                userTwoId: follow.following.id
                            }
                        })

                        await prisma.follow.delete({
                            where: { id: follow.id }
                        })

                    case "remove": 
                        await prisma.follow.update({
                            where: {
                                id: args.request
                            },
                            data: {
                                denial: true
                            }
                        })
                }


                return {}
            }
        },
        editDetails: {
            type: SensitiveUserDataType,
            args: { id: { type: GraphQLString }, secretkey: { type: GraphQLString }, request: { type: GraphQLString}, data: { type: GraphQLString } },
            async resolve(parent, args, { io, prisma }) {
                try {
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


                    switch (args.request) {
                        case "name" :
                            await prisma.user.update({
                                where: {
                                    id: args.id
                                },
                                data: {
                                    name: args.data
                                }
                            })
                            return
                        case "username":
                            await prisma.user.update({
                                where: {
                                    id: args.id
                                },
                                data: {
                                    username: args.data
                                }
                            })
                            return
                        case "password":
                            const pass = await bcrypt.hash(args.data, 10)
                            const { nanoid } = await import('nanoid')
                            const apiKey = nanoid()

                            console.log("apikey", apiKey)
                            
                            await prisma.userData.update({
                                where: {
                                    id: args.id
                                },
                                data: {
                                    password: pass,
                                    secretkey: apiKey
                                }
                            })
                            return {
                                secretkey: apiKey
                            }
                    }

                    

                } catch(e) {
                    return
                }
            }
        }
    }

module.exports = UserMutations