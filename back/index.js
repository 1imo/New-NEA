const express = require("express")
const userData = require("./USER_DATA.json")
const { graphqlHTTP } = require("express-graphql")
const schema = require("./schemas/index.js")
const chatrooms = require("./CHATROOM_DATA.json")
const users = require("./USER_DATA.json")
const sensitive = require("./SENSITIVE_USER_DATA.json")
const cors = require('cors')
const http = require('http');
const fs = require("fs")
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;


const app = express()
const prisma = new PrismaClient()

app.use(cors({
  origin: ['http://localhost:5173', "http://127.0.0.1:5173/"],
  methods: '*',
}))

passport.use(
  new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: '/auth/google/callback',
    scope: ['profile', 'email'],
  }, (accessToken, refreshToken, profile, done) => {
    // You can store user profile in a database or return directly as needed,
    // console.log(profile, done, accessToken, refreshToken)
    done(null, profile);
  })
)

app.use(passport.initialize());

app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }))

const memory = []

app.get('/auth/google/callback', passport.authenticate('google', { session: false }), async (req, res) => {
  if (req.user) {
    const { profile, accessToken } = req.user

    const exists = await prisma.user.count({
      where: { id: req.user.id },
    });

    const { nanoid } = await import('nanoid')
    const apiKey = nanoid()

    let user;

    if (exists) {
      user = await prisma.userData.findFirst({
        where: { id: req.user.id },
        select: { id: true, secretkey: true },
      })
      res.redirect(`http://localhost:5173/?u=${user.id}&k=${user.secretkey}`)
    } else {
      user = await prisma.user.create({
        data: {
          name: req.user.displayName,
          username: req.user.displayName.replace(/\s+/g, ""),
          userData: {
            create: {
              secretkey: apiKey,
              password: "",
            },
          },
        }
      })
      res.redirect(`http://localhost:5173/?u=${user.id}&k=${apiKey}`)
    }


  } else {
    res.status(401).json({ error: 'Authentication failed' });
  }
})




const server = http.createServer(app);
const io = require('socket.io')(server, {
    cors: {
      origin: "*"
    },
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000, 
})

  
io.on('connection', (socket) => {

  socket.on("initialConnection", async data => {
    const exists = await prisma.userData.count({
      where: { 
          AND: [
              {id: data.id},
              {secretkey: data.secretkey}
          ]
      }
    })

    if(!exists) {
        io.to(socket.id).emit("auth", false)
        return

    } else {

      await prisma.user.update({
        where: {
          id: data.id
        },
        data: {
          socket: socket.id
        }
      })

      io.to(socket.id).emit("auth", true)


    }

  })
  
  // socket.on('joinRoom', (roomId) => {
  //   const chatroom = chatrooms.find(chat => chat.id === roomId)
  //   if(!chatroom?.connections.includes(socket.id)) {
  //       chatroom?.connections.push(socket.id)
  //       const updatedJSON = JSON.stringify(chatrooms, null, 2)
  //       fs.writeFileSync(__dirname + "/CHATROOM_DATA.json", updatedJSON)
  //   }
  //   console.log(socket.conn.id)
  //   console.log(socket.id)
  //   // rooms[roomId].users.push(socket.id)

  //   socket.join(roomId)

  //   io.in(roomId).emit("chatroom", chatrooms[roomId - 1])
    
  //   chatroom?.connections.map(connection => io.to(connection).emit("chatroom", chatroom))
  // });

  // socket.on('chatroom', (roomId) => {
  //   const chatroom = chatrooms.find(chat => chat.id === roomId)
  //   io.in(roomId).emit("chatroom", chatrooms[roomId - 1])
  //   chatroom?.connections.map(connection => io.to(connection).emit("chatroom", chatroom))

  // })

  socket.on("getChats", async data => {

    const exists = await prisma.userData.count({
      where: { 
          AND: [
              {id: data.id},
              {secretkey: data.secretkey}
          ]
      }
    })

    if(!exists) {
        return
    }

    console.log(data)

    const chatrooms = await prisma.user.findFirst({
        where: {
            id: data.id
        },
        select: {
            id: true,
            chatroomUsers: {
                select: {
                    chatroom: {
                        select: {
                            id: true,
                            chatroomUsers: {
                              select: {
                                user: true
                              }
                            },
                            messages: {
                                orderBy: {
                                  date: 'desc',
                                },
                                take: 1,
                                select: {
                                  id: true,
                                  content: true,
                                  sender: {
                                    select: {
                                      name: true,
                                      username: true,
                                    },
                                  },
                                  date: true,
                                },
                            }
                        }
                    }
                }
            }
        }
    })


    io.to(socket.id).emit("getChats", chatrooms.chatroomUsers)

  })

  // socket.on("foll", data => {
  //   const user = users.find(user => user.id === data.id ? user : null)
  //   const secret = sensitive[user.id - 1]
  //   if(secret.id != data.id || secret.secretkey != data.secretkey) {
  //       return
  //   }
  //   io.to(socket.id).emit("foll", user.pending)
  // })

  

  
  

  // // On leave room event
  // socket.on('leaveRoom', (roomId) => {
  //   const room = rooms[roomId];
  //   const index = room.indexOf(socket.user.id);
  //   if (index !== -1) room.splice(index, 1);
  //   socket.leave(roomId);
  // });

  
  
})

io.on('connect_error', (err) => {
  console.error(`Socket.IO connection error: ${err.message}`);
})




app.use("/graphql", graphqlHTTP({
    schema,
    graphiql: true,
    context: { io, prisma }
}))


server.listen(8000);