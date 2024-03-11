// Importing necessary types from the 'graphql' module
const {GraphQLObjectType, GraphQLString, GraphQLList} = require('graphql')

// Importing Custom Types
const MessageType = require('./MessageType')
const AuthorType = require('./AuthorType')

// Defining a new GraphQLObjectType called 'ChatroomType'
const ChatroomType = new GraphQLObjectType({
  name: 'Chatroom', // Name of the object type
  fields: () => ({
    id: {type: GraphQLString}, // 'id' field with type GraphQLString
    chatroomUsers: {type: new GraphQLList(AuthorType)}, // 'chatroomUsers' field with type GraphQLList of AuthorType
    messages: {type: new GraphQLList(MessageType)}, // 'messages' field with type GraphQLList of MessageType
    lastMessage: {type: MessageType}, // 'lastMessage' field with type MessageType
  }),
})

// Exporting the ChatroomType
module.exports = ChatroomType
