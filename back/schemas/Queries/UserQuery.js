const users = require("../../USER_DATA.json")
const sensitive = require("../../SENSITIVE_USER_DATA.json")
const graphql = require("graphql")
const { GraphQLObjectType, GraphQLSchema, GraphQLInt, GraphQLString, GraphQLList } = require("graphql")
const { graphqlHTTP } = require("express-graphql")
const UserType = require("../TypeDefs/UserType")
const PostType = require("../TypeDefs/PostType")
const AuthorType = require("../TypeDefs/AuthorType")


const UserQuery = {
        navInfo: {
            type: UserType,
            args: { id: { type: GraphQLInt}},
            resolve(parent, args) {
                const user = users.find(user => user.id === args.id ? user : null)
                console.log(users[args.id])

                return user
            }
        },
        getPublicInfo: {
            type: UserType,
            args: { username: { type: GraphQLString }},
            resolve(parent, args) {
                const user = users.find(user => user.username === args.username ? user : null)

                return user
            }
        },
        getAllPosts: {
            type: new GraphQLList(PostType),
            args: { username: { type: GraphQLString }}, 
            resolve(parent, args) {
                const user = users.find(user => user.username === args.username ? user : null)
                
                return user.posts
            }
        },
        getUserSearchResults: {
            type: new GraphQLList(UserType),
            args: { username: { type: GraphQLString }, type: { type: GraphQLString }},
            resolve(parent, args) {
                const applicableUsernames = users.filter(user => user.username.includes(args.username));
                const applicableNames = users.filter(user => user.firstName.includes(args.username));
               
                const raw = [ ... applicableUsernames, ...applicableNames ]

                const res = raw.filter((val, index) => raw.indexOf(val) ===  index)
                
                return res
            }
        },
        getPending: {
            type: new GraphQLList(AuthorType),
            args: { id: { type: GraphQLInt }, secretkey: { type: GraphQLString } },
            resolve(parent, args) {
                const user = users.find(user => user.id === args.id ? user : null)
                const secret = sensitive[user.id - 1]

                if(secret.id != args.id || secret.secretkey != args.secretkey) {
                    return
                }


                return user.pending
            }
        },
        getFeed: {
            type: new GraphQLList(PostType),
            args: { id: { type: GraphQLInt }, secretkey: { type: GraphQLString } },
            resolve(parent, args) {
                const user = users.find(user => user.id === args.id ? user : null)
                const secret = sensitive[user.id - 1]

                if(secret.id != args.id || secret.secretkey != args.secretkey) {
                    return
                }

                const followingPosts = []
                const friendsPosts = []

                for(let i = 0; i < user.following.length; i++) {
                    const following = users.find(us => us.id === user.following[i].id ? us : null)
                    following.posts.map(post => followingPosts.unshift(post))
                }

                for(let i = 0; i < user.friends.length; i++) {
                    const friends = users.find(us => us.id === user.friends[i].id ? us : null)
                    friends.posts.map(post => friendsPosts.unshift(post))
                }
                
                

                console.log(friendsPosts, followingPosts, "POSTS")
                
                
                let followingAvgRatio = 0
                let friendsAvgRatio = 0
                console.log(followingAvgRatio)
                console.log(friendsAvgRatio)

                if(followingPosts) {
                    for(let i = 0; i < followingPosts.length; i++) {
 
                        followingAvgRatio+=followingPosts[i].avgRatio
                        
                    }
                }

                if(friendsPosts) {
                    for(let i = 0; i < friendsPosts.length; i++) {
                        
                        friendsAvgRatio+=friendsPosts[i].avgRatio
                        
                    }
                }


                const multiplier = followingAvgRatio / friendsAvgRatio ? followingAvgRatio / friendsAvgRatio : 1

                console.log(followingAvgRatio, friendsAvgRatio, multiplier, "RATIOS")

                let swaps = 0;

                function swapDate(arr) {
                    for(let i = 0; i < arr.length; i++) {
                        if(i + 1 != arr.length) {
                            if(arr[i].date < arr[i+1].data) {
                                const temp = arr[i]
                                arr[i] = arr[i+1]
                                arr[i+1] = temp
                                swaps+=1
                            }
                        }
                    }

                    if(swaps != 0) {
                        swaps = 0
                        swapDate(arr)
                    }
                }

                swapDate(followingPosts)
                swapDate(friendsPosts)

                const raw = []

                if(multiplier > 1) {
                    for(let i = 0; i < friendsPosts.length; i++) {
                        const copy = { ...friendsPosts[i] }
                        copy.avgRatio = copy.avgRatio * multiplier / i
                        raw.push(copy)
                    }

                    for(let i = 0; i < followingPosts.length; i++) {
                        const copy = { ...followingPosts[i] }
                        copy.avgRatio = copy.avgRatio / i
                        raw.push(copy)
                    }
                } else {
                    for(let i = 0; i < friendsPosts.length; i++) {
                        const copy = { ...friendsPosts[i] }
                        copy.avgRatio = copy.avgRatio / i
                        raw.push(copy)
                    }

                    for(let i = 0; i < followingPosts.length; i++) {
                        const copy = { ...followingPosts[i] }
                        copy.avgRatio = copy.avgRatio / i
                        raw.push(copy)
                    }
                }

                function swapRatio(arr) {
                    for(let i = 0; i < arr.length; i++) {
                        if(i + 1 != arr.length) {
                            if(arr[i].avgRatio < arr[i+1].avgRatio) {
                                const temp = arr[i]
                                arr[i] = arr[i+1]
                                arr[i+1] = temp
                                swaps+=1
                            }
                        }
                    }

                    if(swaps != 0) {
                        swaps = 0
                        swapRatio(arr)
                    }
                }

                swapRatio(raw)


                return raw


            }
        }
    }


module.exports = UserQuery