// Importing necessary types from the 'graphql' module
const {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLList,
  GraphQLFloat,
} = require('graphql')

// Importing PostType
const PostType = require('./PostType')

// Defining a new GraphQLObjectType called 'UserType'
const UserType = new GraphQLObjectType({
  name: 'User', // Name of the object type
  fields: () => ({
    id: {type: GraphQLString}, // 'id' field with type GraphQLString
    username: {type: GraphQLString}, // 'username' field with type GraphQLString
    name: {type: GraphQLString}, // 'name' field with type GraphQLString
    posts: {type: new GraphQLList(PostType)}, // 'posts' field with type GraphQLList of PostType
    friends: {type: new GraphQLList(UserType)}, // 'friends' field with type GraphQLList of UserType
    followers: {type: new GraphQLList(UserType)}, // 'followers' field with type GraphQLList of UserType
    following: {type: new GraphQLList(UserType)}, // 'following' field with type GraphQLList of UserType
    friendCount: {type: GraphQLInt}, // 'friendCount' field with type GraphQLInt
    followerCount: {type: GraphQLInt}, // 'followerCount' field with type GraphQLInt
    followingCount: {type: GraphQLInt}, // 'followingCount' field with type GraphQLInt
    pending: {type: new GraphQLList(UserType)}, // 'pending' field with type GraphQLList of UserType
    chatrooms: {type: new GraphQLList(GraphQLInt)}, // 'chatrooms' field with type GraphQLList of GraphQLInt
    avgRatio: {type: GraphQLFloat}, // 'avgRatio' field with type GraphQLFloat
    socket: {type: GraphQLString}, // 'socket' field with type GraphQLString
  }),
})

// Exporting the UserType
module.exports = UserType
