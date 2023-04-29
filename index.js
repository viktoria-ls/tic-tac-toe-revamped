require('dotenv').config();
const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
});

var nextRoomId = 1;
var roomIds = [];

io.on('connection', (socket) => {
    console.log(`Connected socket #${socket.id}`);

    // Attempts to join room given a roomId
    socket.on('join_room', (data) => {
        var {nickname, roomId} = data;
        if(roomIds.includes(roomId)) {
            socket.join(roomId);
            socket.emit('room_found');
            console.log(`User ${nickname} joined Room ${roomId}`);
            console.log(io.sockets.adapter.rooms);
        }
        else {
            console.log(`Room ${roomId} not found`)
            socket.emit('room_not_found');
        }
    });

    // Creates a new room
    socket.on('create_room', (data) => {
        var {nickname} = data;
        var newRoomId = nextRoomId.toString().padStart(5, '0');
        socket.join(newRoomId);
        nextRoomId += 1;
        roomIds.push(newRoomId);
        console.log(`User ${nickname} created Room ${newRoomId}`);
    });

    // Joins random room if available
    socket.on('join_random', (data) => {
        var {nickname} = data;
        for(let i = 0; i < roomIds.length; i++) {
            if(io.sockets.adapter.rooms.get(roomIds[i]).size < 2) {
                socket.join(roomIds[i]);
                console.log(`User ${nickname} joined Room ${roomIds[i]}`);
                break;
            }
        }
        socket.emit('no_rooms_found');
    });

    socket.on('disconnect', () => {
        console.log(`Disconnected socket #${socket.id}`);
    })
});


const port = process.env.PORT || 3001;
server.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});