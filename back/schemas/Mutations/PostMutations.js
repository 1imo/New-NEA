// Importing required types from the 'graphql' package
const { GraphQLInt, GraphQLString, GraphQLBoolean } = require("graphql");

// Importing the LinkType (likely a custom GraphQL type definition)
const LinkType = require("../TypeDefs/LinkType");
const User = require("../../classes/User");
const Post = require("../../classes/Post");

// Defining the PostMutations object
const PostMutations = {
	// Mutation to create a new post
	createPost: {
		type: LinkType, // The return type of the mutation
		args: {
			id: { type: GraphQLString }, // User ID
			secretkey: { type: GraphQLString }, // User secret key for authentication
			content: { type: GraphQLString }, // Content of the post
			photo: { type: GraphQLBoolean }, // Indicates whether the post includes a photo or not
		},
		async resolve(parent, args, { prisma, sanitise, log }) {
			try {
				// Sanitize the input arguments
				args = sanitise(args);

				// Create a new User object
				const user = new User(prisma, log);

				// Authenticate the user
				const exists = await user.signIn_apiKey({
					id: args.id,
					secretkey: args.secretkey,
				});

				// Return if the user is invalid
				if (!exists) return;

				// Create a new Post object
				const post = new Post(prisma, log);

				// Return the URL and ID of the created post
				return await post.createPost({
					id: args.id,
					content: args.content,
					photo: args.photo,
				});
			} catch (e) {
				// Log any errors
				log(e);
				return;
			}
		},
	},

	// Mutation to mark a post as viewed
	postViewed: {
		type: LinkType,
		args: {
			post: { type: GraphQLInt }, // Post ID
			id: { type: GraphQLString }, // User ID
			secretkey: { type: GraphQLString }, // User secret key for authentication
		},
		async resolve(parent, args, { auth, sanitise, log, req, prisma }) {
			try {
				// Sanitize the input arguments
				args = sanitise(args);

				// Create a new User object
				const user = new User(prisma, log);

				// Authenticate the user
				const exists = await user.signIn_apiKey({
					id: args.id,
					secretkey: args.secretkey,
				});

				// Return if the user is invalid
				if (!exists) return;

				// Create a new Post object
				const post = new Post(prisma, log);

				return await post.viewPost({ post: args.post, id: args.id });
			} catch (e) {
				// Log any errors
				log(e);
				return;
			}
		},
	},

	// Mutation to mark a post as liked
	postLiked: {
		type: LinkType,
		args: {
			post: { type: GraphQLInt }, // Post ID
			id: { type: GraphQLString }, // User ID
			secretkey: { type: GraphQLString }, // User secret key for authentication
		},
		async resolve(parent, args, { auth, sanitise, log, req, prisma }) {
			try {
				// Sanitize the input arguments
				args = sanitise(args);

				// Create a new User object
				const user = new User(prisma, log);

				// Authenticate the user
				const exists = await user.signIn_apiKey({
					id: args.id,
					secretkey: args.secretkey,
				});

				// Return if the user is invalid
				if (!exists) return;

				// Create a new Post object
				const post = new Post(prisma, log);

				// Like, unlike a post
				return await post.likePost({ post: args.post, id: args.id });
			} catch (e) {
				// Log any errors
				log(e);
				return {
					url: "ERROR",
				};
			}
		},
	},
};

// Export the PostMutations object
module.exports = PostMutations;
