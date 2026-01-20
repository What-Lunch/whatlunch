import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;
let currentToken: string | null = null;

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL!;

export const createSocket = (token: string | null) => {
  if (!token) return null;
  if (socket && currentToken === token) return socket;
  if (socket) {
    socket.disconnect();
    socket = null;
  }

  currentToken = token;
  socket = io(SOCKET_URL, {
    autoConnect: false,
    auth: { token },
    transports: ['polling', 'websocket'],
    withCredentials: true,
  });

  return socket;
};

export const disconnectSocket = () => {
  socket?.disconnect();
  socket = null;
  currentToken = null;
};
