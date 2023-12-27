const graphql = require("graphql")
const { GraphQLObjectType, GraphQLSchema, GraphQLInt, GraphQLString, GraphQLList } = require("graphql")
const { graphqlHTTP } = require("express-graphql")
const postData = require("../../POST_DATA.json")
const PostType = require("./PostType")
const ChatroomType = require("./ChatroomType")
const UserType = require("./UserType")
const PublicUserType = require("./PublicUserType")


const ShortUserType = new GraphQLObjectType({
    name: "ShortUser",
    fields: () => ({
        id: { type: GraphQLInt},
        username: { type: GraphQLString},
        firstName: { type: GraphQLString},
        lastName: { type: GraphQLString}
    })
})

module.exports = ShortUserType