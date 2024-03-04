const {GraphQLString, GraphQLList} = require('graphql')
const UserType = require('../TypeDefs/UserType')
const PostType = require('../TypeDefs/PostType')
const AuthorType = require('../TypeDefs/AuthorType')
const ProfileType = require('../TypeDefs/ProfileType')
const PendingType = require('../TypeDefs/PendingType')
const ChatroomType = require('../TypeDefs/ChatroomType')

const UserQuery = {
  navInfo: {
    type: UserType,
    args: {id: {type: GraphQLString}},
    async resolve(parent, args, {prisma, sanitise, log, req}) {
      try {
        // console.log('NAV', req)
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

        console.log(user, 'USER')

        return user
      } catch (e) {
        log(e)
        return
      }
    },
  },
  getPublicInfo: {
    type: ProfileType,
    args: {username: {type: GraphQLString}},
    async resolve(parent, args, {prisma, sanitise, log}) {
      try {
        args = sanitise(args)
        const {
          id,
          name,
          username,
          friends,
          friendshipsReceived,
          followers,
          following,
        } = await prisma.user.findFirst({
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

        return {
          id,
          name,
          username,
          friendCount: friends.length + friendshipsReceived.length,
          followerCount: followers.length,
          followingCount: following.length,
        }
      } catch (e) {
        log(e)
        return
      }
    },
  },
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
                user: {
                  select: {
                    id: true,
                    username: true,
                    name: true,
                  },
                },
              },
            },
          },
        })

        return user.posts
      } catch (e) {
        log(e)
        return
      }
    },
  },
  getUserSearchResults: {
    type: new GraphQLList(UserType),
    args: {username: {type: GraphQLString}, type: {type: GraphQLString}},
    async resolve(parent, args, {prisma, sanitise, log}) {
      try {
        args = sanitise(args)
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

        return names
      } catch (e) {
        log(e)
        return
      }
    },
  },
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

        // console.log(posts, "POSTS")

        let followingPosts = []
        let friendsPosts = []

        if (args.type != 'Friends') {
          for (let i = 0; i < posts.following.length; i++) {
            for (
              let x = 0;
              x < posts.following[i]?.following?.posts.length;
              x++
            ) {
              followingPosts.unshift(posts.following[i]?.following?.posts[x])
            }
          }
        }

        if (args.type == 'Following') {
          return followingPosts
        }

        if (args.type != 'Following') {
          for (let i = 0; i < posts.friends.length; i++) {
            for (let x = 0; x < posts.friends[i]?.userTwo?.posts.length; x++) {
              friendsPosts.unshift(posts.friends[i]?.userTwo?.posts[x])
            }
          }

          for (let i = 0; i < posts.friendshipsReceived.length; i++) {
            for (
              let x = 0;
              x < posts.friendshipsReceived[i]?.userOne?.posts.length;
              x++
            ) {
              friendsPosts.unshift(
                posts.friendshipsReceived[i]?.userOne?.posts[x],
              )
            }
          }
        }

        if (args.type == 'Friends') {
          return friendsPosts
        }

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

        const multiplier =
          followingAvgRatio / friendsAvgRatio
            ? followingAvgRatio / friendsAvgRatio
            : 1

        function mergeSort(arr, type) {
          if (arr.length <= 1) {
            return arr
          }

          const mid = Math.floor(arr.length / 2)
          const left = arr.slice(0, mid)
          const right = arr.slice(mid)

          return merge(mergeSort(left), mergeSort(right), type)
        }

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

        followingPosts = mergeSort(followingPosts, 0)
        friendsPosts = mergeSort(friendsPosts, 1)
        const raw = mergeSort([...followingPosts, ...friendsPosts])

        if (args.type == 'Date') {
          return raw
        }

        let swaps = 0

        function swapRatio(arr) {
          for (let i = 0; i < arr.length; i++) {
            if (i + 1 != arr.length) {
              if (arr[i].avgRatio < arr[i + 1].avgRatio) {
                ;[arr[i], arr[i + 1]] = [arr[i + 1], arr[i]]
                swaps += 1
              }
            }
          }

          if (swaps != 0) {
            swaps = 0
            swapRatio(arr)
          }
        }

        swapRatio(raw)

        return raw
      } catch (e) {
        log(e)
        return
      }
    },
  },
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

            // const us = new User(user.id, following, friends)
            const us = {
              id: user.id,
              following,
              friends,
            }

            if (raw.includes(us)) {
              return
            }

            raw.push(us)
          }
        }

        let d = JSON.stringify(raw)

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
          console.log(highPerformers)

          jsonData = [...jsonData, ...highPerformers.map((u) => u.id)]
          console.log(jsonData, 'JD')
        }

        return jsonData.map(async (user) => await queryPubInfo(user))
      } catch (e) {
        log(e)
        return
      }
    },
  },
}

module.exports = UserQuery
