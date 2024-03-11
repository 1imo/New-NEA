// Importing necessary types from the 'graphql' module
const {GraphQLObjectType, GraphQLString} = require('graphql')

// Defining a new GraphQLObjectType called 'AuthorType'
const AuthorType = new GraphQLObjectType({
  name: 'Author', // Name of the object type
  fields: () => ({
    id: {type: GraphQLString}, // 'id' field with type GraphQLString
    name: {type: GraphQLString}, // 'name' field with type GraphQLString
    username: {type: GraphQLString}, // 'username' field with type GraphQLString
  }),
})

// Exporting the 'AuthorType' for use in other parts of the application
module.exports = AuthorType
