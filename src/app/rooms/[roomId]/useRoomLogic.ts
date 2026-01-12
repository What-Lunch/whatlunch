'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';

const STORAGE_KEY = 'rooms';

export function useRoomLogic(roomId: string) {
  const router = useRouter();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isSoloMode = roomId === 'solo';

  const [isValidRoom, setIsValidRoom] = useState<boolean | null>(isSoloMode ? true : null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isSoloMode) return;
    //  방 존재 여부
    const validateRoom = () => {
      const raw = localStorage.getItem(STORAGE_KEY);
      const rooms: string[] = raw ? JSON.parse(raw) : [];

      return rooms.includes(roomId);
    };

    try {
      const valid = validateRoom();
      setIsValidRoom(valid);

      if (!valid) {
        router.replace('/');
      }
    } catch {
      router.replace('/');
    }
  }, [roomId, isSoloMode, router]);

  const copyRoomCode = useCallback(async () => {
    await navigator.clipboard.writeText(roomId);
    setCopied(true);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setCopied(false);
    }, 1500);
  }, [roomId]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    isSoloMode,
    isValidRoom,
    copied,
    copyRoomCode,
  };
}
