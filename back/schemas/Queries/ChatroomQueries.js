const users = require("../../USER_DATA.json")
const graphql = require("graphql")
const { GraphQLObjectType, GraphQLSchema, GraphQLInt, GraphQLString } = require("graphql")
const { graphqlHTTP } = require("express-graphql")
const ChatroomType = require("../TypeDefs/ChatroomType")


// id: { type: GraphQLInt},
// chatters: { type: new GraphQLList(UserType) },
// messages: { type: new GraphQLList(MessageType) },
// lastMessage: { type: MessageType }


const ChatroomQueries = {
        getLocation: {
            type: ChatroomType,
            args: { id: { type: GraphQLInt}, secretkey: { type: GraphQLString }, username: { type: GraphQLString }},
            resolve(parent, args) {
                const user = users.find(user => user.id === args.id && user.secretkey === args.secretkey ? user : null)
                return user
            }
        }
    }


module.exports = ChatroomQueries