const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { v4: uuidV4 } = require('uuid')

const { PeerServer } = require('peer'); 
const peerServer = PeerServer({ port: 3001, path: '/' });
peerServer.listen()

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.redirect(`/${uuidV4()}`)
})

app.get('/:room', (req, res) => {
  res.render('room', { roomId: req.params.room })
})

io.on('connection', socket => {
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId)
    socket.to(roomId).emit('user-connected', userId)

    socket.on('disconnect', () => {
      socket.to(roomId).emit('user-disconnected', userId)
    })

    socket.on('new-chat', (nickname, message) => {
      io.to(roomId).emit('chatroom-refresh', nickname, message)
    })//確認完回傳到腳本

  })
})

server.listen(3000)