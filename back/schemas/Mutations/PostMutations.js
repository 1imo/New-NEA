// Importing required types from the 'graphql' package
const {GraphQLInt, GraphQLString, GraphQLBoolean} = require('graphql')

// Importing the LinkType (likely a custom GraphQL type definition)
const LinkType = require('../TypeDefs/LinkType')

// Defining the PostMutations object
const PostMutations = {
  // Mutation to create a new post
  createPost: {
    type: LinkType, // The return type of the mutation
    args: {
      id: {type: GraphQLString}, // User ID
      secretkey: {type: GraphQLString}, // User secret key for authentication
      content: {type: GraphQLString}, // Content of the post
      photo: {type: GraphQLBoolean}, // Indicates whether the post includes a photo or not
    },
    async resolve(parent, args, {prisma, auth, sanitise, log, req}) {
      try {
        // Sanitize the input arguments
        args = sanitise(args)

        // Authenticate the user
        const exists = await auth(args.id, args.secretkey, req)

        // Create a new post in the database
        const post = await prisma.post.create({
          data: {
            content: args.content,
            userId: args.id,
            photo: args.photo,
          },
          select: {
            id: true,
          },
        })

        // Return the URL and ID of the created post
        return {
          url: `/post/id/${post.id}`,
          id: post.id,
        }
      } catch (e) {
        // Log any errors
        log(e)
        return
      }
    },
  },

  // Mutation to mark a post as viewed
  postViewed: {
    type: LinkType,
    args: {
      post: {type: GraphQLInt}, // Post ID
      id: {type: GraphQLString}, // User ID
      secretkey: {type: GraphQLString}, // User secret key for authentication
    },
    async resolve(parent, args, {auth, sanitise, log, req, prisma}) {
      try {
        // Sanitize the input arguments
        args = sanitise(args)

        // Authenticate the user
        const exists = await auth(args.id, args.secretkey, req)

        // Find the post and check if the user has already viewed it
        const post = await prisma.post.findFirst({
          where: {
            id: args.post,
          },
          select: {
            viewedBy: {
              where: {
                userId: args.id,
              },
            },
            avgRatio: true,
          },
        })

        // If the user hasn't viewed the post before
        if (post.viewedBy.length == 0) {
          // Fetch additional data about the post
          const inDepth = await prisma.post.findFirst({
            where: {
              id: args.post,
            },
            select: {
              viewedBy: true,
              likedBy: true,
              avgRatio: true,
            },
          })

          // Calculate the average ratio based on likes and views
          const ratio =
            inDepth.likedBy.length + 1 / (inDepth.viewedBy.length + 2)

          // Create a new record in the ViewedPost table
          const v = await prisma.ViewedPost.create({
            data: {
              postId: args.post,
              userId: args.id,
            },
          })

          // Update avgRatio of post
          const p = await prisma.post.update({
            where: {
              id: args.post,
            },
            data: {
              avgRatio: ratio,
            },
          })
          return {
            url: 'Post Viewed',
          }
        } else {
          return {
            url: 'Already Viewed',
          }
        }
      } catch (e) {
        // Log any errors
        log(e)
        return {
          url: 'ERROR',
        }
      }
    },
  },

  // Mutation to mark a post as liked
  postLiked: {
    type: LinkType,
    args: {
      post: {type: GraphQLInt}, // Post ID
      id: {type: GraphQLString}, // User ID
      secretkey: {type: GraphQLString}, // User secret key for authentication
    },
    async resolve(parent, args, {auth, sanitise, log, req, prisma}) {
      try {
        // Sanitize the input arguments
        args = sanitise(args)

        // Authenticate the user
        const exists = await auth(args.id, args.secretkey, req)

        // Find the post and check if the user has already liked it
        const post = await prisma.post.findFirst({
          where: {
            id: args.post,
          },
          select: {
            likedBy: {
              where: {
                userId: args.id,
              },
            },
            avgRatio: true,
          },
        })

        // If the user hasn't liked the post before
        if (post.likedBy.length == 0) {
          // Fetch additional data about the post
          const inDepth = await prisma.post.findFirst({
            where: {
              id: args.post,
            },
            select: {
              viewedBy: true,
              likedBy: true,
              avgRatio: true,
            },
          })

          // Calculate the average ratio based on likes and views
          const ratio =
            (inDepth.likedBy.length + 2) / inDepth.viewedBy.length + 1

          // Create a new record in the LikedPost table
          await prisma.LikedPost.create({
            data: {
              postId: args.post,
              userId: args.id,
            },
          })

          await prisma.post.update({
            where: {
              id: args.post,
            },
            data: {
              avgRatio: ratio,
            },
          })

          return {
            url: 'Post Liked',
          }
        } else {
          return {
            url: 'Already Liked',
          }
        }
      } catch (e) {
        // Log any errors
        log(e)
        return {
          url: 'ERROR',
        }
      }
    },
  },
}

// Export the PostMutations object
module.exports = PostMutations
