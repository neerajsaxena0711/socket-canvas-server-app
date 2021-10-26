const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io", {
  cors: {
    origin: '*',
  }
});
const io = new Server(server);
let connections = [];

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});


io.on('connection', (socket) => {
  console.log('a user connected');
  connections.push(socket);

  socket.on('disconnect', (socket) => {
    console.log('a user disconnected');
    connections = connections.filter((con) => con.id !== socket.id)
  });

  socket.on('draw', (data) => {
    connections.forEach((conn) => {
      if (conn.id !== socket.id) {
        conn.emit('ondraw', { x: data.x, y: data.y })
      }
    })
  })

  socket.on('down', (data)=>{
    connections.forEach((conn)=>{
      if (conn.id !== socket.id){
        conn.emit('ondown', { x: data.x, y: data.y })
      }
    })
  });

});

server.listen(3000, () => {
  console.log('listening on *:3000');
});