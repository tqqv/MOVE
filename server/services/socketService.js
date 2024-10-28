
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

const logClientCount = () => {
    const clientCount = _io.engine.clientsCount;
    console.log(`Total connected clients: ${clientCount}`);
};


const connectSocket = (socket) => {
    socket.on('disconnect', () => {
        console.log(`User disconnect socket-id is: ${socket.id}`);
        getNumOfConnectInAllRooms();
    })
    console.log("New user connect socket-id is: ", socket.id)
    getNumOfConnectInAllRooms();
    // Gửi tin nhắn
    _io.emit('receiveMessage', 'Welcome to the socket!');
    // Thông báo cho admin rằng user đã join vào room
    socket.on('joinRoom', (room) => {
        // specify socket join the room
        socket.join(room);
        // getNumOfConnectInRooms(room)
    })
}



module.exports = {
    connectSocket
}
