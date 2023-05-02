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
var rooms = new Map(); // change roomId: num to roomId: {nickname, otherNickname, numReady}

io.on('connection', (socket) => {
    console.log(`Connected socket #${socket.id}`);

    // Attempts to join room given a roomId
    socket.on('join_room', (data) => {
        var {nickname, roomId} = data;
        if(rooms.has(roomId)) {
            socket.join(roomId);
            socket.emit('join_success', {roomId});
            rooms.set(roomId, {...rooms.get(roomId), otherNickname: nickname});
            console.log(rooms)
            console.log(`User ${nickname} joined Room ${roomId}`);
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
        socket.emit('join_success', {roomId: newRoomId});
        nextRoomId += 1;

        rooms.set(newRoomId, {nickname, numReady: 0});
        console.log(`User ${nickname} created Room ${newRoomId}`);
        console.log(rooms)
    });

    // Joins random room if available
    socket.on('join_random', (data) => {
        var {nickname} = data;
        for(let i = 0; i < rooms.size.length; i++) {
            var roomIds = rooms.keys();
            if(rooms.has(roomIds[i]) && io.sockets.adapter.rooms.get(roomIds[i]).size === 1) {
                socket.join(roomIds[i]);
                socket.emit('join_success', {roomId: roomIds[i]});
                rooms.set(roomIds[i], {...rooms.get(roomIds[i]), otherNickname: nickname});
                console.log(`User ${nickname} joined Room ${roomIds[i]}`);
                console.log(rooms)
                break;
            }
        }
        socket.emit('no_rooms_found');
        // TODO: Route to 'create_room' with message about no_rooms_found
        //socket.emit('create_room', {nickname});
    });

    socket.on('in_game', (data) => {
        var {roomId} = data;
        if(rooms.has(roomId) && io.sockets.adapter.rooms.get(roomId).size === 2) {
            io.in(roomId).emit('players_select');
        }
    });

    socket.on('confirm_abilities', (data) => {
        var {abilities, roomId} = data;
        rooms.set(roomId, {...rooms.get(roomId), numReady: rooms.get(roomId).numReady + 1});
        console.log(rooms)
        socket.emit('abilities_ready', {abilities});
        if(rooms.get(roomId).numReady === 2) {
            console.log(`Room ${roomId} players ready`);

            var [first, second] = io.sockets.adapter.rooms.get(roomId);
            io.in(first).emit('player_assignment', {nickname: rooms.get(roomId).nickname, otherNickname:rooms.get(roomId).otherNickname, token: 'X'});
            io.in(second).emit('player_assignment', {nickname: rooms.get(roomId).otherNickname, otherNickname:rooms.get(roomId).nickname, token: 'O'});

            io.in(first).emit('your_turn', {});
        }
    });

    socket.on('turn_done', (data) => {
        var {roomId, row, col} = data;
        var roomClients = io.sockets.adapter.rooms.get(roomId);

        roomClients.forEach(c => {
            if(c !== socket.id)
                io.in(c).emit('your_turn', {row, col});
        });
    });

    socket.on('disconnect', () => {
        console.log(`Disconnected socket #${socket.id}`);
    })
});

// TODO: Add listener for /game/:roomId to check if game is full


const port = process.env.PORT || 3001;
server.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});