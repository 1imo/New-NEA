// Importing necessary types from the 'graphql' module
const {GraphQLObjectType, GraphQLString} = require('graphql')

// Defining a new GraphQLObjectType called 'LinkType'
const LinkType = new GraphQLObjectType({
  name: 'Link', // Name of the object type
  fields: () => ({
    url: {type: GraphQLString}, // 'url' field with type GraphQLString
    id: {type: GraphQLString}, // 'id' field with type GraphQLString
  }),
})

// Exporting the LinkType
module.exports = LinkType
