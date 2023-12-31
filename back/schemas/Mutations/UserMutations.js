const graphql = require("graphql")
const { GraphQLObjectType, GraphQLSchema, GraphQLInt, GraphQLString, GraphQLList } = require("graphql")
const { graphqlHTTP } = require("express-graphql")
const fs = require("fs")

const users = require("../../USER_DATA.json")
const sensitive = require("../../SENSITIVE_USER_DATA.json")


const UserType = require("../TypeDefs/UserType")
const SensitiveUserDataType = require("../TypeDefs/SensitiveUserDataType")
const AuthorType = require("../TypeDefs/AuthorType")



const UserMutations = {
    createUser: {
        type: SensitiveUserDataType,
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

            

            return sensitiveInfo

            }
        },
        followUnfollowUser: {
            type: UserType,
            args: { 
                id: { type: GraphQLInt}, 
                secretkey: { type: GraphQLString }, 
                username: { type: GraphQLString }
            },
            resolve(parent, args, { io }) {
                const user = users.find(user => user.id === args.id ? user : null)
                const secret = sensitive[user.id - 1]

                if(secret.id != args.id || secret.secretkey != args.secretkey) {
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

                    const inPending = inQuestion.pending.findIndex(pen => pen.id === follower.id)

                    if(inPending == -1) {
                        inQuestion.pending.push(follower)
                    }


                    
                    const updatedJson = JSON.stringify(users, null, 2);
                    fs.writeFileSync(__dirname + "/../../USER_DATA.json", updatedJson);
                    
                    io.to(inQuestion.socket).emit("followed", follower)

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
                    const pendingIndex = inQuestion.pending.findIndex(pending => pending.id === user.id)

                    inQuestion.followers.splice(followerIndex, 1)
                    user.following.splice(followingIndex, 1)
                    inQuestion.pending.splice(pendingIndex, 1)

                    


                    inQuestion.followerCount-=1
                    user.followingCount-=1

                    const updatedJson = JSON.stringify(users, null, 2);
                    fs.writeFileSync(__dirname + "/../../USER_DATA.json", updatedJson);

                }

                console.log(follower, following)

                return following
            }
        },
        pendingRequest: {
            type: UserType,
            args: { id: { type: GraphQLInt }, secretkey: { type: GraphQLString }, request: { type: GraphQLInt}, action: { type: GraphQLString } },
            resolve(parent, args, { io }) {
                console.log("HITTTTT")
                console.log(args, "ARGS")
                const user = users.find(user => user.id === args.id ? user : null)
                const secret = sensitive[user.id - 1]

                if(secret.id != args.id || secret.secretkey != args.secretkey) {
                    return
                }

                const specified = user.pending.find(pending => pending.id === args.request)

                const recipient = users.find(rec => rec.id === specified.id)

                switch(args.action) {
                    case "add":
                        let index = user.followers.findIndex(us => us.id === specified.id)
                        user.followers.splice(index, 1)
                        user.friends.push(specified)
                        user.friendCount+=1
                        user.followerCount-=1

                        index = recipient.following.findIndex(us => us.id === user.id)
                        recipient.following.splice(index, 1)
                        recipient.friends.push({
                            id: user.id,
                            firstName: user.firstName,
                            lastName: user.lastName,
                            username: user.username
                        })
                        recipient.friendCount+=1
                        recipient.followingCount-=1

                        index = user.pending.findIndex(pen => pen.id === specified.id)
                        user.pending.splice(index, 1)
                    
                    case "remove": 
                        index = user.pending.findIndex(pen => pen.id === specified.id)
                        user.pending.splice(index, 1)
                }

                const updatedJson = JSON.stringify(users, null, 2)
                fs.writeFileSync(__dirname + "/../../USER_DATA.json", updatedJson)

                return user
            }
        }
    }

module.exports = UserMutations