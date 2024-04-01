const crypto = require("crypto");
const bcrypt = require("bcrypt");

const PriorityQueue = require("./PriorityQueue");

const sessions = new Map();

class User {
	constructor(prisma, log, io) {
		this.prisma = prisma;
		this.log = log;
		this.io = io;
	}

	// Create a new user
	// Arguments: firstName, lastName, username, password
	async createUser(args) {
		try {
			const pass = await bcrypt.hash(args.password, 10);
			const apiKey = crypto.randomBytes(32).toString("hex");

			const user = await this.prisma.user.create({
				data: {
					name: `${args.firstName} ${args.lastName}`,
					username: args.username,
					userData: {
						create: {
							password: pass,
							secretkey: apiKey,
							expiry: new Date(
								Date.now() + 1000 * 60 * 60 * 24 * 7
							),
						},
					},
				},
				select: {
					id: true,
				},
			});

			return {
				id: user.id,
				secretkey: apiKey,
			};
		} catch (e) {
			this.log(e);
			return;
		}
	}

	// Sign in with an API key
	// Arguments: id, secretkey
	async signIn_apiKey(args) {
		try {
			const exists = await this.prisma.userData.count({
				where: {
					AND: [
						{ id: args.id },
						{ secretkey: args.secretkey },
						{ expiry: { gt: new Date(Date.now()) } },
					],
				},
			});

			return exists ? true : false;
		} catch (e) {
			this.log(e);
		}
	}

	// Sign in with a username and password
	// Arguments: username, pass
	async signIn_details(args) {
		try {
			const userData = await this.prisma.userData.findFirst({
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
			});

			if (!userData) return;

			const isPasswordValid = await bcrypt.compare(
				args.pass,
				userData.password
			);

			if (!isPasswordValid) return;

			// Update the user's API key and expiry date
			const apiKey = crypto.randomBytes(32).toString("hex");

			const u = await this.prisma.userData.update({
				where: {
					id: userData.id,
				},
				data: {
					secretkey: apiKey,
					expiry: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
				},
				select: {
					id: true,
				},
			});

			return {
				id: userData.id,
				secretkey: apiKey,
			};
		} catch (error) {
			log(error);
			return;
		}
	}

	// Get the user's public information
	// Arguments: id (user), username (the recipient)
	async getPublicInfo(args) {
		try {
			// Fetch the user's public information
			const reqUser = await this.prisma.user.findFirst({
				where: {
					username: args.username,
				},
				select: {
					id: true,
					name: true,
					username: true,
					_count: {
						select: {
							friends: true,
							friendshipsReceived: true,
							followers: true,
							following: true,
						},
					},
				},
			});

			// If the user doesn't exist, return
			if (!reqUser) return;

			// Default friendship state is null (neither friends nor following)
			let status = "Follow";

			// Check if the user is following the recipient
			const following = await this.prisma.follow.count({
				where: {
					AND: [{ followerId: args.id }, { followingId: reqUser.id }],
				},
			});

			// If the user is following the recipient, change the status to 'Following'
			// If the user is friends with the recipient, change the status to 'Friends'
			if (!following) {
				const friends = await this.prisma.friendship.findFirst({
					where: {
						OR: [
							{
								AND: [
									{ userOneId: args.id },
									{ userTwoId: reqUser.id },
								],
							},
							{
								AND: [
									{ userOneId: reqUser.id },
									{ userTwoId: args.id },
								],
							},
						],
					},
					select: {
						id: true,
					},
				});

				if (friends) {
					status = "Friends";
				}
			} else {
				status = "Following";
			}

			// Return the user's public information
			return {
				id: reqUser.id,
				name: reqUser.name,
				username: reqUser.username,
				friendCount:
					reqUser._count.friends + reqUser._count.friendshipsReceived,
				followerCount: reqUser._count.followers,
				followingCount: reqUser._count.following,
				status,
			};
		} catch (e) {
			this.log(e);
			return;
		}
	}

