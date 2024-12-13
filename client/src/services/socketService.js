import livestreamSocket from '@/utils/socket';
import { getAllRoomNotifications } from './notification';
import { useNotificationStore } from '@/stores';

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
    const roomsResponse = await getAllRoomNotifications();
    const notificationStore = useNotificationStore();
    if (roomsResponse.error) {
      console.error('Error fetching room notifications:', roomsResponse.message);
      return;
    }

    const rooms = roomsResponse.data.data;

    if (!livestreamSocket.connected) {
      livestreamSocket.connect();
    }

    rooms.forEach((room) => {
      livestreamSocket.emit('joinRoom', room);
    });

    livestreamSocket.on('notifications', (notification) => {
      notificationStore.addNotification(notification);
    });
  } catch (error) {
    console.error('Error in joinAllRooms:', error);
  }
};

const disconnectAllRooms = async () => {
  try {
    const roomsResponse = await getAllRoomNotifications();
    if (roomsResponse.error) {
      console.error('Error fetching room notifications for disconnect:', roomsResponse.message);
      return;
    }

    const rooms = roomsResponse.data.data;

    // Leave từng room
    rooms.forEach((room) => {
      livestreamSocket.emit('leaveRoom', room);
    });

    // Ngắt kết nối nếu cần
    if (livestreamSocket.connected) {
      livestreamSocket.disconnect();
    }

    console.log('Disconnected from all rooms and socket closed.');
  } catch (error) {
    console.error('Error in disconnectAllRooms:', error);
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
  joinAllRooms,
  disconnectAllRooms,
};
