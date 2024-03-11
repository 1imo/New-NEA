// Importing necessary types from the 'graphql' module
const {GraphQLObjectType, GraphQLString} = require('graphql')

// Defining a new GraphQLObjectType called 'PendingType'
const PendingType = new GraphQLObjectType({
  name: 'Pending', // Name of the object type
  fields: () => ({
    id: {type: GraphQLString}, // 'id' field with type GraphQLString
    name: {type: GraphQLString}, // 'name' field with type GraphQLString
    username: {type: GraphQLString}, // 'username' field with type GraphQLString
    pendingId: {type: GraphQLString}, // 'pendingId' field with type GraphQLString
  }),
})

// Exporting the PendingType
module.exports = PendingType
