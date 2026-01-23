import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const createSocket = (token: string): Socket | null => {
  if (socket?.connected) {
    console.log('[Socket] 이미 연결됨');
    return socket;
  }

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

    console.log('[Socket] 연결 시작:', {
      url: apiUrl,
      token: token.substring(0, 20) + '...',
    });

    socket = io(apiUrl, {
      auth: {
        token, // ✅ 토큰 전송
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      forceNew: false,
    });

    // ============ 연결 이벤트 ============
    socket.on('connect', () => {
      console.log('[Socket] ✅ 연결 성공:', socket?.id);
    });

    socket.on('connected', data => {
      console.log('[Socket] 🔗 서버 연결 확인:', data);
    });

    socket.on('connect_error', (error: any) => {
      console.error('[Socket] ❌ 연결 오류:', {
        message: error.message,
        data: error.data,
      });
    });

    socket.on('joinError', (data: any) => {
      console.error('[Socket] ❌ 방 입장 오류:', data);
    });

    socket.on('disconnect', (reason: string) => {
      console.log('[Socket] 🔌 연결 해제:', reason);
    });

    return socket;
  } catch (error) {
    console.error('[Socket] 생성 실패:', error);
    return null;
  }
};

export const getSocket = (): Socket | null => socket;
export const disconnectSocket = (): void => {
  if (socket?.connected) {
    socket.disconnect();
    socket = null;
    console.log('[Socket] ✅ 연결 완전 해제');
  }
};
export const isSocketConnected = (): boolean => socket?.connected ?? false;
