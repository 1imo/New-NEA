// Importing necessary types from the 'graphql' module
const {GraphQLObjectType, GraphQLInt, GraphQLString} = require('graphql')

// Defining a new GraphQLObjectType called 'ProfileType'
const ProfileType = new GraphQLObjectType({
  name: 'Profile', // Name of the object type
  fields: () => ({
    id: {type: GraphQLString}, // 'id' field with type GraphQLString
    name: {type: GraphQLString}, // 'name' field with type GraphQLString
    username: {type: GraphQLString}, // 'username' field with type GraphQLString
    friendCount: {type: GraphQLInt}, // 'friendCount' field with type GraphQLInt
    followerCount: {type: GraphQLInt}, // 'followerCount' field with type GraphQLInt
    followingCount: {type: GraphQLInt}, // 'followingCount' field with type GraphQLInt
    status: {type: GraphQLString}, // 'status' field with type GraphQLString
  }),
})

// Exporting the ProfileType
module.exports = ProfileType
