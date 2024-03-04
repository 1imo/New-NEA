const {GraphQLString} = require('graphql')
const bcrypt = require('bcrypt')

const UserType = require('../TypeDefs/UserType')
const SensitiveUserDataType = require('../TypeDefs/SensitiveUserDataType')
const LinkType = require('../TypeDefs/LinkType')

//Changes to a User's Data
const UserMutations = {
  createUser: {
    //Sensitive Data stored seperately to normal user data
    type: SensitiveUserDataType,
    args: {
      firstName: {type: GraphQLString},
      lastName: {type: GraphQLString},
      username: {type: GraphQLString},
      password: {type: GraphQLString},
    },
    async resolve(parent, args, {prisma, sanitise, log}) {
      try {
        args = sanitise(args)
        const pass = await bcrypt.hash(args.password, 10)
        const {nanoid} = await import('nanoid')
        const apiKey = nanoid()

        console.log(args)

        const user = await prisma.user.create({
          data: {
            name: `${args.firstName} ${args.lastName}`,
            username: args.username,
            userData: {
              create: {
                password: pass,
                secretkey: apiKey,
                expiry: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
              },
            },
          },
        })

        console.log(user, 'USER')

        return {
          id: user.id,
          secretkey: apiKey,
        }
      } catch (e) {
        log(e)
        return
      }
    },
  },
  signIn: {
    type: SensitiveUserDataType,
    args: {
      username: {type: GraphQLString},
      pass: {type: GraphQLString},
    },
    async resolve(parent, args, {io, prisma, sanitise, log}) {
      args = sanitise(args)

      try {
        const userData = await prisma.userData.findFirst({
          where: {
            user: {
              username: args.username,
            },
          },
          select: {
            id: true,
            secretkey: true,
            password: true,
          },
        })

        if (!userData) {
          throw new Error('User not found')
        }

        const hash = await bcrypt.compare(args.pass, userData.password)

        if (hash) {
          const nano = await import('nanoid')
          const apiKey = nano.nanoid()

          await prisma.userData.update({
            where: {
              id: userData.id,
            },
            data: {
              secretkey: apiKey,
              expiry: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
            },
          })

          return {
            id: userData.id,
            secretkey: apiKey,
          }
        } else throw new Error('Password is incorrect')
      } catch (e) {
        log(e)
        return
      }
    },
  },
  followUnfollowUser: {
    type: LinkType,
    args: {
      id: {type: GraphQLString},
      secretkey: {type: GraphQLString},
      username: {type: GraphQLString},
    },
    async resolve(parent, args, {io, prisma, sanitise, auth, log, req}) {
      try {
        args = sanitise(args)
        const exists = await auth(args.id, args.secretkey, req)

        const recipient = await prisma.user.findFirst({
          where: {
            username: args.username,
          },
          select: {
            id: true,
            socket: true,
          },
        })

        if (!recipient) throw new Error('User not found')

        const followExists = await prisma.follow.count({
          where: {
            OR: [
              {AND: [{followerId: args.id}, {followingId: recipient.id}]},
              {AND: [{followerId: recipient.id}, {followingId: args.id}]},
            ],
          },
        })

        if (followExists) {
          const follow = await prisma.follow.findFirst({
            where: {
              OR: [
                {AND: [{followerId: args.id}, {followingId: recipient.id}]},
                {AND: [{followerId: recipient.id}, {followingId: args.id}]},
              ],
            },
            select: {
              id: true,
            },
          })
          await prisma.follow.delete({
            where: {id: follow.id},
          })
        } else {
          let follow = await prisma.follow.create({
            data: {
              followerId: args.id,
              followingId: recipient.id,
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

          io.to(recipient.socket).emit('followed', follow)
        }

        return
      } catch (e) {
        log(e)
        return
      }
    },
  },
  pendingRequest: {
    type: UserType,
    args: {
      id: {type: GraphQLString},
      secretkey: {type: GraphQLString},
      request: {type: GraphQLString},
      action: {type: GraphQLString},
    },
    async resolve(parent, args, {io, prisma, auth, sanitise, log, req}) {
      try {
        args = sanitise(args)
        const exists = await auth(args.id, args.secretkey, req)

        const follow = await prisma.follow.findFirst({
          where: {id: args.request},
          select: {
            follower: {
              select: {
                id: true,
                username: true,
                name: true,
              },
            },
            following: {
              select: {
                id: true,
                username: true,
                name: true,
              },
            },
            id: true,
          },
        })

        switch (args.action) {
          case 'add':
            await prisma.friendship.create({
              data: {
                userOneId: follow.follower.id,
                userTwoId: follow.following.id,
              },
            })

            await prisma.follow.delete({
              where: {id: follow.id},
            })

          case 'remove':
            await prisma.follow.update({
              where: {
                id: args.request,
              },
              data: {
                denial: true,
              },
            })
        }

        return
      } catch (e) {
        log(e)
        return
      }
    },
  },
  // Edit user details found on settings page
  editDetails: {
    type: SensitiveUserDataType,
    args: {
      id: {type: GraphQLString},
      secretkey: {type: GraphQLString},
      request: {type: GraphQLString},
      data: {type: GraphQLString},
    },
    async resolve(parent, args, {io, prisma, sanitise, auth, log, req}) {
      try {
        args = sanitise(args)
        const exists = await auth(args.id, args.secretkey, req)

        switch (args.request) {
          case 'name':
            await prisma.user.update({
              where: {
                id: args.id,
              },
              data: {
                name: args.data,
              },
            })
            return
          case 'username':
            await prisma.user.update({
              where: {
                id: args.id,
              },
              data: {
                username: args.data,
              },
            })
            return
          case 'password':
            const pass = await bcrypt.hash(args.data, 10)
            const {nanoid} = await import('nanoid')
            const apiKey = nanoid()

            await prisma.userData.update({
              where: {
                id: args.id,
              },
              data: {
                password: pass,
                secretkey: apiKey,
                expiry: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
              },
            })
            return {
              secretkey: apiKey,
            }
        }
      } catch (e) {
        log(e)
        return
      }
    },
  },
}

module.exports = UserMutations
