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
  query($id: Int!) {
      navInfo(id: $id) {
          username,
          firstName,
          lastName
      }
  }
`

export const LOAD_POST = gql`
  query($id: Int!) {
    getPost(id: $id) {
      id,
      content,
      author {
        firstName,
        lastName,
        username
      }
    }
  }
`;

export const LOAD_NAV = gql`
    query($id: Int!, $secretkey: String!) {
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
          firstName,
          lastName,
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
          author {
            id,
            firstName,
            lastName,
            username
          }
        }
    }
`

export const GET_SEARCH_INSIGHTDATA = gql`
    query($username: String!, $type: String!) {
        getUserSearchResults(username: $username, type: $type) {
          firstName,
          lastName,
          username
        }
    }
`

// export const GET_CHATROOM = 