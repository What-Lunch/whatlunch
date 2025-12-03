'use client';

import { useRef, useState, useEffect } from 'react';

import { RouletteUiProps } from './type';

import { useSectorColors } from '../../hooks/useSectorColors';
import { useRouletteDraw } from '../../hooks/useRouletteDraw';
import { useRouletteSpin } from '../../hooks/useRouletteSpin';

import styles from './RouletteUi.module.scss';

export default function RouletteUi({ items, onResult, onStart, size = 480 }: RouletteUiProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [angle, setAngle] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const radius = size / 2;

  const sectorColors = useSectorColors(items);
  const draw = useRouletteDraw(items, size, radius, sectorColors);

  const spin = useRouletteSpin({
    items,
    angle,
    setAngle,
    spinning,
    setSpinning,
    onResult,
    onStart,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    draw(ctx, angle);
  }, [angle, items, draw]);

  return (
    <div className={styles.container}>
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        role="img"
        onClick={spin}
        className={
          spinning
            ? `${styles.container__canvas} ${styles['container__canvas--spinning']}`
            : styles.container__canvas
        }
      />
    </div>
  );
}
