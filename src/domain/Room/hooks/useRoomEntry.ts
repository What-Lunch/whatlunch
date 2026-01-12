'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export type RoomEntryStep = 'select' | 'join';

const STORAGE_KEY = 'rooms';
const ROOM_CODE_LENGTH = 6;
const CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

const generateRoomCode = () => {
  let code = '';

  for (let i = 0; i < ROOM_CODE_LENGTH; i++) {
    const randomIndex = Math.floor(Math.random() * CHARSET.length);
    code += CHARSET[randomIndex];
  }

  return code;
};

// 고유한 방 코드 생성
const generateUniqueRoomCode = (existingRooms: string[]) => {
  let roomId = generateRoomCode();

  while (existingRooms.includes(roomId)) {
    roomId = generateRoomCode();
  }

  return roomId;
};

export function useRoomEntry() {
  const router = useRouter();

  const [step, setStep] = useState<RoomEntryStep>('select');
  const [roomCodeRaw, setRoomCodeRaw] = useState('');
  const [error, setError] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const createRoom = async () => {
    if (isCreating) return;

    setIsCreating(true);

    try {
      // UX용 딜레이
      await new Promise(res => setTimeout(res, 300));

      const rooms: string[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

      const roomId = generateUniqueRoomCode(rooms);

      localStorage.setItem(STORAGE_KEY, JSON.stringify([...rooms, roomId]));

      router.push(`/rooms/${roomId}`);
    } finally {
      setIsCreating(false);
      setStep('select');
    }
  };
  // 방 코드 변경
  const changeRoomCode = (value: string) => {
    const parsed = value
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .slice(0, ROOM_CODE_LENGTH);

    setRoomCodeRaw(parsed);

    if (error) setError('');
  };

  // 방 입장
  const joinRoom = async () => {
    if (roomCodeRaw.length !== ROOM_CODE_LENGTH) {
      setError('방 코드를 6자리로 입력해 주세요.');
      return;
    }

    if (isJoining) return;

    setIsJoining(true);
    setError('');

    try {
      const rooms: string[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

      if (!rooms.includes(roomCodeRaw)) {
        setError('존재하지 않는 방 코드예요.');
        return;
      }

      await new Promise(res => setTimeout(res, 300));
      router.push(`/rooms/${roomCodeRaw}`);
    } finally {
      setIsJoining(false);
    }
  };

  // 입장 상태 초기화
  const resetJoin = () => {
    setRoomCodeRaw('');
    setError('');
    setIsJoining(false);
    setStep('select');
  };

  return {
    step,
    setStep,
    roomCodeRaw,
    error,
    isJoining,
    isCreating,
    createRoom,
    changeRoomCode,
    joinRoom,
    resetJoin,
  };
}
