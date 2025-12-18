'use client';

import { useRef, useState, useEffect } from 'react';

import { useSectorColors } from '@/domain/Roulette/hooks/useSectorColors';
import { useRouletteDraw } from '@/domain/Roulette/hooks/useRouletteDraw';
import { useRouletteSpin } from '@/domain/Roulette/hooks/useRouletteSpin';

import { RouletteUiProps } from './types';

import styles from './RouletteUi.module.scss';

export default function RouletteUi({ items, onResult, onStart, size = 480 }: RouletteUiProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasContextRef = useRef<CanvasRenderingContext2D | null>(null);

  const [angle, setAngle] = useState(0);
  const [spinning, setSpinning] = useState(false);

  // 색상 팔레트 생성
  const sectorColors = useSectorColors(items);

  // draw 함수 메모이제이션
  const draw = useRouletteDraw(items, size, sectorColors);

  // 스핀 핸들러
  const spin = useRouletteSpin({
    items,
    angle,
    setAngle,
    spinning,
    setSpinning,
    onResult,
    onStart,
  });

  // 캔버스 context 초기화 (최초 1회)
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvasContext = canvasRef.current.getContext('2d');
    if (!canvasContext) return;

    canvasContextRef.current = canvasContext;
  }, []);

  // angle 변경 시 룰렛 다시 그리기
  useEffect(() => {
    const canvasContext = canvasContextRef.current;
    if (!canvasContext) return;

    draw(canvasContext, angle);
  }, [angle, draw]);

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
        onClick={spin}
        role="button"
        tabIndex={0} // 키보드 포커스 가능
        aria-label="룰렛을 돌리려면 클릭하세요"
        onKeyDown={e => {
          // Enter 키로만 스핀 실행
          if (!spinning && e.key === 'Enter') {
            e.preventDefault();
            spin();
          }
        }}
      />
    </div>
  );
}
