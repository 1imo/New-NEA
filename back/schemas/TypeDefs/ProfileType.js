const {GraphQLObjectType, GraphQLInt, GraphQLString} = require('graphql')

const ProfileType = new GraphQLObjectType({
  name: 'Profile',
  fields: () => ({
    id: {type: GraphQLString},
    name: {type: GraphQLString},
    username: {type: GraphQLString},
    friendCount: {type: GraphQLInt},
    followerCount: {type: GraphQLInt},
    followingCount: {type: GraphQLInt},
  }),
})

module.exports = ProfileType
