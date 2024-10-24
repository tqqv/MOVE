
const getNumOfConnectInRooms = (roomName) => {
    const room = _io.sockets.adapter.rooms.get(roomName);
    const numberOfSockets = room ? room.size : 0;
    console.log(`Current number of sockets in room ${roomName}: ${numberOfSockets}`)
    return numberOfSockets;
}

const connectSocket = (socket) => {
    socket.on('disconnect', () => {
        console.log(`User disconnect socket-id is: ${socket.id}`);
    })
    console.log("New user connect socket-id is: ", socket.id)
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
