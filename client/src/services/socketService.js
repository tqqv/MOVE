import socket from '@/utils/socket';

// JOIN ROOM
const joinRoom = (channelId) => {
  console.log('join ' + channelId);

  socket.emit('joinRoom', channelId);
};

// CHECK STREAM ALREADY FROM SERVER
const listenStreamReady = (callback) => {
  socket.on('streamReady', (arg) => {
    console.log('Received streamReady event with arg:', arg);
    callback(arg);
  });
};

export { joinRoom, listenStreamReady };
