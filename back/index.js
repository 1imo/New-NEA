const express = require('express')
const {graphqlHTTP} = require('express-graphql')
const schema = require('./schemas/index.js')
const cors = require('cors')
const http = require('http')
const fs = require('fs')
const {PrismaClient} = require('@prisma/client')
require('dotenv').config()
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy

const app = express()
const prisma = new PrismaClient()

app.use(
  cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173/'],
    methods: '*',
  }),
)

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: '/auth/google/callback',
      scope: ['profile', 'email'],
    },
    (accessToken, refreshToken, profile, done) => {
      // You can store user profile in a database or return directly as needed,
      // console.log(profile, done, accessToken, refreshToken)
      done(null, profile)
    },
  ),
)

app.use(passport.initialize())

app.get(
  '/auth/google',
  passport.authenticate('google', {scope: ['profile', 'email']}),
)

const memory = []

app.get(
  '/auth/google/callback',
  passport.authenticate('google', {session: false}),
  async (req, res) => {
    if (req.user) {
      const {profile, accessToken} = req.user

      const exists = await prisma.user.count({
        where: {id: req.user.id},
      })

      const {nanoid} = await import('nanoid')
      const apiKey = nanoid()

      let user

      if (exists) {
        user = await prisma.userData.findFirst({
          where: {id: req.user.id},
          select: {id: true, secretkey: true},
        })
        res.redirect(`http://localhost:5173/?u=${user.id}&k=${user.secretkey}`)
      } else {
        user = await prisma.user.create({
          data: {
            name: req.user.displayName,
            username: req.user.displayName.replace(/\s+/g, ''),
            userData: {
              create: {
                secretkey: apiKey,
                password: '',
              },
            },
          },
        })
        res.redirect(`http://localhost:5173/?u=${user.id}&k=${apiKey}`)
      }
    } else {
      res.status(401).json({error: 'Authentication failed'})
    }
  },
)

const server = http.createServer(app)
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  },
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
})

io.on('connection', (socket) => {
  socket.on('initialConnection', async (data) => {
    try {
      data = sanitise(data)
      const exists = await auth(data.id, data.secretkey)
  
      if (!exists) {
        io.to(socket.id).emit('auth', false)
        return
      } else {
        await prisma.user.update({
          where: {
            id: data.id,
          },
          data: {
            socket: socket.id,
          },
        })
  
        io.to(socket.id).emit('auth', true)
      }
    } catch(e) {
      log(e)
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

  socket.on('getChats', async (data) => {
    try {
      data = sanitise(data)
      await auth(data.id, data.secretkey)
      
      const chatrooms = await prisma.user.findFirst({
        where: {
          id: data.id,
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
                      user: true,
                    },
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
                  },
                },
              },
            },
          },
        },
      })
  
      io.to(socket.id).emit('getChats', chatrooms.chatroomUsers)
    } catch (e) {
      log(e)
    }

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
  console.error(`Socket.IO connection error: ${err.message}`)
})

async function auth(id, key) {
  const exists = await prisma.userData.count({
    where: {
      AND: [{id: id}, {secretkey: key}],
    },
  })

  if (!exists) {
    throw new Error('Invalid Credentials')
  } else {
    return true
  }
}

function sanitise(input) {
  const sanitizedObj = {}

  Object.keys(input).forEach((key) => {
    const value = input[key]
    let sanitizedValue = value

    // Escape Characters
    sanitizedValue = sanitizedValue.replace(/['"\\]/g, '\\$&')

    // Blacklisting
    const blacklistedChars = ['<', '>', '&', ';', '#', '{', '}'] // Example blacklist
    blacklistedChars.forEach((char) => {
      sanitizedValue = sanitizedValue.replace(new RegExp(char, 'g'), '')
    })

    // Length Limitation
    const maxLength = 100 // Example maximum length
    sanitizedValue = sanitizedValue.slice(0, maxLength)

    // Canonicalization (Remove variations such as leading/trailing spaces)
    sanitizedValue = sanitizedValue.trim()

    // Assign sanitized value to the corresponding key
    sanitizedObj[key] = sanitizedValue
  })

  return sanitizedObj
}

// Store Error Logs
function log(e) {
  const timestamp = Date.now()

  const currentDate = new Date(timestamp)

  // Define options for formatting the date and time
  const day = {
    day: '2-digit', // Day (dd)
    month: '2-digit', // Month (mm)
    year: '2-digit', // Year (yy)
    hour12: false, // Use 24-hour format
  }

  const time = {
    hour: '2-digit', // Hours (hh)
    minute: '2-digit', // Minutes (mm)
    second: '2-digit', // Seconds (ss)
    hour12: false, // Use 24-hour format
  }

  const formattedDate = currentDate.toLocaleString('en-US', day)
  const formattedTime = currentDate.toLocaleString('en-US', time)

  fs.appendFileSync(
    `/logs/${formattedDate}.txt`,
    `${formattedTime}    ${e.message}`,
  )
}

app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: true,
    context: {io, prisma, auth, sanitise, log},
  }),
)

server.listen(8000)
