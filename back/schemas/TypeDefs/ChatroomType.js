const graphql = require("graphql")
const { GraphQLObjectType, GraphQLSchema, GraphQLInt, GraphQLString, GraphQLList } = require("graphql")
const { graphqlHTTP } = require("express-graphql")

const UserType = require("./UserType")
const MessageType = require("./MessageType")

const ChatroomType = new GraphQLObjectType({
    name: "Chatroom",
    fields: () => ({
        id: { type: GraphQLInt},
        chatters: { type: new GraphQLList(UserType) },
        messages: { type: new GraphQLList(MessageType) },
        lastMessage: { type: MessageType }
    })
})

module.exports = ChatroomType