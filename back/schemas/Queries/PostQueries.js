// Importing the required modules and types
const graphql = require('graphql')
const {GraphQLInt, GraphQLString} = require('graphql')

// Importing custom type definitions
const UserType = require('../TypeDefs/UserType')
const PostType = require('../TypeDefs/PostType')

// Defining the PostQuery object
const PostQuery = {
  // Query to get a specific post by ID
  getPost: {
    type: PostType, // The return type is PostType
    args: {
      id: {type: GraphQLInt}, // The ID of the post to fetch
    },
    async resolve(parent, args, {prisma, sanitise, log}) {
      try {
        // Sanitize the input arguments
        args = sanitise(args)

        // Fetch the post data from the database
        const post = await prisma.post.findFirst({
          where: {
            id: args.id, // Find the post with the provided ID
          },
          select: {
            id: true, // Select the post ID
            content: true, // Select the post content
            photo: true, // Select the post photo flag
            user: {
              select: {
                name: true, // Select the user's name
                username: true, // Select the user's username
                id: true, // Select the user's ID
              },
            },
          },
        })

        // Return the fetched post data
        return post
      } catch (e) {
        // Log any errors
        log(e)
        return
      }
    },
  },
}

// Export the PostQuery object
module.exports = PostQuery
