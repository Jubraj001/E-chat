const express = require('express');
const app = express();

const server = app.listen(8000);

const io = require('socket.io')(server, {
    cors: {
      origin: '*',
    }
});

const users = {};

io.on('connection', socket=>{
    socket.on('new-user-joined', name=>{
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });

    socket.on('send', message=>{
        socket.broadcast.emit('recieve', {message: message, name: users[socket.id]})
    });

    socket.on('disconnect', message=>{
        socket.broadcast.emit('leave', users[socket.id]);
        delete users[socket.id];
    });

});