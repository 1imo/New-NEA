const graphql = require("graphql")
const { GraphQLObjectType, GraphQLSchema, GraphQLInt, GraphQLString, GraphQLList } = require("graphql")
const { graphqlHTTP } = require("express-graphql")



const PendingType = new GraphQLObjectType({
    name: "Pending",
    fields: () => ({
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        username: { type: GraphQLString },
        pendingId: { type: GraphQLString }
    })
})

module.exports = PendingType