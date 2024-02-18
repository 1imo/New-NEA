import { gql } from "@apollo/client"

export const SIGN_IN = gql`
    mutation signIn(
        $username: String!,
        $pass: String!
        ) { 
        signIn(
            username: $username
            pass: $pass
        ) {
            id,
            secretkey
        }
    }
`

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
        $id: String!,
        $secretkey: String!,
        $content: String!,
        $photo: Boolean!
    ) {
        createPost(
            id: $id
            secretkey: $secretkey
            content: $content,
            photo: $photo
        ) {
            url,
            id
        }
    }
`

export const FOLLOW_UNFOLLOW = gql`
    mutation followUnfollowUser(
        $id: String!,
        $secretkey: String!,
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
`

export const GET_CHATROOM = gql`
    mutation getLocation(
        $id: String!,
        $secretkey: String!,
        $username: String!
    ) {
        getLocation(
            id: $id
            secretkey: $secretkey
            username: $username
        ) {
            id,
            chatroomUsers {
              id,
              name,
              username
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

export const VIEW_POST = gql`
    mutation postViewed(
        $post: Int!
        $id: String!,
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
        $id: String!,
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
        $chatroom: String!
        $id: String!,
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

export const EDIT_MESSAGE = gql`
    mutation editMessage(
        $chatroom: String
        $id: String!,
        $message: String!
        $secretkey: String!,
        $edit: String!
    ) {
        editMessage (
            chatroom: $chatroom
            id: $id
            secretkey: $secretkey
            message: $message
            edit: $edit
        ) {
            url
        }
    }

`

export const BEFRIEND_PENDING = gql`
    mutation pendingRequest(
        $request: String!
        $id: String!,
        $secretkey: String!,
        $action: String!
    ) {
        pendingRequest (
            request: $request,
            id: $id,
            secretkey: $secretkey,
            action: $action
        ) {
            id
        }
    }
`

export const EDIT_DATA = gql`
    mutation editDetails(
        $id: String!,
        $secretkey: String!,
        $request: String!
        $data: String!
    ) {
        editDetails (
            id: $id,
            secretkey: $secretkey,
            request: $request,
            data: $data
        ) {
            id,
            secretkey
        }
    }
`
