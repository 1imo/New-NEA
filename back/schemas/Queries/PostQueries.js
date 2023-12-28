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
            resolve(parent, args) {
                const post = posts.find(post => post.id === args.id)
                return post
            }
        },
        profileInfo: {
            type: UserType,
            args: { username: { type: GraphQLString }},
            resolve(parent, args) {
                const user = users.find(user => user.username === username ? user : null)
                return {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    username: user.username,
                    followerCount: user.followerCount,
                    followingCount: user.followingCount,
                    friendCount: user.friendCount
                }
            }
        },
        getFriends: {
            type: UserType,
            args: { username: { type: GraphQLString }},
            resolve(parent, args) {
                const user = users.find(user => user.username === username ? user : null)
                
            }
        }
    }

module.exports = PostQuery
