const {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLList,
  GraphQLFloat
} = require('graphql')
const PostType = require('./PostType')

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: {type: GraphQLString},
    username: {type: GraphQLString},
    name: {type: GraphQLString},
    posts: {type: new GraphQLList(PostType)},
    friends: {type: new GraphQLList(UserType)},
    followers: {type: new GraphQLList(UserType)},
    following: {type: new GraphQLList(UserType)},
    friendCount: {type: GraphQLInt},
    followerCount: {type: GraphQLInt},
    followingCount: {type: GraphQLInt},
    pending: {type: new GraphQLList(UserType)},
    chatrooms: {type: new GraphQLList(GraphQLInt)},
    avgRatio: {type: GraphQLFloat},
    socket: {type: GraphQLString},
  }),
})

module.exports = UserType
