import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_SOCKET_API_URL);

socket.on('connect', () => {
  console.log('Connected to server with ID:', socket.id);
});

export default socket;
