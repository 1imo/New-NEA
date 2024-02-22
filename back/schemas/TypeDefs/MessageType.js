const {GraphQLObjectType, GraphQLString, GraphQLBoolean} = require('graphql')
const AuthorType = require('./AuthorType')

const MessageType = new GraphQLObjectType({
  name: 'Message',
  fields: () => ({
    id: {type: GraphQLString},
    sender: {type: AuthorType},
    content: {type: GraphQLString},
    date: {type: GraphQLString},
    read: {type: GraphQLBoolean},
  }),
})

module.exports = MessageType
