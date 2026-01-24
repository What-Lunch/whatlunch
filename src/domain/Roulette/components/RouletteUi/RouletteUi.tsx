'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';

import { getSocket, isSocketConnected } from '@/app/lib/socket';
import { useRouletteSync } from '../../hooks/useRouletteSync';
import { useSectorColors } from '@/domain/Roulette/hooks/useSectorColors';
import { useRouletteDraw } from '@/domain/Roulette/hooks/useRouletteDraw';
import { useRouletteSpin } from '@/domain/Roulette/hooks/useRouletteSpin';
import { Category, Context } from '@/types/enum';

import styles from './RouletteUi.module.scss';

interface RouletteUiProps {
  items: Menu.GetMenuRes[];
  onStart: () => void;
  onResult: (item: Menu.GetMenuRes) => void;
  filters?: {
    category?: Category[];
    context?: Context[];
  };
  userRole?: 'host' | 'guest' | null;
  size?: number;
}

export default function RouletteUi({
  items,
  onStart,
  onResult,
  filters = {},
  userRole,
  size = 480,
}: RouletteUiProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  const [angle, setAngle] = useState(0);
  const [spinning, setSpinning] = useState(false);

  const params = useParams();
  const roomCode = (params.roomId as string) || 'solo';
  const isSoloMode = roomCode === 'solo';

  /** 색상 */
  const sectorColors = useSectorColors(items);

  /** draw 함수 */
  const draw = useRouletteDraw(items, size, sectorColors);

  /** 동기화 스핀 훅 */
  const { startSyncedSpin } = useRouletteSync({
    angle,
    setAngle,
    setSpinning,
    onResult,
    items,
  });

  /** 서버에서 스핀 시작 수신 */
  useEffect(() => {
    if (isSoloMode) return;

    const socket = getSocket();
    if (!socket) return;

    const handleRouletteSpinStarted = ({
      rotation,
      duration,
      result,
    }: {
      rotation: number;
      duration: number;
      result: Menu.GetMenuRes;
    }) => {
      startSyncedSpin(rotation, duration, result);
    };

    socket.on('rouletteSpinStarted', handleRouletteSpinStarted);

    return () => {
      socket.off('rouletteSpinStarted', handleRouletteSpinStarted);
    };
  }, [isSoloMode, startSyncedSpin]);

  /** canvas context 초기화 */
  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    ctxRef.current = ctx;
  }, []);

  /** angle 변경 시 다시 그림 */
  useEffect(() => {
    if (!ctxRef.current) return;
    draw(ctxRef.current, angle);
  }, [angle, draw]);

  /** 클릭 핸들러 (host만 가능) */
  const handleSpin = useCallback(() => {
    if (spinning || items.length === 0) return;

    if (!isSoloMode && userRole !== 'host') return;

    if (isSoloMode) {
      onStart();

      const randomIndex = Math.floor(Math.random() * items.length);
      const baseRotation = 360 * (8 + Math.random() * 4);
      const itemAngle = (360 / items.length) * randomIndex;
      const finalRotation = baseRotation + itemAngle;

      startSyncedSpin(finalRotation, 5000, items[randomIndex]);
    } else {
      if (!isSocketConnected()) {
        console.warn('[룰렛] Socket 미연결');
        return;
      }

      const socket = getSocket();
      if (socket) {
        socket.emit('spinRoulette', {
          roomCode,
          filters: {
            category: filters.category,
            context: filters.context,
          },
        });
        onStart();
      }
    }
  }, [spinning, items, isSoloMode, userRole, onStart, startSyncedSpin, roomCode, filters]);

  const canvasClass = spinning
    ? `${styles['roulette-ui__canvas']} ${styles['roulette-ui__canvas--spinning']}`
    : styles['roulette-ui__canvas'];

  return (
    <div className={styles['roulette-ui']}>
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        className={canvasClass}
        onClick={handleSpin}
        role="button"
        tabIndex={0}
        aria-label="룰렛을 돌리려면 클릭하세요"
        onKeyDown={e => {
          if (!spinning && e.key === 'Enter') {
            e.preventDefault();
            handleSpin();
          }
        }}
      />
    </div>
  );
}
