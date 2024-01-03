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
            args: { id: { type: GraphQLInt }, secretkey: { type: GraphQLString }, type: { type: GraphQLString } },
            resolve(parent, args) {
                console.log(args, "ARGS")
                const user = users.find(user => user.id === args.id ? user : null)
                const secret = sensitive[user.id - 1]

                if(secret.id != args.id || secret.secretkey != args.secretkey) {
                    return
                }

                

                let followingPosts = []
                let friendsPosts = []

                if(args.type != "Friends") {
                    for(let i = 0; i < user.following.length; i++) {
                        const following = users.find(us => us.id === user.following[i].id ? us : null)
                        following.posts.map(post => followingPosts.unshift(post))
                    }
                }

                if(args.type != "Following") {
                    for(let i = 0; i < user.friends.length; i++) {
                        const friends = users.find(us => us.id === user.friends[i].id ? us : null)
                        friends.posts.map(post => friendsPosts.unshift(post))
                    }
                }

                
                

                
                
                
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
                            if(arr[i].date < arr[i+1].date) {
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

                function mergeSort(arr) {
                    if (arr.length <= 1) {
                      return arr
                    }
                  
                    const mid = Math.floor(arr.length / 2)
                    const left = arr.slice(0, mid)
                    const right = arr.slice(mid)
                  
                    return merge(mergeSort(left), mergeSort(right))
                }
                  
                function merge(left, right) {
                  const result = []
                  let leftIndex = 0
                  let rightIndex = 0
                
                  while (leftIndex < left.length && rightIndex < right.length) {
                    if (left[leftIndex].date >= right[rightIndex].date) {
                      result.push(left[leftIndex])
                      leftIndex++
                    } else {
                      result.push(right[rightIndex])
                      rightIndex++
                    }
                  }
                
                  return result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex))
                }


                followingPosts = mergeSort(followingPosts)
                friendsPosts = mergeSort(friendsPosts)

                if(args.type == "Date") {
                    console.log("DATE")
                    let posts = [].concat(followingPosts).concat(friendsPosts)
                    posts = mergeSort(posts)
                    return posts
                }

                if(args.type == "Friends") {
                    console.log("FRIENDS")
                    return friendsPosts
                }

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
        },
        recommendedUsers: {
            type: new GraphQLList(AuthorType),
            args: { id: { type: GraphQLInt }},
            resolve(parent, args) {
                console.log(args, "DISCOVERTHISQUERY")
                const user = users.find(user => user.id === args.id ? user : null)

                const obj = {
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    username: user.username
                }


                return [ obj, obj ]

                // const friends = []
                // const following = []

                // const friendsOfFriends = [[], []]
                // const followingOfFriends = [[], []]


                // for(let i = 0; i < user.friends.length; i++) {
                //     const specified = users.find(us => us.id === user.friends[i].id)
                //     friends.push(specified)
                // }

                // for(let i = 0; i < user.following.length; i++) {
                //     const specified = users.find(us => us.id === user.following[i].id)
                //     following.push(specified)
                // }

                // console.log([ ...friends, ...following ])

                // return [ ...friends, ...following ]


                // for(let i = 0; i < friends.length; i++) {

                //     for(let x = 0; x < friends[i].friends.length; x++) {
                //         const specified = users.find(us => us.id === friends[i].friends[x].id)
                //         const copy = { ...specified }
                //         copy.avgRatio = copy.avgRatio * ( x + 1 )
                //         friendsOfFriends[0].push(copy)
                //     }

                //     for(let x = 0; x < friends[i].following.length; x++) {
                //         const specified = users.find(us => us.id === friends[i].following[x].id)
                //         const copy = { ...specified }
                //         copy.avgRatio = copy.avgRatio * ( x + 1 )
                //         friendsOfFriends[1].push(copy)
                //     }
                // }

                // for(let i = 0; i < following.length; i++) {

                //     for(let x = 0; x < following[i].friends.length; x++) {
                //         const specified = users.find(us => us.id === following[i].friends[x].id)
                //         const copy = { ...specified }
                //         copy.avgRatio = copy.avgRatio * ( x + 1 )
                //         followingOfFriends[0].push(copy)
                //     }

                //     for(let x = 0; x < following[i].following.length; x++) {
                //         const specified = users.find(us => us.id === following[i].following[x].id)
                //         const copy = { ...specified }
                //         copy.avgRatio = copy.avgRatio * ( x + 1 )
                //         followingOfFriends[1].push(copy)
                //     }
                // }

                // console.log([ ...friendsOfFriends[0], ...friendsOfFriends[1], ...followingOfFriends[0], ...followingOfFriends[1] ])

                // return [ ...friendsOfFriends[0], ...friendsOfFriends[1], ...followingOfFriends[0], ...followingOfFriends[1] ]


                // function mergeSort(arr) {
                //     if (arr.length <= 1) {
                //       return arr
                //     }
                  
                //     const mid = Math.floor(arr.length / 2)
                //     const left = arr.slice(0, mid)
                //     const right = arr.slice(mid)
                  
                //     return merge(mergeSort(left), mergeSort(right))
                // }
                  
                // function merge(left, right) {
                //   const result = []
                //   let leftIndex = 0
                //   let rightIndex = 0
                
                //   while (leftIndex < left.length && rightIndex < right.length) {
                //     if (left[leftIndex].avgRatio >= right[rightIndex].avgRatio) {
                //       result.push(left[leftIndex])
                //       leftIndex++
                //     } else {
                //       result.push(right[rightIndex])
                //       rightIndex++
                //     }
                //   }
                
                //   return result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex))
                // }

                // const friendsFriendsSorted = mergeSort(friendsOfFriends[0])
                // const followingFriendsSorted = mergeSort(friendsOfFriends[1])
                // const friendsFollowingSorted = mergeSort(followingOfFriends[0])
                // const followingFollowingSorted = mergeSort(followingOfFriends[1])
                

                // const formatted = [ ...friendsFriendsSorted, ...followingFollowingSorted, ...followingFriendsSorted, ...friendsFollowingSorted ]

                // console.log(formatted)

               

                // return formatted
                


            }
        }
    }


module.exports = UserQuery