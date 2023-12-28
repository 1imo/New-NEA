const graphql = require("graphql")
const { GraphQLObjectType, GraphQLSchema, GraphQLInt, GraphQLString, GraphQLList } = require("graphql")
const { graphqlHTTP } = require("express-graphql")


const MessageType = require("./MessageType")
const UserType = require("./UserType")
const AuthorType = require("./AuthorType")

const ChatroomType = new GraphQLObjectType({
    name: "Chatroom",
    fields: () => ({
        id: { type: GraphQLInt},
        chatters: { type: new GraphQLList(AuthorType) },
        messages: { type: new GraphQLList(MessageType) },
        lastMessage: { type: MessageType }
    })
})

module.exports = ChatroomType