import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

const getSocketUrl = (): string => {
  const url = process.env.NEXT_PUBLIC_SOCKET_URL;
  if (!url) {
    throw new Error('[Socket] NEXT_PUBLIC_SOCKET_URL is not defined.');
  }
  return url;
};

export const createSocket = (): Socket | null => {
  if (socket?.connected) {
    return socket;
  }

  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }

  try {
    const apiUrl = getSocketUrl();
    const rawToken =
      typeof document !== 'undefined'
        ? document.cookie
            .split('; ')
            .find(row => row.startsWith('accessToken='))
            ?.split('=')
            .slice(1)
            .join('=')
        : undefined;

    const cookies = document.cookie.split('; ');
    console.log(cookies);
    console.log('[Socket] rawToken:', rawToken ? rawToken.substring(0, 10) + '...' : 'none');
    const accessToken = rawToken ? decodeURIComponent(rawToken) : undefined;
    console.log(
      '[Socket] accessToken:',
      accessToken ? accessToken.substring(0, 10) + '...' : 'none'
    );
    const socketOptions: Parameters<typeof io>[1] = {
      path: '/socket.io',
      transports: ['websocket', 'polling'],
      withCredentials: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      auth: {
        token: accessToken,
      },
    };

    if (accessToken) {
      socketOptions.auth = { token: accessToken };
    }

    socket = io(apiUrl, socketOptions);

    socket.on('connect_error', error => {
      console.error('[Socket] 연결 오류:', error);
    });

    socket.on('joinError', (data: unknown) => {
      console.error('[Socket] joinError:', data);
    });

    return socket;
  } catch (error) {
    console.error('[Socket] Socket 생성 오류:', error);
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
