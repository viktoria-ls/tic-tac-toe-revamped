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

io.on('connection', (socket) => {
    console.log(`Connected socket #${socket.id}`);

    socket.on('test_connect', () => {
        console.log(`Socket #${socket.id} is connected`);
    });

    socket.on('disconnect', () => {
        console.log(`Disconnected socket #${socket.id}`);
    })
});


const port = process.env.PORT || 3001;
server.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});