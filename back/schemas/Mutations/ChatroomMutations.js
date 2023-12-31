const graphql = require("graphql")
const { GraphQLObjectType, GraphQLSchema, GraphQLInt, GraphQLString, GraphQLList } = require("graphql")
const { graphqlHTTP } = require("express-graphql")
const fs = require("fs")

const update = require("../../index");

const UserType = require("../TypeDefs/UserType")
const PostType = require("../TypeDefs/PostType")

const users = require("../../USER_DATA.json")
const posts = require("../../POST_DATA.json")
const chatrooms = require("../../CHATROOM_DATA.json")
const sensitive = require("../../SENSITIVE_USER_DATA.json")
const ChatroomType = require("../TypeDefs/ChatroomType")
const MessageType = require("../TypeDefs/MessageType")

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
            console.log(args)
            const user = users.find(user => user.id === args.id ? user : null)
            const secret = sensitive[user.id - 1]

            console.log(user, secret)

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
                lastMessage: {},
                connections: []
            }

            console.log(chatroom)

            

            user.chatrooms.push(chatroom.id)
            recipient.chatrooms.push(chatroom.id)
            let updatedJson = JSON.stringify(users, null, 2)
            fs.writeFileSync(__dirname + "/../../USER_DATA.json", updatedJson)

            chatrooms.push(chatroom)
            updatedJson = JSON.stringify(chatrooms, null, 2)
            fs.writeFileSync(__dirname + "/../../CHATROOM_DATA.json", updatedJson)


            
            return chatroom
        }
    },
    sendMessage: {
        type: MessageType,
        args: { id: { type: GraphQLInt}, secretkey: { type: GraphQLString }, chatroom: { type: GraphQLInt }, content: { type: GraphQLString }},
        resolve(parent, args, { io }) {
            // console.log(args)

            const user = users.find(user => user.id === args.id ? user : null)
            const secret = sensitive[user.id - 1]

            if(secret.id != args.id || secret.secretkey != args.secretkey) {
                return
            }

            const chatroom = chatrooms.find(chat => chat.id === args.chatroom)
            const recipient = chatroom.chatters.find(rec => rec.id !== user.id)
            const recipientFull = users.find(user => user.id === recipient.id)

            
            const message = {
                id: chatroom.messages.length + 1,
                sender: {
                    id: user.id,
                    username: user.username,
                    firstName: user.firstName,
                    lastName: user.lastName
                },
                content: args.content,
                date: new Date(),
                read: false
            }

            const msg = chatroom.messages.find(msg => msg.id == message.id)

            console.log(msg)

            if(msg) {
                return
            }

            chatroom.messages.push(message)
            chatroom.lastMessage = message

            const userIndex = user.chatrooms.findIndex(chat => chat === chatroom.id)
            user.chatrooms.splice(userIndex, 1)
            user.chatrooms = [ chatroom.id, ...user.chatrooms ]
            const recipientIndex = recipientFull.chatrooms.findIndex(chat => chat === chatroom.id)
            recipientFull.chatrooms.splice(recipientIndex, 1)
            recipientFull.chatrooms = [ chatroom.id, ...recipientFull.chatrooms ]



            
            const updatedJson = JSON.stringify(users)
            fs.writeFileSync(__dirname + "/../../USER_DATA.json", updatedJson)
            
            updatedJso = JSON.stringify(chatrooms)
            fs.writeFileSync(__dirname + "/../../CHATROOM_DATA.json", updatedJso)


            chatroom.connections.map(connection => io.to(connection).emit('chatroom', chatroom))



            return message
        }
    },
    editMessage: {
        type: MessageType,
        args: { id: { type: GraphQLInt}, secretkey: { type: GraphQLString }, chatroom: { type: GraphQLInt }, message: { type: GraphQLInt }, edit: { type: GraphQLString }},
        resolve(parent, args, { io }) {

            console.log(args)

            const user = users.find(user => user.id === args.id ? user : null)
            const secret = sensitive[user.id - 1]

            if(secret.id != args.id || secret.secretkey != args.secretkey) {
                return
            }

            const chatroom = chatrooms.find(chat => chat.id === args.chatroom ? chat : null)
            const msg = chatroom.messages.find(msg => msg.id === args.message ? msg : null)

            // console.log(chatroom, msg)
            
            // id: { type: GraphQLInt},
            // sender: { type: AuthorType },
            // content: { type: GraphQLString },
            // date: { type: GraphQLString},
            // read: { type: GraphQLBoolean }

            console.log(chatroom)

            switch(args.edit) {
                case "read":

                    msg.read = true
                    console.log("READING")
                case "unread":
                    msg.read === false
                case "delete":
                    msg.content === "Message has been deleted"
            }

            const updatedJson = JSON.stringify(chatrooms, null, 2)
            fs.writeFileSync(__dirname + "/../../CHATROOM_DATA.json", updatedJson)


            chatroom.connections.map(connection => io.to(connection).emit('chatroom', chatroom))

            return msg

        }
    }
}

module.exports = ChatroomMutations