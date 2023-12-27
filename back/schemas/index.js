const userData = require("../USER_DATA.json")
const graphql = require("graphql")
const { GraphQLObjectType, GraphQLSchema, GraphQLInt, GraphQLString } = require("graphql")
const { graphqlHTTP } = require("express-graphql")
const UserType = require("./TypeDefs/UserType")
const fs = require("fs")

const UserMutations = require("./Mutations/UserMutations")
const PostMutations = require("./Mutations/PostMutations")

const PostQueries = require("./Queries/PostQueries")
const UserQueries = require("./Queries/UserQuery")
const PublicUserQueries = require("./Queries/PublicUserQuery")
const ChatroomQueries = require("./Queries/ChatroomQueries")

const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
        getAllUsers: {
            type: new graphql.GraphQLList(UserType),
            args: { id: { type: GraphQLInt}},
            resolve(parent, args) {
                return userData
            }
        },
        ...UserQueries,
        ...PostQueries,
        ...PublicUserQueries,
        ...ChatroomQueries
    }
})


const Mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        ...UserMutations,
        ...PostMutations
    }
})




module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})