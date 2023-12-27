const users = require("../../USER_DATA.json")
const graphql = require("graphql")
const { GraphQLObjectType, GraphQLSchema, GraphQLInt, GraphQLString } = require("graphql")
const { graphqlHTTP } = require("express-graphql")
const UserType = require("../TypeDefs/UserType")


const UserQuery = {
        navInfo: {
            type: UserType,
            args: { id: { type: GraphQLInt}, secretkey: { type: GraphQLString }},
            resolve(parent, args) {
                const user = users.find(user => user.id === args.id && user.secretkey === args.secretkey ? user : null)
                return user
            }
        }
    }


module.exports = UserQuery