	// Follow, unfollow, friend and unfriend a user
	// Arguments: id (of the user), username (of the user to follow/unfollow)
	async followUnfollowUser(args) {
		try {
			const recipient = await this.prisma.user.findFirst({
				where: {
					username: args.username,
				},
				select: {
					id: true,
					socket: true,
				},
			});

			// If the recipient doesn't exist or is the same as the user, return
			if (!recipient || recipient.id == args.id) return;

			// Check if the user is already following the recipient
			const followExists = await this.prisma.follow.findFirst({
				where: {
					AND: [
						{ followerId: args.id },
						{ followingId: recipient.id },
					],
				},
				select: {
					id: true,
				},
			});

			// If the user is already following the recipient; unfollow
			if (followExists) {
				await this.prisma.follow.delete({
					where: { id: followExists.id },
				});

				return { url: "unfollowed" };
			}

			// Check if the user is already friends with the recipient
			const friendExists = await this.prisma.friendship.findFirst({
				where: {
					OR: [
						{
							AND: [
								{ userOneId: args.id },
								{ userTwoId: recipient.id },
							],
						},
						{
							AND: [
								{ userOneId: recipient.id },
								{ userTwoId: args.id },
							],
						},
					],
				},
				select: {
					id: true,
				},
			});

			// If the user is already friends with the recipient; unfriend
			if (friendExists) {
				await this.prisma.friendship.delete({
					where: { id: friendExists.id },
				});

				return { url: "unfriended" };
			}

			// Check if recipient is following the user
			const recipientFollowing = await this.prisma.follow.findFirst({
				where: {
					AND: [
						{ followingId: args.id },
						{ followerId: recipient.id },
					],
				},
				select: {
					id: true,
				},
			});

			// If recipient following user and the user is requesting to follow r; create friendship
			if (recipientFollowing) {
				await this.prisma.friendship.create({
					data: {
						userOneId: args.id,
						userTwoId: recipient.id,
					},
				});

				await this.prisma.follow.delete({
					where: {
						id: recipientFollowing.id,
					},
				});

				return {
					url: "Friendship Created",
				};
			}

			// If the user is already following the recipient; unfollow
			if (recipientFollowing) {
				await this.prisma.follow.delete({
					where: { id: followExists.id },
				});

				return { url: "unfollowed" };
			}

			// Else follow user
			const follow = await this.prisma.follow.create({
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
			});

			this.io.to(recipient.socket).emit("followed", follow);

			return { url: "followed" };
		} catch (error) {
			this.log(error);
			return;
		}
	}

	// Logic for accepting or denying a friend request
	// Arguments: request (the ID of the follow request), action (add or remove), id (of the user)
	async pendingRequest(args) {
		try {
			// Find the follow request based on the request ID and check to see if the user has authority to accept or deny the request
			const follow = await this.prisma.follow.findFirst({
				where: {
					AND: [{ id: args.request }, { followingId: args.id }],
				},
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
			});

			if (!follow) return;

			switch (args.action) {
				case "add":
					await this.prisma.friendship.create({
						data: {
							userOneId: follow.follower.id,
							userTwoId: follow.following.id,
						},
					});

					await this.prisma.follow.delete({
						where: { id: follow.id },
					});

					return { url: "befriended" };

				case "remove":
					await this.prisma.follow.update({
						where: {
							id: args.requestId,
						},
						data: {
							denial: true,
						},
					});

					return { url: "denied" };
			}
		} catch (error) {
			this.log(error);
			return;
		}
	}

	// Edit user details (name, username, password)
	// Arguments: id, secretkey, request (name, username, password), data
	async editDetails(args) {
		try {
			// Based on the request, update the user's details at that attribute
			switch (args.request) {
				case "name" || "username":
					const data = {};
					data[args.request] = args.data;

					await this.prisma.user.update({
						where: {
							id: args.id,
						},
						data,
					});
					// Testing purposes
					return {
						id: `${args.id} updated`,
					};

				case "password":
					const pass = await bcrypt.hash(args.data, 10);
					const apiKey = crypto.randomBytes(32).toString("hex");

					await this.prisma.userData.update({
						where: {
							id: args.id,
						},
						data: {
							password: pass,
							secretkey: apiKey,
							expiry: new Date(
								Date.now() + 1000 * 60 * 60 * 24 * 7
							),
						},
					});

					return {
						secretkey: apiKey,
					};
			}
		} catch (error) {
			this.log(error);
			return;
		}
	}

