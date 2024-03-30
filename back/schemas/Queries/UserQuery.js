// Imports
const {GraphQLString, GraphQLList} = require('graphql')
const UserType = require('../TypeDefs/UserType')
const PostType = require('../TypeDefs/PostType')
const AuthorType = require('../TypeDefs/AuthorType')
const ProfileType = require('../TypeDefs/ProfileType')
const PendingType = require('../TypeDefs/PendingType')
const ChatroomType = require('../TypeDefs/ChatroomType')

const UserQuery = {
  // Retrieves navigation information for a user
  navInfo: {
    type: UserType,
    args: {id: {type: GraphQLString}},
    async resolve(parent, args, {prisma, sanitise, log, req}) {
      try {
        args = sanitise(args)
        const user = await prisma.user.findFirst({
          where: {
            id: args.id,
          },
          select: {
            name: true,
            username: true,
          },
        })

        return user
      } catch (e) {
        log(e)
        return
      }
    },
  },

  // Retrieves public profile information for a user
  getPublicInfo: {
    type: ProfileType,
    args: {username: {type: GraphQLString}, id: {type: GraphQLString}},
    async resolve(parent, args, {prisma, sanitise, log}) {
      try {
        args = sanitise(args)
        const reqUser = await prisma.user.findFirst({
          where: {
            username: args.username,
          },
          select: {
            id: true,
            name: true,
            username: true,
            friends: true,
            friendshipsReceived: true,
            followers: true,
            following: true,
          },
        })

        if (!reqUser) return

        let status = 'Follow'

        const following = await prisma.follow.findFirst({
          where: {
            AND: [{followerId: args.id}, {followingId: reqUser.id}],
          },
          select: {
            id: true,
          },
        })

        if (!following) {
          const friends = await prisma.friendship.findFirst({
            where: {
              OR: [
                {AND: [{userOneId: args.id}, {userTwoId: reqUser.id}]},
                {AND: [{userOneId: reqUser.id}, {userTwoId: args.id}]},
              ],
            },
            select: {
              id: true,
            },
          })

          if (friends) {
            status = 'Friends'
          }
        } else {
          status = 'Following'
        }

        console.log(reqUser, 'REQUSER')

        return {
          id: reqUser.id,
          name: reqUser.name,
          username: reqUser.username,
          friendCount:
            reqUser.friends.length + reqUser.friendshipsReceived.length,
          followerCount: reqUser.followers.length,
          followingCount: reqUser.following.length,
          status,
        }
      } catch (e) {
        log(e)
        return
      }
    },
  },

  // Retrieves all posts for a user
  getAllPosts: {
    type: new GraphQLList(PostType),
    args: {username: {type: GraphQLString}},
    async resolve(parent, args, {prisma, sanitise, log}) {
      try {
        args = sanitise(args)
        const user = await prisma.user.findFirst({
          where: {
            username: args.username,
          },
          select: {
            posts: {
              select: {
                content: true,
                id: true,
                photo: true,
                date: true,
                avgRatio: true,
                multiplier: true,
                user: {
                  select: {
                    id: true,
                    username: true,
                    name: true,
                  },
                },
                likedBy: true,
                viewedBy: true,
              },
              orderBy: {
                date: 'asc',
              },
            },
          },
        })

        console.log(user.posts)

        const included = new Set()

        if (user) {
          user.posts.forEach((post) => {
            if (!included.has(post?.id)) {
              post.likes = post.likedBy
              post.views = post.viewedBy
              delete post.likedBy
              delete post.viewedBy
              included.add(post?.id)
            } else {
              delete post
            }
          })
        }

        return user.posts
      } catch (e) {
        log(e)
        return
      }
    },
  },

  // Retrieves user search results based on username or name
  getUserSearchResults: {
    type: new GraphQLList(UserType),
    args: {username: {type: GraphQLString}, type: {type: GraphQLString}},
    async resolve(parent, args, {prisma, sanitise, log}) {
      try {
        args = sanitise(args)
        console.log(args)
        const names = await prisma.user.findMany({
          where: {
            OR: [
              {username: {contains: args.username}},
              {name: {contains: args.username}},
            ],
          },
          select: {
            id: true,
            name: true,
            username: true,
          },
        })

        console.log(names)

        return names
      } catch (e) {
        log(e)
        return
      }
    },
  },

  // Retrieves pending follow requests for a user
  getPending: {
    type: new GraphQLList(PendingType),
    args: {id: {type: GraphQLString}, secretkey: {type: GraphQLString}},
    async resolve(parent, args, {prisma, sanitise, auth, log, req}) {
      try {
        args = sanitise(args)
        const exists = auth(args.id, args.secretkey, req)
        const follows = await prisma.follow.findMany({
          where: {
            AND: [{followingId: args.id}, {denial: false}],
          },
          select: {
            id: true,
            follower: {
              select: {
                id: true,
                name: true,
                username: true,
              },
            },
          },
        })

        return follows.map((data) => {
          return {
            pendingId: data.id,
            ...data.follower,
          }
        })
      } catch (e) {
        log(e)
        return
      }
    },
  },

  // Retrieves the user's feed based on their friends and following
  getFeed: {
    type: new GraphQLList(PostType),
    args: {
      id: {type: GraphQLString},
      secretkey: {type: GraphQLString},
      type: {type: GraphQLString},
    },
    async resolve(parent, args, {prisma, sanitise, auth, log, req}) {
      try {
        args = sanitise(args)
        const exists = auth(args.id, args.secretkey, req)

        // Fetch the DATE TIME of their last viewed post
        const viewed = await prisma.ViewedPost.findMany({
          where: {
            userId: args.id,
          },
          select: {
            time: true,
          },
          orderBy: {
            time: 'desc',
          },
          take: 1,
        })

        // Fetch all posts of the user's following and friends from the point of their last viewed post
        const posts = await prisma.user.findFirst({
          where: {
            id: args.id,
          },
          select: {
            following: {
              select: {
                following: {
                  select: {
                    posts: {
                      where: {
                        date: {gt: viewed[0].time},
                      },
                      select: {
                        user: {
                          select: {
                            name: true,
                            id: true,
                            username: true,
                          },
                        },
                        photo: true,
                        content: true,
                        id: true,
                        avgRatio: true,
                        multiplier: true,
                        date: true,
                      },
                      orderBy: {
                        date: 'desc',
                      },
                    },
                  },
                },
              },
            },
            friends: {
              select: {
                userTwo: {
                  select: {
                    posts: {
                      where: {
                        date: {gt: viewed[0].time},
                      },
                      select: {
                        user: {
                          select: {
                            name: true,
                            id: true,
                            username: true,
                          },
                        },
                        photo: true,
                        content: true,
                        id: true,
                        avgRatio: true,
                        multiplier: true,
                        date: true,
                      },
                      orderBy: {
                        date: 'desc',
                      },
                    },
                  },
                },
              },
            },
            friendshipsReceived: {
              select: {
                userOne: {
                  select: {
                    posts: {
                      where: {
                        date: {gt: viewed[0].time},
                      },
                      select: {
                        user: {
                          select: {
                            name: true,
                            id: true,
                            username: true,
                          },
                        },
                        photo: true,
                        content: true,
                        id: true,
                        avgRatio: true,
                        multiplier: true,
                        date: true,
                      },
                      orderBy: {
                        date: 'desc',
                      },
                    },
                  },
                },
              },
            },
          },
        })

        let followingPosts = []
        let friendsPosts = []
        const included = new Set()

        console.log(posts, 'POSTS')

        // Collect posts from users the user is following
        if (args.type != 'Friends') {
          for (let i = 0; i < posts.following.length; i++) {
            for (
              let x = 0;
              x < posts.following[i]?.following?.posts.length;
              x++
            ) {
              if (!included.has(posts.following[i]?.following?.posts[x].id)) {
                followingPosts.unshift(posts.following[i]?.following?.posts[x])
                included.add(posts.following[i]?.following?.posts[x].id)
              }
            }
          }
        }

        // Return only posts from users the user is following
        if (args.type == 'Following') {
          return followingPosts
        }

        // Collect posts from the user's friends
        if (args.type != 'Following') {
          for (let i = 0; i < posts.friends.length; i++) {
            for (let x = 0; x < posts.friends[i]?.userTwo?.posts.length; x++) {
              if (!included.has(posts.friends[i]?.userTwo?.posts[x].id)) {
                included.add(posts.friends[i]?.userTwo?.posts[x].id)
                friendsPosts.unshift(posts.friends[i]?.userTwo?.posts[x])
              }
            }
          }

          for (let i = 0; i < posts.friendshipsReceived.length; i++) {
            for (
              let x = 0;
              x < posts.friendshipsReceived[i]?.userOne?.posts.length;
              x++
            ) {
              if (
                !included.has(
                  posts.friendshipsReceived[i]?.userOne?.posts[x].id,
                )
              ) {
                included.add(posts.friendshipsReceived[i]?.userOne?.posts[x].id)
                friendsPosts.unshift(
                  posts.friendshipsReceived[i]?.userOne?.posts[x],
                )
              }
            }
          }
        }

        // Return only posts from the user's friends
        if (args.type == 'Friends') {
          return friendsPosts
        }

        // Calculate average ratios for following and friends posts
        let followingAvgRatio = 0
        let friendsAvgRatio = 0

        if (followingPosts) {
          for (let i = 0; i < followingPosts.length; i++) {
            followingAvgRatio += followingPosts[i].avgRatio
          }
        }

        if (friendsPosts) {
          for (let i = 0; i < friendsPosts.length; i++) {
            friendsAvgRatio += friendsPosts[i].avgRatio
          }
        }

        // Calculate multiplier based on average ratios
        const multiplier =
          followingAvgRatio / friendsAvgRatio
            ? followingAvgRatio / friendsAvgRatio
            : 1

        // Merge sort function to sort posts by date
        function mergeSort(arr, type) {
          if (arr.length <= 1) {
            return arr
          }

          const mid = Math.floor(arr.length / 2)
          const left = arr.slice(0, mid)
          const right = arr.slice(mid)

          return merge(mergeSort(left), mergeSort(right), type)
        }

        // Merge function used by merge sort
        function merge(left, right, type) {
          const result = []
          let leftIndex = 0
          let rightIndex = 0

          while (leftIndex < left.length && rightIndex < right.length) {
            if (left[leftIndex].date >= right[rightIndex].date) {
              if (type) {
                left[leftIndex].avgRatio =
                  (left[leftIndex].avgRatio * multiplier) /
                  ((leftIndex + 1) * left[leftIndex].multiplier)
              } else {
                left[leftIndex].avgRatio =
                  left[leftIndex].avgRatio /
                  ((leftIndex + 1) * left[leftIndex].multiplier)
              }
              result.push(left[leftIndex])
              leftIndex++
            } else {
              if (type) {
                right[rightIndex].avgRatio =
                  (right[rightIndex].avgRatio * multiplier) /
                  ((rightIndex + 1) * right[rightIndex].multiplier)
              } else {
                right[rightIndex].avgRatio =
                  right[rightIndex].avgRatio /
                  ((rightIndex + 1) * right[rightIndex].multiplier)
              }
              result.push(right[rightIndex])
              rightIndex++
            }
          }

          return result
            .concat(left.slice(leftIndex))
            .concat(right.slice(rightIndex))
        }

        // Sort posts using merge sort
        followingPosts = mergeSort(followingPosts, 0)
        friendsPosts = mergeSort(friendsPosts, 1)
        const raw = mergeSort([...followingPosts, ...friendsPosts])

        // Return posts sorted by date
        if (args.type == 'Date') {
          return raw
        }

        // Swap function to sort posts by average ratio in bubble sort
        let swap = true

        while (swap) {
          swap = false
          for (let i = 1; i < raw.length; i++) {
            if (raw[i - 1].avgRatio < raw[i].avgRatio) {
              ;[raw[i - 1], raw[i]] = [raw[i], raw[i - 1]]
              swap = true
            }
          }
        }

        return raw
      } catch (e) {
        log(e)
        return
      }
    },
  },

  // Retrieves recommended users for the user
  recommendedUsers: {
    type: new GraphQLList(AuthorType),
    args: {id: {type: GraphQLString}, secretkey: {type: GraphQLString}},
    async resolve(parent, args, {prisma, sanitise, auth, log, req}) {
      try {
        args = sanitise(args)
        const exists = auth(args.id, args.secretkey, req)

        const user = await prisma.user.findFirst({
          where: {
            id: args.id,
          },
          select: {
            id: true,
            friends: {
              select: {
                userTwo: {
                  select: {
                    id: true,
                  },
                },
              },
            },
            friendshipsReceived: {
              select: {
                userOne: {
                  select: {
                    id: true,
                  },
                },
              },
            },
            following: {
              select: {
                following: {
                  select: {
                    id: true,
                  },
                },
              },
            },
          },
        })

        let friends = user?.friendshipsReceived.map((i) => i?.userOne?.id)
        friends = friends.concat(user?.friends.map((i) => i?.userTwo?.id))

        let following = user?.following.map((i) => i?.following?.id)

        // Build raw data for recommendation algorithm
        const raw = []

        let main = {
          id: user.id,
          following,
          friends,
        }

        raw.push(main)

        if (main?.following?.length > 0) {
          for (let i = 0; i < main?.following?.length; i++) {
            await fetchData(main.following[i])
          }
        }
        if (main?.friends?.length > 0) {
          for (const element of main.friends) {
            await fetchData(element)
          }
        }

        // Fetch data for each user in the recommendation network
        async function fetchData(id) {
          const user = await prisma.user.findFirst({
            where: {
              id,
            },
            select: {
              id: true,
              friends: {
                select: {
                  userTwo: {
                    select: {
                      id: true,
                    },
                  },
                },
              },
              friendshipsReceived: {
                select: {
                  userOne: {
                    select: {
                      id: true,
                    },
                  },
                },
              },
              following: {
                select: {
                  following: {
                    select: {
                      id: true,
                    },
                  },
                },
              },
            },
          })

          if (
            user?.friends?.length > 0 ||
            user?.friendshipsReceived?.length > 0 ||
            user?.following?.length > 0
          ) {
            let friends = user?.friendshipsReceived.map((i) => i?.userOne?.id)
            friends = friends.concat(user?.friends.map((i) => i?.userTwo?.id))
            let following = user?.following.map((i) => i?.following?.id)

            const us = {
              id: user.id,
              following,
              friends,
            }

            // Check if the user is already in the raw data
            if (raw.includes(us)) {
              return
            }

            raw.push(us)
          }
        }

        let d = JSON.stringify(raw)

        // Send raw data to the recommendation algorithm API
        const res = await fetch('http://127.0.0.1:3001/recommend', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: d,
        })

        if (!res.ok) {
          throw new Error(`${res.status}`)
        }

        let jsonData = await res.json()

        // Query public information for each recommended user
        async function queryPubInfo(id) {
          const u = await prisma.user.findFirst({
            where: {
              id: id,
            },
            select: {
              id: true,
              username: true,
              name: true,
            },
          })
          return u
        }

        // If the number of recommended users is less than 10, add high-performing users
        if (jsonData.length < 10) {
          const highPerformers = await prisma.user.findMany({
            orderBy: {
              avgRatio: 'desc',
            },
            take: 10,
            select: {
              id: true,
            },
          })

          jsonData = [...jsonData, ...highPerformers.map((u) => u.id)]
        }

        // Return recommended users with their public information
        return jsonData.map(async (user) => await queryPubInfo(user))
      } catch (e) {
        log(e)
        return
      }
    },
  },
}

module.exports = UserQuery
