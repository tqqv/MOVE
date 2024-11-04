const intervals = {};   // Lưu trữ các bộ đếm setInterval cho mỗi channelId

const { get } = require("../utils/redis/base/redisBaseService");
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

// Xử lý khi một client tham gia vào channel
const onClientJoinChannel = async (socket, channelId) => {
    let currentView = await get(`channelStreamId:${channelId}:currentViews`);
    // Nếu đây là client đầu tiên, khởi tạo setInterval
    if (currentView == 1) {
        intervals[channelId] = setInterval(() => broadcastStreamStats(channelId), 30000);
    }
    socket.join(channelId);
};

// Xử lý khi một client rời khỏi channel
const onClientLeaveChannel = async (socket, channelId) => {
    let currentView = await get(`channelStreamId:${channelId}:currentViews`);
    // Nếu không còn client nào, dừng setInterval
    if (currentView == 0 && intervals[channelId]) {
        clearInterval(intervals[channelId]);
        delete intervals[channelId];
    }
};


const broadcastStreamStats = async (channelId) => {
    try {
        const data = await getStreamStats(channelId); // Hàm lấy số liệu từ Redis
        console.log(`stream metric channel: ${channelId} ` , data);
        _io.to(`${channelId}`).emit('streamMetrics', data);
    } catch (error) {
        console.log(`Error broadcasting stream stats for ${channelId}:`, error);
      }
};

const connectSocket = (socket) => {
    socket.on('disconnecting', () => {
        const rooms = Array.from(socket.rooms);
        let validRoom = filterRoomsForDeletion(rooms);

        validRoom.forEach(async (key) => {
            const parts = key.split(':');
            const [, channelId, fields] = parts;
            await updateStreamStats(channelId, 'decrement', fields, 1)
            await onClientLeaveChannel(socket, channelId);
        })
    });
    socket.on('disconnect', async () => {
        getNumOfConnectInAllRooms();
    })
    getNumOfConnectInAllRooms();
    // Gửi tin nhắn
    _io.emit('receiveMessage', 'Welcome to the socket!');
    // Thông báo cho admin rằng user đã join vào room
    socket.on('joinRoom', async (channelId) => {
        await updateStreamStats(channelId, 'increment', 'currentViews', 1)
        await updateStreamStats(channelId, 'increment', 'totalViews', 1)
        await updateStreamStats(channelId, 'increment', 'totalReps', 1000)
        // socket.join(channelId);
        await onClientJoinChannel(socket, channelId);
    })
}

module.exports = {
    connectSocket,
    getNumOfConnectInRoom
}
