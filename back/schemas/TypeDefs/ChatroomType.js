const {GraphQLObjectType, GraphQLString, GraphQLList} = require('graphql')

const MessageType = require('./MessageType')
const AuthorType = require('./AuthorType')

const ChatroomType = new GraphQLObjectType({
  name: 'Chatroom',
  fields: () => ({
    id: {type: GraphQLString},
    chatroomUsers: {type: new GraphQLList(AuthorType)},
    messages: {type: new GraphQLList(MessageType)},
    lastMessage: {type: MessageType},
  }),
})

module.exports = ChatroomType
