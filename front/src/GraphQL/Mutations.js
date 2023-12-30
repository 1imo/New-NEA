import { gql } from "@apollo/client"

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
`


export const CREATE_NEWPOST = gql`
    mutation createPost(
        $id: Int!,
        $secretkey: String!,
        $content: String!
    ) {
        createPost(
            id: $id
            secretkey: $secretkey
            content: $content
        ) {
            id
        }
    }
`

export const FOLLOW_UNFOLLOW = gql`
    mutation followUnfollowUser(
        $id: Int!,
        $secretkey: String!,
        $username: String!
    ) {
        followUnfollowUser(
            id: $id
            secretkey: $secretkey
            username: $username
        ) {
            username
        }
    }
`

export const GET_CHATROOM = gql`
    mutation getLocation(
        $id: Int!,
        $secretkey: String!,
        $username: String!
    ) {
        getLocation(
            id: $id
            secretkey: $secretkey
            username: $username
        ) {
            id,
            chatters {
              id,
              firstName,
              lastName,
              username
            },
            lastMessage {
              id,
              sender {
                firstName,
                lastName,
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

export const VIEW_POST = gql`
    mutation postViewed(
        $post: Int!
        $id: Int!,
        $secretkey: String!,
    ) {
        postViewed (
            post: $post
            id: $id
            secretkey: $secretkey
        ) {
            id
            views {
                id
            }
        }
    }

`

export const LIKE_POST = gql`
    mutation postLiked(
        $post: Int!
        $id: Int!,
        $secretkey: String!,
    ) {
        postLiked (
            post: $post
            id: $id
            secretkey: $secretkey
        ) {
            id,
            likes {
                id
            }

        }
    }

`

// mutation {
//     sendMessage(id: 1 secretkey: "1imo" content: "hii", chatroom: 1) {
//       id
//     }
//   }

export const SEND_MESSAGE = gql`
    mutation sendMessage(
        $chatroom: Int!
        $id: Int!,
        $secretkey: String!,
        $content: String!
    ) {
        sendMessage (
            chatroom: $chatroom
            id: $id
            secretkey: $secretkey
            content: $content
        ) {
            id
        }
    }

`