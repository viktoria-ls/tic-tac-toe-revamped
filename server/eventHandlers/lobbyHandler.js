const lobbyHandler = (io, socket, roomTracker) => {
    socket.on('join_room', (data) => {
        var {nickname, roomId} = data;
        if(roomTracker.rooms.has(roomId)) {
            socket.join(roomId);
            socket.emit('join_success', {roomId});
            roomTracker.rooms.set(roomId, {...roomTracker.rooms.get(roomId), otherNickname: nickname});
            console.log(roomTracker.rooms)
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
        var newRoomId = roomTracker.nextRoomId.toString().padStart(5, '0');
        socket.join(newRoomId);
        socket.emit('join_success', {roomId: newRoomId});
        roomTracker.nextRoomId += 1;

        roomTracker.rooms.set(newRoomId, {nickname, numReady: 0});
        console.log(`User ${nickname} created Room ${newRoomId}`);
        console.log(roomTracker.rooms)
    });

    // Joins random room if available
    socket.on('join_random', (data) => {
        var {nickname} = data;
        for(let i = 0; i < roomTracker.rooms.size.length; i++) {
            var roomIds = roomTracker.rooms.keys();
            if(roomTracker.rooms.has(roomIds[i]) && io.sockets.adapter.rooms.get(roomIds[i]).size === 1) {
                socket.join(roomIds[i]);
                socket.emit('join_success', {roomId: roomIds[i]});
                roomTracker.rooms.set(roomIds[i], {...roomTracker.rooms.get(roomIds[i]), otherNickname: nickname});
                console.log(`User ${nickname} joined Room ${roomIds[i]}`);
                console.log(roomTracker.rooms)
                break;
            }
        }
        socket.emit('no_rooms_found');
        // TODO: Route to 'create_room' with message about no_rooms_found
        //socket.emit('create_room', {nickname});
    });
}

module.exports = lobbyHandler;