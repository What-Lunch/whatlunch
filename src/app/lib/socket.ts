import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const createSocket = (token: string): Socket | null => {
  if (socket?.connected) {
    return socket;
  }

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

    socket = io(apiUrl, {
      auth: {
        token,
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      forceNew: false,
    });

    socket.on('connect_error', error => {
      console.error('[Socket] 연결 오류:', error);
    });

    socket.on('joinError', (data: unknown) => {
      console.error('[Socket] joinError:', data);
    });

    return socket;
  } catch (error) {
    console.error('[Socket] 생성 오류:', error);
    return null;
  }
};

export const getSocket = (): Socket | null => socket;
export const disconnectSocket = (): void => {
  if (socket?.connected) {
    socket.disconnect();
    socket = null;
  }
};
export const isSocketConnected = (): boolean => socket?.connected ?? false;
