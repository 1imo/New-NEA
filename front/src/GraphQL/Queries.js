import { gql } from "@apollo/client";
// GraphQL query to load all users
export const LOAD_USERS = gql`
	query {
		getAllUsers {
			id
			firstName
			lastName
		}
	}
`;

// GraphQL query to get navigation information for a user
export const GET_NAVINFO = gql`
	query ($id: String!) {
		navInfo(id: $id) {
			username
			name
		}
	}
`;

// GraphQL query to load a specific post
export const LOAD_POST = gql`
	query ($id: Int!) {
		getPost(id: $id) {
			id
			content
			photo
			user {
				name
				username
				id
			}
		}
	}
`;

// GraphQL query to load navigation information with authentication
export const LOAD_NAV = gql`
	query ($id: String!, $secretkey: String!) {
		navInfo(id: $id, secretkey: $secretkey) {
			firstName
			lastName
			username
		}
	}
`;

// GraphQL query to get public data of a user
export const GET_PUBLICDATA = gql`
	query ($username: String!, $id: String!) {
		getPublicInfo(username: $username, id: $id) {
			id
			name
			username
			friendCount
			followerCount
			followingCount
			status
		}
	}
`;

// GraphQL query to get all posts of a user
export const GET_USERPOSTS = gql`
	query ($username: String!) {
		getAllPosts(username: $username) {
			id
			content
			photo
			user {
				id
				name
				username
			}
		}
	}
`;

// GraphQL query to get search results for users
export const GET_SEARCH_INSIGHTDATA = gql`
	query ($username: String!, $type: String!) {
		getUserSearchResults(username: $username, type: $type) {
			name
			username
			id
		}
	}
`;

// GraphQL query to get chats of a user
export const GET_CHATS = gql`
	query ($id: String!, $secretkey: String!) {
		getChats(id: $id, secretkey: $secretkey) {
			id
			lastMessage {
				id
				content
				read
			}
			chatroomUsers {
				id
				name
				username
			}
		}
	}
`;

// GraphQL query to get chatroom data (incorrect query name)
export const GET_CHATROOM = gql`
	query ($chatId: String!, $id: String!, $secretkey: String!) {
		getUserSearchResults(chatId: $chatId, id: $id, secretkey: $secretkey) {
			id
			chatroomUsers {
				id
				name
				username
			}
			messages {
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

// GraphQL query to get chatroom data
export const GET_CHATROOM_DATA = gql`
	query ($chatId: String!, $id: String!, $secretkey: String!) {
		getChatroomData(chatId: $chatId, id: $id, secretkey: $secretkey) {
			id
			chatroomUsers {
				id
				name
				username
			}
			messages {
				id
				sender {
					name
					username
					id
				}
				content
				date
				read
				type
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
				type
			}
		}
	}
`;

// GraphQL query to get pending friend requests
export const GET_PENDING_REQUESTS = gql`
	query ($id: String!, $secretkey: String!) {
		getPending(id: $id, secretkey: $secretkey) {
			name
			username
			id
			pendingId
		}
	}
`;

// GraphQL query to get user's feed
export const GET_FEED = gql`
	query ($id: String!, $secretkey: String!, $type: String!) {
		getFeed(id: $id, secretkey: $secretkey, type: $type) {
			id
			photo
			content
			user {
				id
				name
				username
			}
		}
	}
`;

// GraphQL query to discover recommended users
export const DISCOVER_PEOPLE = gql`
	query ($id: String!, $secretkey: String!) {
		recommendedUsers(id: $id, secretkey: $secretkey) {
			id
			username
			name
		}
	}
`;

// GraphQL query to get a file (upload not supported in GraphQL)
export const GET_FILE = gql`
	query ($id: String!, $secretkey: String!, $file: Upload!) {
		getFile(id: $id, secretkey: $secretkey, file: $file) {
			sucess
			error
		}
	}
`;
