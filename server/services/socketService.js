const { updateStreamStats, getStreamStats, filterRoomsForDeletion } = require("../utils/redis/stream/redisStreamService");

const getNumOfConnectInAllRooms = () => {
    const rooms = _io.sockets.adapter.rooms;
    console.log("-----START-----");
    logClientCount()
    rooms.forEach((room, roomName) => {
        // Nếu room không phải là một phòng riêng cho socket (mỗi socket có 1 room riêng là socket id)
        if (!_io.sockets.adapter.sids.has(roomName)) {
            const numberOfSockets = room.size;
            console.log(`Current number of sockets in room ${roomName}: ${numberOfSockets}`);
        }
    });
    console.log("-----END----- \n");
};

const getNumOfConnectInRoom = (roomId) => {
    const room = _io.sockets.adapter.rooms.get(roomId);
    if (room) {
        const numberOfConnections = room.size;
        return numberOfConnections;
    } else {
        return 0;
    }
};

const logClientCount = () => {
    const clientCount = _io.engine.clientsCount;
    console.log(`Total connected clients: ${clientCount}`);
};

const connectSocket = (socket) => {
    socket.on('disconnecting', () => {
        const rooms = Array.from(socket.rooms);
        let validRoom = filterRoomsForDeletion(rooms);

        validRoom.forEach(async (key) => {
            const parts = key.split(':');
            const [, channelId, fields] = parts;
            await updateStreamStats(channelId, 'decrement', fields, 1)
        })
    });
    socket.on('disconnect', async () => {
        getNumOfConnectInAllRooms();
    })
    getNumOfConnectInAllRooms();
    // Gửi tin nhắn
    _io.emit('receiveMessage', 'Welcome to the socket!');
    // Thông báo cho admin rằng user đã join vào room
    socket.on('joinRoom', async (room) => {
        await updateStreamStats(room, 'increment', 'currentViews', 1)
        await updateStreamStats(room, 'increment', 'totalViews', 1)
        await updateStreamStats(room, 'increment', 'totalReps', 1000)
        socket.join(room);
    })
}

module.exports = {
    connectSocket,
    getNumOfConnectInRoom
}
