import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;
let currentToken: string | null = null;

const getSocketUrl = (): string => {
  const url = process.env.NEXT_PUBLIC_SOCKET_URL;
  if (!url) {
    throw new Error(
      '[Socket] NEXT_PUBLIC_SOCKET_URL is not defined. ' + 'Check your environment variables.'
    );
  }
  return url;
};

export const createSocket = (token: string): Socket => {
  const SOCKET_URL = getSocketUrl();

  if (socket && currentToken === token) {
    return socket;
  }

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
