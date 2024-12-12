import livestreamSocket from '@/utils/socket';

// LIVESTREAM SOCKET EVENTS
const joinRoom = (channelId) => {
  // console.log('Joining room:', channelId);
  if (!livestreamSocket.connected) {
    livestreamSocket.connect();
  }
  livestreamSocket.emit('joinRoom', channelId);
};

const listenStreamReady = (callback) => {
  livestreamSocket.off('socketLiveStatus');
  livestreamSocket.on('socketLiveStatus', (arg) => {
    // console.log('Received socketLiveStatus  event with arg:', arg);
    callback(arg);
  });
};

const disconnectLivestream = () => {
  if (livestreamSocket.connected) {
    livestreamSocket.on('disconnecting');
    livestreamSocket.disconnect();
  }
};

const listenStreamMetrics = (callback) => {
  livestreamSocket.off('streamMetrics');
  livestreamSocket.on('streamMetrics', (arg) => {
    // console.log('Received streamMetrics event with arg:', arg);
    if (callback) {
      callback(arg);
    }
  });
};

const listenChatHistory = (callback) => {
  livestreamSocket.off('message_history');
  livestreamSocket.on('message_history', (messageHistory) => {
    // console.log('Received chat message history:', messageHistory);
    if (callback) {
      callback(messageHistory);
    }
  });
};

const listenNewMessage = (callback) => {
  livestreamSocket.on('newMessage', (newMessage) => {
    // console.log('Received new message:', newMessage);
    if (callback) {
      callback(newMessage);
    }
  });
};
const sendMessage = (channelId, messageData) => {
  livestreamSocket.emit('chatMessage', {
    channelId,
    ...messageData,
  });
};

const joinAllRooms = async () => {
  try {
    const response = await getAllRoomNotifications();
    if (response.error) {
      console.error('Error fetching room notifications:', response.message);
      return;
    }

    const rooms = response.data;
    rooms.forEach((room) => {
      joinRoom(room);
    });

    console.log('Joined all rooms:', rooms);
  } catch (error) {
    console.error('An unexpected error occurred:', error);
  }
};

export {
  joinRoom,
  listenStreamReady,
  disconnectLivestream,
  listenStreamMetrics,
  listenChatHistory,
  listenNewMessage,
  sendMessage,
};
