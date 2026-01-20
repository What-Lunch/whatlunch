'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export type RoomEntryStep = 'select' | 'join';

const ROOM_CODE_LENGTH = 6;
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export function useRoomEntry() {
  const router = useRouter();

  const [step, setStep] = useState<RoomEntryStep>('select');
  const [roomCodeRaw, setRoomCodeRaw] = useState('');
  const [error, setError] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // 방 생성
  const createRoom = async () => {
    if (isCreating) return;
    setIsCreating(true);
    setError('');

    try {
      const res = await fetch(`${API_BASE_URL}/rooms`, {
        method: 'POST',
        credentials: 'include',
      });

      if (!res.ok) {
        setError('방 생성에 실패했어요.');
        return;
      }

      const { roomCode } = await res.json();
      router.push(`/rooms/${roomCode}`);
    } catch {
      setError('서버에 연결할 수 없어요.');
    } finally {
      setIsCreating(false);
      setStep('select');
    }
  };

  // 방 코드 입력
  const changeRoomCode = (value: string) => {
    const parsed = value
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .slice(0, ROOM_CODE_LENGTH);

    setRoomCodeRaw(parsed);
    if (error) setError('');
  };

  // 방 입장
  const joinRoom = () => {
    if (roomCodeRaw.length !== ROOM_CODE_LENGTH) {
      setError('방 코드를 6자리로 입력해 주세요.');
      return;
    }

    if (isJoining) return;
    setIsJoining(true);
    setError('');

    router.push(`/rooms/${roomCodeRaw}`);
    setIsJoining(false);
  };

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
