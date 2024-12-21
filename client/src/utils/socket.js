import { io } from 'socket.io-client';

const livestreamSocket = io(import.meta.env.VITE_SOCKET_API_URL, {
  autoConnect: false, // Chỉ kết nối khi cần
  reconnection: true,
});

livestreamSocket.on('connect', () => {
  console.log('Livestream socket connected with ID:', livestreamSocket.id);
});

export default livestreamSocket;
