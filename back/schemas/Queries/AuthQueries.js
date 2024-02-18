const UserType = require("../TypeDefs/UserType");
const { GraphQLObjectType, GraphQLSchema, GraphQLInt, GraphQLString, GraphQLList } = require("graphql")

const AuthQuery = {
    signIn: {
        type: UserType,
        args: { username: { type: GraphQLString }, pass: { type: GraphQLString }},
        async resolve(parent, args, { prisma, io, socket }) {
            console.log(args)
            return
        }
    }
}

module.exports = AuthQuery