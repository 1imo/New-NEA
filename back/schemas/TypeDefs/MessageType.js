// Importing necessary types from the 'graphql' module
const {GraphQLObjectType, GraphQLString, GraphQLBoolean} = require('graphql')

// Importing AuthorType
const AuthorType = require('./AuthorType')

// Defining a new GraphQLObjectType called 'MessageType'
const MessageType = new GraphQLObjectType({
  name: 'Message', // Name of the object type
  fields: () => ({
    id: {type: GraphQLString}, // 'id' field with type GraphQLString
    sender: {type: AuthorType}, // 'sender' field with type AuthorType
    content: {type: GraphQLString}, // 'content' field with type GraphQLString
    date: {type: GraphQLString}, // 'date' field with type GraphQLString
    type: {type: GraphQLString}, // 'type' field with type GraphQLString
    read: {type: GraphQLBoolean}, // 'read' field with type GraphQLBoolean
  }),
})

// Exporting the MessageType
module.exports = MessageType
