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
        origin: process.env.CLIENT_URL,
        methods: ['GET']
    }
});

var roomTracker = {
    nextRoomId: 1,
    rooms: new Map()
}

io.on('connection', (socket) => {
    console.log(`Connected client socket #${socket.id}`);

    require('./eventHandlers/lobbyHandler')(io, socket, roomTracker);
    require('./eventHandlers/gameHandler')(io, socket, roomTracker);

    socket.on('disconnect', () => {
        console.log(`Disconnected socket #${socket.id}`);
    })
});

// TODO: Add listener for /game/:roomId to check if game is full


const port = process.env.PORT || 3001;
server.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});