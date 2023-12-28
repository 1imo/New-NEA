const graphql = require("graphql")
const { GraphQLObjectType, GraphQLSchema, GraphQLInt, GraphQLString, GraphQLList } = require("graphql")
const { graphqlHTTP } = require("express-graphql")
const fs = require("fs")

const users = require("../../USER_DATA.json")
const sensitive = require("../../SENSITIVE_USER_DATA.json")


const UserType = require("../TypeDefs/UserType")
const ShortUserType = require("../TypeDefs/ShortUserType")


const UserMutations = {
    createUser: {
        type: UserType,
        args: {
            firstName: { type: GraphQLString},
            lastName: { type: GraphQLString},
            username: { type: GraphQLString},
            password: { type: GraphQLString},
        },
        resolve(parent, args) {

            const newUser = {
                id: users.length + 1,
                firstName: args.firstName,
                lastName: args.lastName,
                username: args.username,
                posts: [],
                friends: [],
                friendCount: 0,
                followers: [],
                followerCount: 0,
                following: [],
                followingCount: 0,
                pending: [],
                chatrooms: [],
                avgRatio: 0.00
            }

            const sensitiveInfo = {
                id: users.length + 1,
                username: args.username,
                password: args.password,
                secretkey: args.username,
            }

            users.push(newUser)
            let updatedJson = JSON.stringify(users, null, 2)
            fs.writeFileSync(__dirname + "/../../USER_DATA.json", updatedJson)

            sensitive.push(sensitiveInfo)
            updatedJson = JSON.stringify(sensitive, null, 2);
            fs.writeFileSync(__dirname + "/../../SENSITIVE_USER_DATA.json", updatedJson);

            

            return newUser

            }
        },
        followUnfollowUser: {
            type: ShortUserType,
            args: { 
                id: { type: GraphQLInt}, 
                secretkey: { type: GraphQLString }, 
                username: { type: GraphQLString }
            },
            resolve(parent, args) {
                const user = users.find(user => user.id === args.id ? user : null)
                const secret = sensitive[user.id - 1]

                if(secret.id != user.id || secret.secretkey != user.secretkey) {
                    return
                }

                const inQuestion = users.find(user => user.username === args.username  ? user : null)

                let following = user.following.find(following => following.username === args.username ? following : null)
                let follower = inQuestion.followers.find(follower => follower.username === user.username ? follower : null)


                
                if(!following && !follower && user && inQuestion) {

                    follower = {
                        id: user.id,
                        username: user.username,
                        firstName: user.firstName,
                        lastName: user.lastName
                    }
    
                    following = {
                        id: inQuestion.id,
                        username: inQuestion.username,
                        firstName: inQuestion.firstName,
                        lastName: inQuestion.lastName
                    }


                    inQuestion.followers.push(follower)
                    inQuestion.followerCount+=1
                    user.following.push(following)
                    user.followingCount+=1

                    const updatedJson = JSON.stringify(users, null, 2);
                    fs.writeFileSync(__dirname + "/../../USER_DATA.json", updatedJson);

                } else if(following && follower && user && inQuestion) {
                    console.log("UNFOLLOW")

                    follower = {
                        id: user.id,
                        username: user.username,
                        firstName: user.firstName,
                        lastName: user.lastName
                    }
    
                    following = {
                        id: inQuestion.id,
                        username: inQuestion.username,
                        firstName: inQuestion.firstName,
                        lastName: inQuestion.lastName
                    }

                    const followingIndex = user.following.findIndex(following => following.username === args.username);
                    const followerIndex = inQuestion.followers.findIndex(follower => follower.username === user.username);

                    inQuestion.followers.splice(followerIndex, 1);
                    user.following.splice(followingIndex, 1);


                    inQuestion.followerCount-=1
                    user.followingCount-=1

                    const updatedJson = JSON.stringify(users, null, 2);
                    fs.writeFileSync(__dirname + "/../../USER_DATA.json", updatedJson);

                }

                console.log(follower, following)

                return following
            }
        },
    }

module.exports = UserMutations