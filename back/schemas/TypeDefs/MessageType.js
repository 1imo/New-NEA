const graphql = require("graphql")
const { GraphQLObjectType, GraphQLSchema, GraphQLInt, GraphQLString, GraphQLList } = require("graphql")
const { graphqlHTTP } = require("express-graphql")

const UserType = require("./UserType")


const MessageType = new GraphQLObjectType({
    name: "Message",
    fields: () => ({
        id: { type: GraphQLInt},
        sender: { type: UserType },
        messages: { type: new GraphQLList(MessageType) },
        date: { type: GraphQLString}
    })
})

module.exports = MessageType