'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';

const STORAGE_KEY = 'rooms';
const ROOM_CODE_REGEX = /^[A-Z0-9]{6}$/;

function parseRoomList(raw: string | null): string[] {
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (item): item is string => typeof item === 'string' && ROOM_CODE_REGEX.test(item)
    );
  } catch {
    return [];
  }
}

export function useRoomLogic(roomId: string) {
  const router = useRouter();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isSoloMode = roomId === 'solo';

  const [isValidRoom, setIsValidRoom] = useState<boolean | null>(isSoloMode ? true : null);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);

  // 방 유효성 검사
  useEffect(() => {
    if (isSoloMode) return;

    const rooms = parseRoomList(localStorage.getItem(STORAGE_KEY));
    const valid = rooms.includes(roomId);

    setIsValidRoom(valid);

    if (!valid) {
      router.replace('/');
    }
  }, [roomId, isSoloMode, router]);

  // 방 코드 복사
  const copyRoomCode = useCallback(async () => {
    setCopyError(false);

    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error('Clipboard API not supported');
      }

      await navigator.clipboard.writeText(roomId);
      setCopied(true);
    } catch {
      try {
        const textarea = document.createElement('textarea');
        textarea.value = roomId;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';

        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);

        setCopied(true);
      } catch {
        setCopyError(true);
        return;
      }
    }

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      setCopied(false);
      setCopyError(false);
    }, 1500);
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