	// Get the user's chatrooms
	// Arguments: id
	async getChats(args) {
		try {
			// Fetch the user's chatrooms along with chatroom users and last message
			const chatrooms = await this.prisma.user.findFirst({
				where: {
					id: args.id,
				},
				select: {
					chatroomUsers: {
						select: {
							chatroom: {
								select: {
									id: true,
									chatroomUsers: {
										select: {
											user: {
												select: {
													name: true,
													id: true,
													username: true,
												},
											},
										},
									},
									messages: {
										orderBy: {
											date: "desc",
										},
										take: 1,
										select: {
											id: true,
											content: true,
											sender: {
												select: {
													name: true,
													username: true,
												},
											},
											read: true,
											date: true,
										},
									},
								},
							},
						},
					},
				},
			});

			// Process the chatroom data and prepare the response
			const insights = chatrooms.chatroomUsers.map((chatroomUser) => {
				const chatroom = chatroomUser.chatroom;
				const lastMessage = chatroom.messages[0];
				const recipients = chatroom.chatroomUsers.map(
					(author) => author.user
				);

				return {
					id: chatroom.id,
					chatroomUsers: recipients,
					lastMessage,
				};
			});

			return insights;
		} catch (e) {
			this.log(e);
			return;
		}
	}

	async getPosts(args) {
		try {
			const user = await this.prisma.user.findFirst({
				where: {
					username: args.username,
				},
				include: {
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
							date: "asc",
						},
					},
				},
			});

			// Posts were being retrieved multiple times; I used a Set to store the IDs of the posts that were already included
			// I also forgot to keep naming conventions consecutive across the transport layers and the DB
			const included = new Set();

			if (user) {
				user.posts.forEach((post) => {
					if (!included.has(post?.id)) {
						post.likes = post.likedBy;
						post.views = post.viewedBy;
						delete post.likedBy;
						delete post.viewedBy;
						included.add(post?.id);
					}
				});
			}

