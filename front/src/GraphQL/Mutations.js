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
            messages {
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