import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

const getSocketUrl = (): string => {
  const url = process.env.NEXT_PUBLIC_SOCKET_URL;
  if (!url) {
    throw new Error('[Socket] NEXT_PUBLIC_SOCKET_URL is not defined.');
  }
  return url;
};

function getTokenFromCookies(): string | null {
  if (typeof document === 'undefined') {
    return null;
  }
  const match = document.cookie.match(/accessToken=([^;]+)/);
  return match ? match[1] : null;
}

export const createSocket = (): Socket | null => {
  if (socket?.connected) {
    return socket;
  }

  try {
    const token = getTokenFromCookies();

    if (!token) {
      console.error('[Socket] 액세스 토큰이 없습니다.');
      return null;
    }

    const apiUrl = getSocketUrl();
    socket = io(apiUrl, {
      auth: {
        token,
      },
      path: '/socket.io',
      transports: ['websocket'],
      withCredentials: true,
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
