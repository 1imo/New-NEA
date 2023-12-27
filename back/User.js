import { makeExecutableSchema } from '@graphql-tools/schema'

const typeDefs = [
  /* GraphQL */ `
type User {
  id: Int!
  username: String!
  password: String!
  secretKey: String!
  firstName: String!
  lastName: String
  posts: [Post]
  friends: [User]
  friendCount: Int!
  followers: [User]
  followerCount: Int!
  following: [User]
  followingCount: Int!
  pending: [User]
  chatrooms: [Chatroom]
  avgRatio: Float!
}

 
  # the schema allows the following query:
  type Query {
    getNavInfo(id: Int!, secretKey: String!): User
    getChatrooms(id: Int!, secretKey: String!): User
    signin(username: String!, password: String!): User
    getProfile(username: String!): User
    getFriends(username: String!): User
    getFollowers(username: String!): User
    getFollowing(username: String!): User
    getPosts(username: String!): User
  }
 
  # this schema allows the following mutation:
  type Mutation {
    addPost(id: Int!, secretKey: String!): User
    addFriend(id: Int!, username: String!, secretKey: String!): User
    removeFriend(id: Int!, username: String!, secretKey: String!): User
    addFollowing(id: Int!, username: String!, secretKey: String!): User
    removeFollowing(id: Int!, username: String!, secretKey: String!): User
    removeFollower(id: Int!, username: String!, secretKey: String!): User
    removePending(id: Int!, username: String!, secretKey: String!): User
    addChatroom(id: Int!, username: String!, secretKey: String!): User
    addChatroom(id: Int!, username: String!, secretKey: String!): User
    changePassword(id: Int!, secretKey: String!): User
  }
`]

const resolvers = {
  Query: {
    posts: () => posts,
    author: (_, { id }) => authors.find(author => author.id === id),

    getNavInfo: (_, { id, secretKey }) => {
      const user = users.find(user => user.id === id && user.secretKey === secretKey)
      return {
        username: user.username,
        firstname: user.firstName,
        lastname: user.lastName
      }
    }
  },
 
  Mutation: {
    upvotePost(_, { postId }) {
      const post = posts.find(post => post.id === postId)
      if (!post) {
        throw new Error(`Couldn't find post with id ${postId}`)
      }
      post.votes += 1
      return post
    }
  },
 
  Author: {
    posts: author => posts.filter(post => post.authorId === author.id)
  },
 
  Post: {
    author: post => authors.find(author => author.id === post.authorId)
  }
}

export const schema = makeExecutableSchema({ typeDefs, resolvers })
