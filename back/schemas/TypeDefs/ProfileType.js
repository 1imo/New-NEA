const graphql = require("graphql")
const { GraphQLObjectType, GraphQLSchema, GraphQLInt, GraphQLString, GraphQLList } = require("graphql")
const { graphqlHTTP } = require("express-graphql")


const ProfileType = new GraphQLObjectType({
    name: "Profile",
    fields: () => ({
        id: { type: GraphQLString},
        name: { type: GraphQLString},
        username: { type: GraphQLString},
        friendCount: { type: GraphQLInt},
        followerCount: { type: GraphQLInt},
        followingCount: { type: GraphQLInt},
    })
})

module.exports = ProfileType