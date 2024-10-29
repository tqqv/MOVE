import livestreamSocket from '@/utils/socket';

// LIVESTREAM SOCKET EVENTS
const joinRoom = (channelId) => {
  console.log('Joining room:', channelId);
  if (!livestreamSocket.connected) {
    livestreamSocket.connect();
  }
  livestreamSocket.emit('joinRoom', channelId);
};

const listenStreamReady = (callback) => {
  livestreamSocket.off('streamReady');
  livestreamSocket.on('streamReady', (arg) => {
    console.log('Received streamReady event with arg:', arg);
    callback(arg);
  });
};

const disconnectLivestream = () => {
  if (livestreamSocket.connected) {
    livestreamSocket.disconnect();
  }
};

export { joinRoom, listenStreamReady, disconnectLivestream };
