import { gql } from "@apollo/client";


export const SUBSCRIBE_TO_MESSAGES = (chatroomId, userId) => gql`
    subscription {
        newMessage(chatroomId: "${chatroomId}", userId: "${userId}") {
            id
            sender {
              id
              firstName
              lastName
              username
            }
            content
            date
            read
        }
  }
`