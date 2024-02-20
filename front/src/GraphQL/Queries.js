import { gql } from "@apollo/client";

export const LOAD_USERS = gql`
    query {
        getAllUsers {
            id,
            firstName,
            lastName
        }
    }
`

export const GET_NAVINFO = gql`
  query($id: String!) {
      navInfo(id: $id) {
          username,
          name
      }
  }
`

export const LOAD_POST = gql`
  query($id: Int!) {
    getPost(id: $id) {
      id,
      content,
      photo
      user {
        name,
        username,
        id
      }
    }
  }
`;

export const LOAD_NAV = gql`
    query($id: String!, $secretkey: String!) {
        navInfo(id: $id, secretkey: $secretkey) {
          firstName,
          lastName,
          username
        }
    }
`

export const GET_PUBLICDATA = gql`
    query($username: String!) {
        getPublicInfo(username: $username) {
          id,
          name,
          username,
          friendCount,
          followerCount,
          followingCount
        }
    }
`

export const GET_USERPOSTS = gql`
    query($username: String!) {
        getAllPosts(username: $username) {
          id,
          content,
          photo
          user {
            id,
            name,
            username
          }
        }
    }
`



export const GET_SEARCH_INSIGHTDATA = gql`
    query($username: String!, $type: String!) {
        getUserSearchResults(username: $username, type: $type) {
          name,
          username,
          id
        }
    }
`

export const GET_CHATS = gql`
    query($id: String!, $secretkey: String!) {
      getChats(id: $id, secretkey: $secretkey) {
        id,
        lastMessage {
          id,
          content,
        },
        chatroomUsers {
          id,
          name,
          username
        }
      }
    }
`

export const GET_CHATROOM = gql`
    query($chatId: String!, $id: String!, $secretkey: String!) {
        getUserSearchResults(chatId: $chatId, id: $id, secretkey: $secretkey) {
          id,
          chatroomUsers {
            id,
            name,
            username
          },
          messages {
            id,
            sender {
              name,
              username,
              id
            }
            content,
            date,
            read
          },
          lastMessage {
            id,
            sender {
              name,
              username,
              id
            }
            content,
            date,
            read
          }
        }
    }
`

export const GET_CHATROOM_DATA = gql`
    query($chatId: String!, $id: String!, $secretkey: String!) {
        getChatroomData(chatId: $chatId, id: $id, secretkey: $secretkey) {
          id,
          chatroomUsers {
            id,
            name,
            username
          },
          messages {
            id,
            sender {
              name,
              username,
              id
            }
            content,
            date,
            read
          },
          lastMessage {
            id,
            sender {
              name,
              username,
              id
            }
            content,
            date,
            read
          }
        }
    }
`

export const GET_PENDING_REQUESTS = gql`
    query($id: String!, $secretkey: String!) {
        getPending(id: $id, secretkey: $secretkey) {
          name
          username,
          id,
          pendingId
        }
    }
`

export const GET_FEED = gql`
  query($id: String!, $secretkey: String!, $type: String!) {
    getFeed(id: $id, secretkey: $secretkey, type: $type) {
      id,
      photo,
      content,
      user {
        id,
        name,
        username
      }
    }
  }
`

export const DISCOVER_PEOPLE = gql`
  query($id: String!, $secretkey: String!) {
    recommendedUsers(id: $id, secretkey: $secretkey) {
      id,
      username,
      name
    }
  }
`