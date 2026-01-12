'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export type RoomEntryStep = 'select' | 'join';

const STORAGE_KEY = 'rooms';
// 6자리 랜덤 방 코드 생성 (A-Z, 0-9)
const generateRoomCode = () => Math.random().toString(36).slice(2, 8).toUpperCase();

export function useRoomEntry() {
  const router = useRouter();

  const [step, setStep] = useState<RoomEntryStep>('select');
  const [roomCodeRaw, setRoomCodeRaw] = useState('');
  const [error, setError] = useState('');
  const [isJoining, setIsJoining] = useState(false); // 방 입장 중 상태
  const [isCreating, setIsCreating] = useState(false); // 방 생성 중 상태

  const createRoom = async () => {
    try {
      setIsCreating(true);
      // UX용 딜레이 (실제 API 연동 시 제거 예정)
      await new Promise(res => setTimeout(res, 300));

      const roomId = generateRoomCode();
      const rooms: string[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

      const nextRooms = rooms.includes(roomId) ? rooms : [...rooms, roomId];

      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextRooms));
      router.push(`/rooms/${roomId}`);
    } finally {
      setIsCreating(false);
      setStep('select');
    }
  };

  const changeRoomCode = (value: string) => {
    setRoomCodeRaw(value);
    if (error) setError('');
  };

  useEffect(() => {
    // 입력값을 대문자 + 숫자로 정규화하고 6자리로 제한
    const parsedCode = roomCodeRaw
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .slice(0, 6);

    if (parsedCode.length !== 6) return;

    const joinRoom = async () => {
      setIsJoining(true);

      const rooms: string[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

      if (!rooms.includes(parsedCode)) {
        setError('존재하지 않는 방 코드예요.');
        setIsJoining(false);
        return;
      }

      await new Promise(res => setTimeout(res, 300));
      router.push(`/rooms/${parsedCode}`);
    };

    joinRoom();
  }, [roomCodeRaw, router]);

  const resetJoin = () => {
    setRoomCodeRaw('');
    setError('');
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
    resetJoin,
  };
}
