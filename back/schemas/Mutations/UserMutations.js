// Importing the required modules and types
const {GraphQLString} = require('graphql')
const bcrypt = require('bcrypt')

const UserType = require('../TypeDefs/UserType')
const SensitiveUserDataType = require('../TypeDefs/SensitiveUserDataType')
const LinkType = require('../TypeDefs/LinkType')

// Defining mutations related to user data
const UserMutations = {
  // Mutation to create a new user
  createUser: {
    // The return type is SensitiveUserDataType
    type: SensitiveUserDataType,
    args: {
      firstName: {type: GraphQLString}, // User's first name
      lastName: {type: GraphQLString}, // User's last name
      username: {type: GraphQLString}, // User's username
      password: {type: GraphQLString}, // User's password
    },
    async resolve(parent, args, {prisma, sanitise, log}) {
      try {
        // Sanitize the input arguments
        args = sanitise(args)
        // Hash the password
        const pass = await bcrypt.hash(args.password, 10)
        // Generate a unique API key
        const {nanoid} = await import('nanoid')
        const apiKey = nanoid()

        console.log(args)

        // Create a new user in the database
        const user = await prisma.user.create({
          data: {
            name: `${args.firstName} ${args.lastName}`, // Full name
            username: args.username, // Username
            userData: {
              create: {
                password: pass, // Hashed password
                secretkey: apiKey, // API key
                expiry: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // Expiry date (1 week from now)
              },
            },
          },
        })

        console.log(user, 'USER')

        // Return the user ID and API key
        return {
          id: user.id,
          secretkey: apiKey,
        }
      } catch (e) {
        // Log any errors
        log(e)
        return
      }
    },
  },

  // Mutation to sign in a user
  signIn: {
    type: SensitiveUserDataType,
    args: {
      username: {type: GraphQLString}, // User's username
      pass: {type: GraphQLString}, // User's password
    },
    async resolve(parent, args, {io, prisma, sanitise, log}) {
      // Sanitize the input arguments
      args = sanitise(args)

      try {
        // Find the user's data based on the username
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

        // If user not found, throw an error
        if (!userData) {
          throw new Error('User not found')
        }

        // Compare the provided password with the hashed password
        const hash = await bcrypt.compare(args.pass, userData.password)

        // If the password is correct
        if (hash) {
          // Generate a new API key
          const nano = await import('nanoid')
          const apiKey = nano.nanoid()

          // Update the user's API key and expiry date
          await prisma.userData.update({
            where: {
              id: userData.id,
            },
            data: {
              secretkey: apiKey,
              expiry: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
            },
          })

          // Return the user ID and new API key
          return {
            id: userData.id,
            secretkey: apiKey,
          }
        } else throw new Error('Password is incorrect')
      } catch (e) {
        // Log any errors
        log(e)
        return
      }
    },
  },

  // Mutation to follow or unfollow a user
  followUnfollowUser: {
    type: LinkType,
    args: {
      id: {type: GraphQLString}, // User ID
      secretkey: {type: GraphQLString}, // User's API key
      username: {type: GraphQLString}, // Username of the user to follow/unfollow
    },
    async resolve(parent, args, {io, prisma, sanitise, auth, log, req}) {
      try {
        // Sanitize the input arguments
        args = sanitise(args)
        // Authenticate the user
        const exists = await auth(args.id, args.secretkey, req)

        // Find the recipient user based on the username
        const recipient = await prisma.user.findFirst({
          where: {
            username: args.username,
          },
          select: {
            id: true,
            socket: true,
          },
        })

        // If recipient user not found, throw an error
        if (!recipient) throw new Error('User not found')

        // Check if a follow relationship already exists between the two users
        const followExists = await prisma.follow.count({
          where: {
            OR: [
              {AND: [{followerId: args.id}, {followingId: recipient.id}]},
              {AND: [{followerId: recipient.id}, {followingId: args.id}]},
            ],
          },
        })

        // If a follow relationship exists
        if (followExists) {
          // Find the existing follow relationship
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
          // Delete the follow relationship (unfollow)
          await prisma.follow.delete({
            where: {id: follow.id},
          })
        } else {
          // Create a new follow relationship
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

          // Emit a "followed" event to the recipient's socket
          io.to(recipient.socket).emit('followed', follow)
        }

        return
      } catch (e) {
        // Log any errors
        log(e)
        return
      }
    },
  },

  // Mutation to accept or reject a follow request
  pendingRequest: {
    type: UserType,
    args: {
      id: {type: GraphQLString}, // User ID
      secretkey: {type: GraphQLString}, // User's API key
      request: {type: GraphQLString}, // Request ID
      action: {type: GraphQLString}, // Action to perform ('add' or 'remove')
    },
    async resolve(parent, args, {io, prisma, auth, sanitise, log, req}) {
      try {
        // Sanitize the input arguments
        args = sanitise(args)
        // Authenticate the user
        const exists = await auth(args.id, args.secretkey, req)

        // Find the follow request based on the request ID
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

        // Perform the specified action
        switch (args.action) {
          case 'add':
            // Create a new friendship between the two users
            await prisma.friendship.create({
              data: {
                userOneId: follow.follower.id,
                userTwoId: follow.following.id,
              },
            })

            // Delete the follow request
            await prisma.follow.delete({
              where: {id: follow.id},
            })
            break

          case 'remove':
            // Mark the follow request as denied
            await prisma.follow.update({
              where: {
                id: args.request,
              },
              data: {
                denial: true,
              },
            })
            break
        }

        return
      } catch (e) {
        // Log any errors
        log(e)
        return
      }
    },
  },

  // Mutation to edit user details (name, username, password)
  editDetails: {
    type: SensitiveUserDataType,
    args: {
      id: {type: GraphQLString}, // User ID
      secretkey: {type: GraphQLString}, // User's API key
      request: {type: GraphQLString}, // Type of request ('name', 'username', or 'password')
      data: {type: GraphQLString}, // New data to update
    },
    async resolve(parent, args, {io, prisma, sanitise, auth, log, req}) {
      try {
        // Sanitize the input arguments
        args = sanitise(args)
        // Authenticate the user
        const exists = await auth(args.id, args.secretkey, req)

        // Update the user data based on the request type
        switch (args.request) {
          case 'name':
            // Update the user's name
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
            // Update the user's username
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
            // Hash the new password
            const pass = await bcrypt.hash(args.data, 10)
            // Generate a new API key
            const {nanoid} = await import('nanoid')
            const apiKey = nanoid()

            // Update the user's password, API key, and expiry date
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
            // Return the new API key
            return {
              secretkey: apiKey,
            }
        }
      } catch (e) {
        // Log any errors
        log(e)
        return
      }
    },
  },
}

// Export the UserMutations object
module.exports = UserMutations
