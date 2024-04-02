// Importing the required modules and types
const { GraphQLInt } = require("graphql");

// Importing custom type definitions
const PostType = require("../TypeDefs/PostType");

// Importing classes
const Post = require("../../classes/Post");

// Defining the PostQuery object
const PostQuery = {
	// Query to get a specific post by ID
	getPost: {
		type: PostType, // The return type is PostType
		args: {
			id: { type: GraphQLInt }, // The ID of the post to fetch
		},
		async resolve(parent, args, { prisma, sanitise, log }) {
			try {
				// Sanitize the input arguments
				args = sanitise(args);

				const post = new Post(prisma, log);

				// Return the fetched post data
				return await post.getPost({ id: args.id });
			} catch (e) {
				// Log any errors
				log(e);
				return;
			}
		},
	},
};

// Export the PostQuery object
module.exports = PostQuery;
