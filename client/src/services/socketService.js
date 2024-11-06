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
  livestreamSocket.off('socketLiveStatus');
  livestreamSocket.on('socketLiveStatus', (arg) => {
    console.log('Received socketLiveStatus  event with arg:', arg);
    callback(arg);
  });
};

const disconnectLivestream = () => {
  if (livestreamSocket.connected) {
    livestreamSocket.emit('disconnecting');
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

export { joinRoom, listenStreamReady, disconnectLivestream, listenStreamMetrics };
