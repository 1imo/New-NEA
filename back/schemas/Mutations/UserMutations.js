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

            const pass = await bcrypt.hash(args.password, 10)
            const { nanoid } = await import('nanoid')
            const apiKey = nanoid();


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
                        id: true
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
                    await prisma.follow.create({
                        data: {
                          followerId: args.id,
                          followingId: recipient.id
                        },
                    })
                }

                

                return {
                    url: "#"
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
        }
    }

module.exports = UserMutations