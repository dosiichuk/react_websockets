const express = require('express');
const path = require('path');
const socket = require('socket.io');

const app = express();

app.use(express.static(path.join(__dirname, '/client')));

let toDos = [];

const server = app.listen(8000);
const io = socket(server);

io.on('connection', (socket) => {
  io.to(socket.id).emit('updateList', toDos);
  socket.on('addTask', (task) => {
    toDos.push(task);
    socket.broadcast.emit('addTask', task);
  });
  socket.on('removeTask', (id) => {
    toDos = toDos.filter((item) => item.id !== id);
    socket.broadcast.emit('updateList', toDos);
  });
  socket.on('updateTask', (task) => {
    toDos = toDos.map((item) => (item.id !== task.id ? item : task));
    socket.broadcast.emit('updateList', toDos);
  });
});
