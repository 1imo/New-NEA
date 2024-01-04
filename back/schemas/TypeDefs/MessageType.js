const graphql = require("graphql")
const { GraphQLObjectType, GraphQLSchema, GraphQLInt, GraphQLString, GraphQLList, GraphQLBoolean } = require("graphql")
const { graphqlHTTP } = require("express-graphql")

const UserType = require("./UserType")
const AuthorType = require("./AuthorType")


const MessageType = new GraphQLObjectType({
    name: "Message",
    fields: () => ({
        id: { type: GraphQLString },
        sender: { type: AuthorType },
        content: { type: GraphQLString },
        date: { type: GraphQLString},
        read: { type: GraphQLBoolean }
    })
})

module.exports = MessageType