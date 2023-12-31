const users = require("../../USER_DATA.json")
const graphql = require("graphql")
const { GraphQLObjectType, GraphQLSchema, GraphQLInt, GraphQLString, GraphQLList } = require("graphql")
const { graphqlHTTP } = require("express-graphql")
const ChatroomType = require("../TypeDefs/ChatroomType")
const UserType = require("../TypeDefs/UserType")

const users = require("../../USER_DATA.json")
const posts = require("../../POST_DATA.json")
const chatrooms = require("../../CHATROOM_DATA.json")


// id: { type: GraphQLInt},
// chatters: { type: new GraphQLList(UserType) },
// messages: { type: new GraphQLList(MessageType) },
// lastMessage: { type: MessageType }


const ChatroomQueries = {
        getChats: {
            type: GraphQLList(ChatroomType),
            args: { id: { type: GraphQLInt }, secretkey: { type: GraphQLString }},
            resolve(parent, args, { io }) {

                const user = users.find(user => user.id === args.id ? user : null)
                const secret = sensitive[user.id - 1]

                if(secret.id != args.id || secret.secretkey != args.secretkey) {
                    return
                }

                const chats = user.chatrooms.map(chat => { return chat })

                const insights = chatrooms.map(chat => {
                    for(let i = 0; i < chats.length; i++) {
                        if(chat.id == chats[i]) {
                            return chat.lastMessage
                        }
                    }
                })

                return insights
            }
        }
    }


module.exports = ChatroomQueries