			return user.posts;
		} catch (e) {
			this.log(e);
			return;
		}
	}

	// Get the user's feed
	// Arguments: id, type (Following, Friends, Date, Recommended)
	async getFeed(args) {
		try {
			console.log(args);
			const user = await this.prisma.user.findUnique({
				where: { id: args.id },
				select: {
					following: { select: { followingId: true } },
					friends: {
						select: {
							userOne: { select: { id: true } },
							userTwo: { select: { id: true } },
						},
					},
					friendshipsReceived: {
						select: {
							userOne: { select: { id: true } },
							userTwo: { select: { id: true } },
						},
					},
				},
			});

			// Create a set of followed users and friends
			const followedUsers = new Set(
				user.following.map(({ followingId }) => followingId)
			);
			const friends = new Set();
			user.friends.forEach(({ userOne, userTwo }) => {
				friends.add(userOne.id);
				friends.add(userTwo.id);
			});
			user.friendshipsReceived.forEach(({ userOne, userTwo }) => {
				friends.add(userOne.id);
				friends.add(userTwo.id);
			});

			// Remove the user's own id from the sets
			followedUsers.delete(args.id);
			friends.delete(args.id);

			// Fetch posts from followed users and friends
			const posts = await this.prisma.post.findMany({
				where: {
					userId: { in: [...followedUsers, ...friends] },
				},
				select: {
					id: true,
					user: { select: { id: true } },
					avgRatio: true,
					multiplier: true,
					date: true,
				},
			});

			// Merge sort function to sort posts by multiplier
			function mergeSort(arr) {
				if (arr.length <= 1) {
					return arr;
				}

				const mid = Math.floor(arr.length / 2);
				const left = arr.slice(0, mid);
				const right = arr.slice(mid);

				return merge(mergeSort(left), mergeSort(right));
			}

			// Merge function used by merge sort
			function merge(left, right) {
				const result = [];
				let leftIndex = 0;
				let rightIndex = 0;

				while (leftIndex < left.length && rightIndex < right.length) {
					if (
						left[leftIndex].multiplier ===
						right[rightIndex].multiplier
					) {
						result.push(left[leftIndex]);
						leftIndex++;
						result.push(right[rightIndex]);
						rightIndex++;
					} else if (
						left[leftIndex].multiplier <
						right[rightIndex].multiplier
					) {
						result.push(left[leftIndex]);
						leftIndex++;
					} else {
						result.push(right[rightIndex]);
						rightIndex++;
					}
				}

				return result.concat(
					left.slice(leftIndex),
					right.slice(rightIndex)
				);
			}

			// Sort posts using merge sort based on multiplier
			const sortedPostsByMultiplier = mergeSort(posts);

			// Create a priority queue to store posts sorted by avgRatio and recency
			const priorityQueue = new PriorityQueue((a, b) => {
				if (a.multiplier === b.multiplier) {
					if (a.avgRatio === b.avgRatio) {
						return b.date.getTime() - a.date.getTime(); // Sort by recency if avgRatio is the same
					}
					return b.avgRatio - a.avgRatio; // Sort by avgRatio if multiplier is the same
				}
				return a.multiplier - b.multiplier; // Sort by multiplier
			});

			// Add sorted posts to the priority queue
			sortedPostsByMultiplier.forEach((post) =>
				priorityQueue.enqueue(post)
			);

			// Return posts based on the specified type
			switch (args.type) {
				case "Following":
					return sortedPostsByMultiplier.filter((post) =>
						followedUsers.has(post.user.id)
					);
				case "Friends":
					return sortedPostsByMultiplier.filter((post) =>
						friends.has(post.user.id)
					);
				case "Date":
					return sortedPostsByMultiplier.map(
						({ user, id, avgRatio, multiplier, date }) => ({
							user,
							id,
							avgRatio,
							multiplier,
							date,
						})
					);
				default:
					// Get the top recommended posts
					const recommendedPosts = [];
					const maxPosts = 100; // Adjust this value as needed
					for (
						let i = 0;
						i < maxPosts && !priorityQueue.isEmpty();
						i++
					) {
						recommendedPosts.push(priorityQueue.dequeue());
					}

					return recommendedPosts.map(
						({ user, id, avgRatio, multiplier, date }) => ({
							user,
							id,
							avgRatio,
							multiplier,
							date,
						})
					);
			}
		} catch (e) {
			this.log(e);
			return;
		}
	}

	// Fetch recommended users from external service
	// Arguments: id
	async getRecommendedUsers(args) {
		try {
			// Fetch the user's friends and following
			const user = await this.prisma.user.findUnique({
				where: { id: args.id },
				include: {
					friends: {
						select: { userTwo: { select: { id: true } } },
					},
					friendshipsReceived: {
						select: { userOne: { select: { id: true } } },
					},
					following: {
						select: { following: { select: { id: true } } },
					},
				},
			});

			// Process data to be manageable and consistent
			const friends =
				user?.friendshipsReceived.map((i) => i?.userOne?.id) || [];
			friends.concat(user?.friends.map((i) => i?.userTwo?.id) || []);
			const following =
				user?.following.map((i) => i?.following?.id) || [];

			const raw = [{ id: user.id, following, friends }];

			// Fetch user data for friends and following
			const self = this;
			async function fetchData(id) {
				const user = await self.prisma.user.findUnique({
					where: { id },
					include: {
						friends: {
							select: { userTwo: { select: { id: true } } },
						},
						friendshipsReceived: {
							select: { userOne: { select: { id: true } } },
						},
						following: {
							select: { following: { select: { id: true } } },
						},
					},
				});

				// Process data to be manageable and consistent and append to the raw data
				if (user) {
					const friends =
						user?.friendshipsReceived.map((i) => i?.userOne?.id) ||
						[];
					const following =
						user?.following.map((i) => i?.following?.id) || [];

					const us = { id: user.id, following, friends };

					if (!raw.some((u) => u.id === us.id)) {
						raw.push(us);
					}
				}
			}

			// Do this for all friends and following
			await Promise.all(following.map(fetchData));
			await Promise.all(friends.map(fetchData));

			// Fetch recommended users from external service
			const res = await fetch("http://127.0.0.1:3001/recommend", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(raw),
			});

			if (!res.ok) return;

			let jsonData = await res.json();

			// If the response is less than 10, pad with high performers
			if (jsonData.length < 10) {
				const highPerformers = await this.prisma.user.findMany({
					orderBy: { avgRatio: "desc" },
					take: 10,
					select: { id: true },
				});

				jsonData = [...jsonData, ...highPerformers.map((u) => u.id)];
			}

			// Fetch user data for the recommended users for human readable format
			return Promise.all(
				jsonData.map(
					async (user) =>
						await this.prisma.user.findUnique({
							where: { id: user },
							select: {
								id: true,
								username: true,
								name: true,
							},
						})
				)
			);
		} catch (e) {
			this.log(e);
			console.log(e);
			return;
		}
	}
}

module.exports = User;
