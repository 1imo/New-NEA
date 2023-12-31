const express = require("express")
const userData = require("./USER_DATA.json")
const { graphqlHTTP } = require("express-graphql")
const schema = require("./schemas/index.js")
const chatrooms = require("./CHATROOM_DATA.json")
const users = require("./USER_DATA.json")
const sensitive = require("./SENSITIVE_USER_DATA.json")
const cors = require('cors')
const http = require('http');
const app = express()
const fs = require("fs")
app.use(cors({
    origin: 'http://localhost:5173',
    methods: '*',
}))
const server = http.createServer(app);
const io = require('socket.io')(server, {
    cors: {
      origin: '*',
    },
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000, 
});

  
  
const connections = []


  
io.on('connection', (socket) => {

  socket.on("initialConnection", data => {
    console.log(data)
    const user = users.find(user => user?.id === parseInt(data.id) ? user : null)
    const secret = sensitive[user?.id - 1]
    if(secret.id != data.id || secret.secretkey != data.secretkey) {
        return
    } else {
      user.socket = socket.id
      const updatedJSON = JSON.stringify(users, null, 2)
      fs.writeFileSync(__dirname + "/USER_DATA.json", updatedJSON)
    }


  })
  
  socket.on('joinRoom', (roomId) => {
    const chatroom = chatrooms.find(chat => chat.id === roomId)
    if(!chatroom?.connections.includes(socket.id)) {
        chatroom?.connections.push(socket.id)
        const updatedJSON = JSON.stringify(chatrooms, null, 2)
        fs.writeFileSync(__dirname + "/CHATROOM_DATA.json", updatedJSON)
    }
    console.log(socket.conn.id)
    console.log(socket.id)
    // rooms[roomId].users.push(socket.id)

    socket.join(roomId)

    io.in(roomId).emit("chatroom", chatrooms[roomId - 1])
    
    chatroom?.connections.map(connection => io.to(connection).emit("chatroom", chatroom))
  });

  socket.on('chatroom', (roomId) => {
    const chatroom = chatrooms.find(chat => chat.id === roomId)
    io.in(roomId).emit("chatroom", chatrooms[roomId - 1])
    chatroom?.connections.map(connection => io.to(connection).emit("chatroom", chatroom))

  })

  socket.on("getChats", data => {
    const user = users.find(user => user.id === data.id ? user : null)
    const secret = sensitive[user.id - 1]
    if(secret.id != data.id || secret.secretkey != data.secretkey) {
        return
    }

    console.log(secret)

    
    const chats = chatrooms.map(chat => {
      for(let i = 0; i < user.chatrooms.length; i++) {
        if(user.chatrooms[i] == chat.id) {
          return chat
        }
      }
    })

    io.to(socket.id).emit("getChats", chats)


  })

  socket.on("foll", data => {
    const user = users.find(user => user.id === data.id ? user : null)
    const secret = sensitive[user.id - 1]
    if(secret.id != data.id || secret.secretkey != data.secretkey) {
        return
    }
    io.to(socket.id).emit("foll", user.pending)
  })

  

  
  

  // On leave room event
  socket.on('leaveRoom', (roomId) => {
    const room = rooms[roomId];
    const index = room.indexOf(socket.user.id);
    if (index !== -1) room.splice(index, 1);
    socket.leave(roomId);
  });

  
  
});

io.on('connect_error', (err) => {
  console.error(`Socket.IO connection error: ${err.message}`);
});




app.use("/graphql", graphqlHTTP({
    schema,
    graphiql: true,
    context: { io }
}))


server.listen(8000);