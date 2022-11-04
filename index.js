// const audic = require('audic');
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const users={};
// const audio=new Audic('message.mp3');


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  socket.on('new-user-joined',username=>{
    users[socket.id]=username;
    socket.broadcast.emit('chat message', `user ${username} joined the chat :)`);
  });

  socket.on('chat message', (msg) => {
    io.emit('some event', { someProperty: 'some value', otherProperty: 'other value' }); // This will emit the event to all connected sockets
    socket.broadcast.emit('chat message',`${users[socket.id]}:${msg}`)
    socket.emit('chat message',`you :${msg}`);
    // audio.play();
    
  });

  socket.on('disconnect', username => {
    // console.log(`user ${users[socket.id]} disconnected`);
    socket.broadcast.emit('chat message', `user ${users[socket.id]} has disconnected!!`);
  });

});

server.listen(3000, () => {
  console.log('listening on *:3000');
});