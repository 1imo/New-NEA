const graphql = require("graphql")
const { GraphQLObjectType, GraphQLSchema, GraphQLInt, GraphQLString, GraphQLList } = require("graphql")
const { graphqlHTTP } = require("express-graphql")
const fs = require("fs")

const UserType = require("../TypeDefs/UserType")
const PostType = require("../TypeDefs/PostType")

const userData = require("../../USER_DATA.json")
const postData = require("../../POST_DATA.json")
const sensitive = require("../../SENSITIVE_USER_DATA.json")

const PostMutations = {
    createPost: {
        type: PostType,
        args: { 
            id: { type: GraphQLInt},
            secretkey: { type: GraphQLString },
            content: { type: GraphQLString }
        },
        resolve(parent, args) {
            console.log("HERE")

            const user = userData.find(user => user.id === args.id ? user : null)
            const secret = sensitive[user.id - 1]

            console.log(user)
            console.log(secret)

            if(secret.id != args.id || secret.secretkey != args.secretkey) {
                return
            }
            
            const newPost = {
                id: postData.length + 1,
                content: args.content,
                author: {
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    username: user.username
                },
                date: new Date(),
                views: [],
                likes: [],
                avgRatio: user.avgRatio
            }

            user.posts = [...user.posts, newPost]



            postData.push(newPost)
            let updatedJson = JSON.stringify(postData, null, 2)
            fs.writeFileSync(__dirname + "/../../POST_DATA.json", updatedJson)
            updatedJson = JSON.stringify(userData, null, 2)
            fs.writeFileSync(__dirname + "/../../USER_DATA.json", updatedJson)

            return newPost

            }
        }
    }

module.exports = PostMutations