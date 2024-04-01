const crypto = require("crypto");
const bcrypt = require("bcrypt");

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
				case "name":
					await this.prisma.user.update({
						where: {
							id: args.id,
						},
						data: {
							name: args.data,
						},
					});
					// Testing purposes
					return {
						id: `${args.id} updated`,
					};

				case "username":
					await this.prisma.user.update({
						where: {
							id: args.id,
						},
						data: {
							username: args.data,
						},
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
}

module.exports = User;
