const graphql = require("graphql")
const { GraphQLObjectType, GraphQLSchema, GraphQLInt, GraphQLString, GraphQLList } = require("graphql")
const { graphqlHTTP } = require("express-graphql")



const SensitiveUserDataType = new GraphQLObjectType({
    name: "SensitiveUserData",
    fields: () => ({
        id: { type: GraphQLInt},
        username: { type: GraphQLString },
        password: { type: GraphQLString },
        secretkey: { type: GraphQLString },
    })
})

module.exports = SensitiveUserDataType