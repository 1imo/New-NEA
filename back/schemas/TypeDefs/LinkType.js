const graphql = require("graphql")
const { GraphQLObjectType, GraphQLSchema, GraphQLInt, GraphQLString, GraphQLList } = require("graphql")
const { graphqlHTTP } = require("express-graphql")


const LinkType = new GraphQLObjectType({
    name: "Link",
    fields: () => ({
        url: { type: GraphQLString}
    })
})

module.exports = LinkType