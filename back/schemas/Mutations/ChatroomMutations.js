const graphql = require("graphql")
const { GraphQLObjectType, GraphQLSchema, GraphQLInt, GraphQLString, GraphQLList } = require("graphql")
const { graphqlHTTP } = require("express-graphql")
const fs = require("fs")

const UserType = require("../TypeDefs/UserType")
const PostType = require("../TypeDefs/PostType")

const users = require("../../USER_DATA.json")
const posts = require("../../POST_DATA.json")
const chatrooms = require("../../CHATROOM_DATA.json")
const sensitive = require("../../SENSITIVE_USER_DATA.json")
const ChatroomType = require("../TypeDefs/ChatroomType")

// const ChatroomType = new GraphQLObjectType({
//     name: "Chatroom",
//     fields: () => ({
//         id: { type: GraphQLInt},
//         chatters: { type: new GraphQLList(UserType) },
//         messages: { type: new GraphQLList(MessageType) },
//         lastMessage: { type: MessageType }
//     })
// })


const ChatroomMutations = {
    getLocation: {
        type: ChatroomType,
        args: { id: { type: GraphQLInt}, secretkey: { type: GraphQLString }, username: { type: GraphQLString }},
        resolve(parent, args) {
    
            const user = users.find(user => user.id === args.id ? user : null)
            const secret = sensitive[user.id - 1]

            if(secret.id != args.id || secret.secretkey != args.secretkey) {
                return
            }

            const recipient = users.find(user => user.username == args.username ? user : null)


            const chatterOne = {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username
            }

            const chatterTwo = {
                id: recipient.id,
                firstName: recipient.firstName,
                lastName: recipient.lastName,
                username: recipient.username
            }

            const chatroom = {
                id: chatrooms.length + 1,
                chatters: [ chatterOne, chatterTwo ],
                messages: [],
                lastMessage: {}
            }

            

            user.chatrooms.push(chatroom)
            recipient.chatrooms.push(chatroom)
            let updatedJson = JSON.stringify(users, null, 2)
            fs.writeFileSync(__dirname + "/../../USER_DATA.json", updatedJson)

            chatrooms.push(chatroom)
            updatedJson = JSON.stringify(chatrooms, null, 2)
            fs.writeFileSync(__dirname + "/../../CHATROOM_DATA.json", updatedJson)


            
            return chatroom
        }
    }
}

module.exports = ChatroomMutations