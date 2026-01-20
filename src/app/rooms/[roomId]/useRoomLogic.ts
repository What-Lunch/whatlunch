'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';

const ROOM_CODE_REGEX = /^[A-Z0-9]{6}$/;
const COPY_FEEDBACK_DURATION = 1000;

export function useRoomLogic(roomId: string) {
  const router = useRouter();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isSoloMode = roomId === 'solo';
  const [isValidRoom, setIsValidRoom] = useState<boolean | null>(isSoloMode ? true : null);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);

  useEffect(() => {
    if (isSoloMode) {
      setIsValidRoom(true);
      return;
    }
    // 형식 검증
    if (!ROOM_CODE_REGEX.test(roomId)) {
      router.replace('/');
      return;
    }
    setIsValidRoom(true);
  }, [roomId, isSoloMode, router]);

  // 방 코드 복사
  const copyRoomCode = useCallback(async () => {
    setCopyError(false);

    try {
      await navigator.clipboard.writeText(roomId);
      setCopied(true);
    } catch {
      setCopyError(true);
      return;
    }

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      setCopied(false);
      setCopyError(false);
    }, COPY_FEEDBACK_DURATION);
  }, [roomId]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return {
    isSoloMode,
    isValidRoom,
    copied,
    copyError,
    copyRoomCode,
  };
}
