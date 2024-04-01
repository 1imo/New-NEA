class Post {
	constructor(prisma, log) {
		this.prisma = prisma;
		this.log = log;
	}

	// Create a new post
	// Arguments: id, content, photo
	async createPost(args) {
		try {
			const post = await this.prisma.post.create({
				data: {
					content: args.content,
					userId: args.id,
					photo: args.photo,
				},
				select: {
					id: true,
				},
			});

			return {
				url: `/post/id/${post.id}`,
				id: post.id,
			};
		} catch (e) {
			this.log(e);
			return;
		}
	}

	// View a post
	// Arguments: id, post
	async viewPost(args) {
		try {
			const postViewed = await this.prisma.viewedPost.count({
				where: {
					postId: args.post,
					userId: args.id,
				},
			});

			// 0 is a falsy value, so we can use it to check if the post has been viewed
			if (postViewed) return { url: "Already Viewed" };

			// Fetch additional data about the post
			const inDepth = await this.prisma.post.findFirst({
				where: {
					id: args.post,
				},
				select: {
					_count: {
						select: {
							viewedBy: true,
							likedBy: true,
						},
					},
					avgRatio: true,
				},
			});

			// Calculate the average ratio based on likes and views
			const ratio =
				inDepth._count.likedBy + 1 / (inDepth._count.viewedBy + 2);

			// Create a new record in the ViewedPost table
			const v = await this.prisma.ViewedPost.create({
				data: {
					postId: args.post,
					userId: args.id,
				},
			});

			// Update avgRatio of post
			const p = await this.prisma.post.update({
				where: {
					id: args.post,
				},
				data: {
					avgRatio: ratio,
				},
			});

			return { url: "Post Viewed" };
		} catch (e) {
			this.log(e);
			return;
		}
	}

	async likePost(args) {
		try {
			const postLiked = await this.prisma.likedPost.count({
				where: {
					postId: args.post,
					userId: args.id,
				},
			});

			// 0 is a falsy value, so we can use it to check if the post has been viewed
			if (postLiked) {
				await this.prisma.likedPost.delete({
					where: {
						postId_userId: {
							postId: args.post,
							userId: args.id,
						},
					},
				});

				return { url: "Post Unliked" };
			}

			const post = await this.prisma.post.findFirst({
				where: {
					id: args.post,
				},
				select: {
					_count: {
						select: {
							viewedBy: true,
							likedBy: true,
						},
					},
					avgRatio: true,
				},
			});

			const ratio = (post._count.likedBy + 2) / post._count.viewedBy + 1;

			await this.prisma.likedPost.create({
				data: {
					postId: args.post,
					userId: args.id,
				},
			});

			await this.prisma.post.update({
				where: {
					id: args.post,
				},
				data: {
					avgRatio: ratio,
				},
			});

			return {
				url: "Post Liked",
			};
		} catch (e) {
			this.log(e);
			console.log(e);
			return {
				url: "Error",
			};
		}
	}
}

module.exports = Post;
