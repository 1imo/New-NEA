// Importing necessary types from the 'graphql' module
const {GraphQLObjectType, GraphQLString} = require('graphql')

// Defining a new GraphQLObjectType called 'SensitiveUserDataType'
const SensitiveUserDataType = new GraphQLObjectType({
  name: 'SensitiveUserData', // Name of the object type
  fields: () => ({
    id: {type: GraphQLString}, // 'id' field with type GraphQLString
    secretkey: {type: GraphQLString}, // 'secretkey' field with type GraphQLString
  }),
})

// Exporting the SensitiveUserDataType
module.exports = SensitiveUserDataType
