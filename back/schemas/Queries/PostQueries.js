const graphql = require("graphql")
const { GraphQLObjectType, GraphQLSchema, GraphQLInt, GraphQLString } = require("graphql")
const { graphqlHTTP } = require("express-graphql")

const UserType = require("../TypeDefs/UserType")
const PostType = require("../TypeDefs/PostType")

const posts = require("../../POST_DATA.json")
const users = require("../../USER_DATA.json")

const PostQuery = {
        getPost: {
            type: PostType,
            args: { id: { type: GraphQLInt}},
            async resolve(parent, args, { prisma }) {
                console.log(args, "ARGS")
                
                const post = await prisma.post.findFirst({
                    where: {
                        id: args.id
                    },
                    select: {
                        id: true,
                        content: true,
                        photo: true,
                        user: {
                            select: {
                                name: true,
                                username: true,
                                id: true
                            }
                        }
                    }
                })

                // console.log(post,)
                
                return post
            }
        },
        profileInfo: {
            type: UserType,
            args: { username: { type: GraphQLString }},
            async resolve(parent, args, { prisma }) {

                const user = await prisma.user.findFirst({
                    where: {
                        id: args.id
                    }
                })


                return {
                    firstName: user.name.split(" ")[0],
                    lastName: user.name.split(" ")[1],
                    username: user.username,
                    followerCount: user.followers.length,
                    followingCount: user.following.length,
                    friendCount: user.friends.length + user.friendshipsReceived.length
                }
            }
        },
        getFriends: {
            type: new graphql.GraphQLList(UserType),
            args: { username: { type: GraphQLString }},
            async resolve(parent, args) {
            
                const user = await prisma.user.findFirst({
                    where: {
                        id: args.id
                    },
                    select: {
                        friends: true,
                        friendshipsReceived: true
                    }
                })

                return [ ...user.friends, ...user.friendshipsReceived ]
                
            }
        }
    }

module.exports = PostQuery
