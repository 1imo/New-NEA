const {GraphQLObjectType, GraphQLString} = require('graphql')

const PendingType = new GraphQLObjectType({
  name: 'Pending',
  fields: () => ({
    id: {type: GraphQLString},
    name: {type: GraphQLString},
    username: {type: GraphQLString},
    pendingId: {type: GraphQLString},
  }),
})

module.exports = PendingType
