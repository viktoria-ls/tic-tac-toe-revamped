const gameHandler = (io, socket, roomTracker) => {

    socket.on('in_game', (data) => {
        var {roomId} = data;
        if(roomTracker.rooms.has(roomId) && io.sockets.adapter.rooms.get(roomId).size === 2) {
            io.in(roomId).emit('players_select');
        }
    });

    socket.on('confirm_abilities', (data) => {
        var {abilities, roomId} = data;
        roomTracker.rooms.set(roomId, {...roomTracker.rooms.get(roomId), numReady: roomTracker.rooms.get(roomId).numReady + 1});
        console.log(roomTracker.rooms)
        socket.emit('abilities_ready', {abilities});
        if(roomTracker.rooms.get(roomId).numReady === 2) {
            console.log(`Room ${roomId} players ready`);

            var [first, second] = io.sockets.adapter.rooms.get(roomId);
            io.in(first).emit('player_assignment', {nickname: roomTracker.rooms.get(roomId).nickname, otherNickname:roomTracker.rooms.get(roomId).otherNickname, token: 'X'});
            io.in(second).emit('player_assignment', {nickname: roomTracker.rooms.get(roomId).otherNickname, otherNickname:roomTracker.rooms.get(roomId).nickname, token: 'O'});

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
}

module.exports = gameHandler;