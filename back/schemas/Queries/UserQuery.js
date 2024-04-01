// Imports
const { GraphQLString, GraphQLList } = require("graphql");
const UserType = require("../TypeDefs/UserType");
const PostType = require("../TypeDefs/PostType");
const AuthorType = require("../TypeDefs/AuthorType");
const ProfileType = require("../TypeDefs/ProfileType");
const PendingType = require("../TypeDefs/PendingType");
const ChatroomType = require("../TypeDefs/ChatroomType");

// Classes
const User = require("../../classes/User");
const PriorityQueue = require("../../classes/PriorityQueue");

const UserQuery = {
	// Retrieves navigation information for a user
	navInfo: {
		type: UserType,
		args: { id: { type: GraphQLString } },
		async resolve(parent, args, { prisma, sanitise, log }) {
			try {
				// Sanitise the input arguments
				args = sanitise(args);

				console.log(args);
				// Fetch the user's navigation information
				// Not abstracted away into a classs due to the total complexity of 5
				const user = await prisma.user.findUnique({
					where: {
						id: args.id,
					},
					select: {
						name: true,
						username: true,
					},
				});

				return user;
			} catch (e) {
				log(e);
				console.log(e);
				return;
			}
		},
	},

	// Retrieves public profile information for a user
	getPublicInfo: {
		type: ProfileType,
		args: {
			username: { type: GraphQLString },
			id: { type: GraphQLString },
		},
		async resolve(parent, args, { prisma, sanitise, log }) {
			try {
				// Sanitise the input arguments
				args = sanitise(args);

				// Create a new User object
				const user = new User(prisma, log);

				// Return the public information for the user
				return user.getPublicInfo(args);
			} catch (e) {
				log(e);
				return;
			}
		},
	},

	// Retrieves all posts for a user
	getAllPosts: {
		type: new GraphQLList(PostType),
		args: { username: { type: GraphQLString } },
		async resolve(parent, args, { prisma, sanitise, log }) {
			try {
				// Sanitise the input arguments
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

				// Return all posts for the user
				return user.getPosts(args);
			} catch (e) {
				log(e);
				return;
			}
		},
	},

	// Retrieves user search results based on username or name
	getUserSearchResults: {
		type: new GraphQLList(UserType),
		args: {
			username: { type: GraphQLString },
			type: { type: GraphQLString },
		},
		async resolve(parent, args, { prisma, sanitise, log }) {
			try {
				// Sanitise the input arguments
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

				// Fetch results
				const names = await prisma.user.findMany({
					where: {
						OR: [
							{ username: { contains: args.username } },
							{ name: { contains: args.username } },
						],
					},
					orderBy: {
						avgRatio: "desc",
					},
					take: 10,
					select: {
						id: true,
						name: true,
						username: true,
						avgRatio: true,
					},
				});

				return names;
			} catch (e) {
				log(e);
				return;
			}
		},
	},

	// Retrieves pending follow requests for a user
	getPending: {
		type: new GraphQLList(PendingType),
		args: {
			id: { type: GraphQLString },
			secretkey: { type: GraphQLString },
		},
		async resolve(parent, args, { prisma, sanitise, auth, log, req }) {
			try {
				args = sanitise(args);
				const exists = auth(args.id, args.secretkey, req);
				const follows = await prisma.follow.findMany({
					where: {
						AND: [{ followingId: args.id }, { denial: false }],
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
				});

				return follows.map((data) => {
					return {
						pendingId: data.id,
						...data.follower,
					};
				});
			} catch (e) {
				log(e);
				return;
			}
		},
	},

	// Retrieves the user's feed based on their friends and following
	getFeed: {
		type: new GraphQLList(PostType),
		args: {
			id: { type: GraphQLString },
			secretkey: { type: GraphQLString },
			type: { type: GraphQLString },
		},
		async resolve(parent, args, { prisma, sanitise, auth, log, req }) {
			try {
				// Sanitise the input arguments
				args = sanitise(args);

				// Create a new User object
				const user = new User(prisma, log);

				// Authenticate the user
				const exists = await user.signIn_apiKey({
					id: args.id,
					secretkey: args.secretkey,
				});

				if (!exists) return;

				return await user.getFeed({ id: args.id, type: args.type });
			} catch (e) {
				log(e);
				return;
			}
		},
	},

	// Retrieves recommended users for the user
	recommendedUsers: {
		type: new GraphQLList(AuthorType),
		args: {
			id: { type: GraphQLString },
			secretkey: { type: GraphQLString },
		},
		async resolve(parent, args, { prisma, sanitise, auth, log, req }) {
			try {
				args = sanitise(args);

				// Create a new User object
				const user = new User(prisma, log);

				// Authenticate the user
				const exists = await user.signIn_apiKey({
					id: args.id,
					secretkey: args.secretkey,
				});

				if (!exists) return;

				// Get recommended users
				return await user.getRecommendedUsers({ id: args.id });
			} catch (e) {
				log(e);
				return;
			}
		},
	},
};

module.exports = UserQuery;
