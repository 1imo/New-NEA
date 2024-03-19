import { gql } from "@apollo/client";
// GraphQL mutation to sign in a user
export const SIGN_IN = gql`
	mutation signIn($username: String!, $pass: String!) {
		signIn(username: $username, pass: $pass) {
			id
			secretkey
		}
	}
`;

// GraphQL mutation to create a new user
export const CREATE_USER_MUTATION = gql`
	mutation createUser(
		$firstName: String!
		$lastName: String!
		$username: String!
		$password: String!
	) {
		createUser(
			firstName: $firstName
			lastName: $lastName
			username: $username
			password: $password
		) {
			secretkey
			id
		}
	}
`;

// GraphQL mutation to create a new post
export const CREATE_NEWPOST = gql`
	mutation createPost(
		$id: String!
		$secretkey: String!
		$content: String!
		$photo: Boolean!
	) {
		createPost(
			id: $id
			secretkey: $secretkey
			content: $content
			photo: $photo
		) {
			url
			id
		}
	}
`;

// GraphQL mutation to follow or unfollow a user
export const FOLLOW_UNFOLLOW = gql`
	mutation followUnfollowUser(
		$id: String!
		$secretkey: String!
		$username: String!
	) {
		followUnfollowUser(
			id: $id
			secretkey: $secretkey
			username: $username
		) {
			url
		}
	}
`;

// GraphQL mutation to get a chatroom location
export const GET_CHATROOM = gql`
	mutation getLocation(
		$id: String!
		$secretkey: String!
		$username: String!
	) {
		getLocation(id: $id, secretkey: $secretkey, username: $username) {
			id
			chatroomUsers {
				id
				name
				username
			}
			lastMessage {
				id
				sender {
					name
					username
					id
				}
				content
				date
				read
			}
		}
	}
`;

// GraphQL mutation to mark a post as viewed
export const VIEW_POST = gql`
	mutation postViewed($post: Int!, $id: String!, $secretkey: String!) {
		postViewed(post: $post, id: $id, secretkey: $secretkey) {
			url
		}
	}
`;

// GraphQL mutation to like a post
export const LIKE_POST = gql`
	mutation postLiked($post: Int!, $id: String!, $secretkey: String!) {
		postLiked(post: $post, id: $id, secretkey: $secretkey) {
			url
		}
	}
`;

// GraphQL mutation to send a message
export const SEND_MESSAGE = gql`
	mutation sendMessage(
		$chatroom: String!
		$id: String!
		$secretkey: String!
		$content: String!
		$type: String!
	) {
		sendMessage(
			chatroom: $chatroom
			id: $id
			secretkey: $secretkey
			content: $content
			type: $type
		) {
			id
		}
	}
`;

// GraphQL mutation to edit a message
export const EDIT_MESSAGE = gql`
	mutation editMessage(
		$chatroom: String
		$id: String!
		$message: String!
		$secretkey: String!
		$edit: String!
	) {
		editMessage(
			chatroom: $chatroom
			id: $id
			secretkey: $secretkey
			message: $message
			edit: $edit
		) {
			url
		}
	}
`;

// GraphQL mutation to send a friend request
export const BEFRIEND_PENDING = gql`
	mutation pendingRequest(
		$request: String!
		$id: String!
		$secretkey: String!
		$action: String!
	) {
		pendingRequest(
			request: $request
			id: $id
			secretkey: $secretkey
			action: $action
		) {
			id
		}
	}
`;

// GraphQL mutation to edit user details
export const EDIT_DATA = gql`
	mutation editDetails(
		$id: String!
		$secretkey: String!
		$request: String!
		$data: String!
	) {
		editDetails(
			id: $id
			secretkey: $secretkey
			request: $request
			data: $data
		) {
			id
			secretkey
		}
	}
`;
