const graphql = require("graphql")
const { GraphQLObjectType, GraphQLSchema, GraphQLInt, GraphQLString, GraphQLList } = require("graphql")
const { graphqlHTTP } = require("express-graphql")



const AuthorType = new GraphQLObjectType({
    name: "Author",
    fields: () => ({
        id: { type: GraphQLInt },
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
        username: { type: GraphQLString }
    })
})

module.exports = AuthorType