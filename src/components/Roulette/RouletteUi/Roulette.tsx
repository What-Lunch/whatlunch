'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import styles from './Roulette.module.scss';

interface RouletteProps {
  items: string[];
  onResult?: (item: string) => void;
  size?: number;
}

export default function Roulette({ items, onResult, size = 480 }: RouletteProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [angle, setAngle] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const radius = size / 2;

  /** 색상 생성 */
  const generatePalette = (count: number) => {
    if (count === 0) return [];

    const palette = [];
    for (let i = 0; i < count; i++) {
      const hue = (360 / count) * i + Math.random() * 12;
      const saturation = 65 + Math.random() * 10;
      const lightness = 70 + Math.random() * 10;

      palette.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
    }
    return palette;
  };

  const sectorColors = useRef<string[]>([]);

  /** items 변경 시 팔레트 생성 */
  useEffect(() => {
    sectorColors.current = generatePalette(items.length);
  }, [items]);

  /** 룰렛 그리기 - useCallback으로 안정화 */
  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, baseAngle: number) => {
      ctx.clearRect(0, 0, size, size);

      /* 1개 항목 */
      if (items.length === 1) {
        const color = sectorColors.current[0];

        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.arc(radius, radius, radius - 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.save();
        ctx.translate(radius, radius);
        ctx.fillStyle = '#333';
        ctx.font = 'bold 28px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(items[0], 0, 0);
        ctx.restore();
        return;
      }

      /* 2개 이상 */
      const step = (2 * Math.PI) / items.length;

      items.forEach((item, i) => {
        const start = baseAngle + step * i;
        const end = baseAngle + step * (i + 1);

        ctx.beginPath();
        ctx.moveTo(radius, radius);
        ctx.fillStyle = sectorColors.current[i];
        ctx.arc(radius, radius, radius - 4, start, end);
        ctx.fill();

        // 경계선
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'rgba(0,0,0,0.18)';
        ctx.stroke();

        // 텍스트
        ctx.save();
        ctx.translate(radius, radius);
        ctx.rotate(start + step / 2);
        ctx.fillStyle = '#333';
        ctx.font = 'bold 20px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.rotate(Math.PI);
        ctx.fillText(item, -radius * 0.45, 0);
        ctx.restore();
      });

      /** 포인터 */
      ctx.save();
      ctx.translate(radius, radius);

      const px = 0;
      const py = -radius + 30;
      const innerR = 18;
      const outerR = 22;

      ctx.beginPath();
      ctx.arc(px, py, outerR + 2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0,0,0,0.25)';
      ctx.filter = 'blur(4px)';
      ctx.fill();

      ctx.filter = 'none';
      ctx.beginPath();
      ctx.arc(px, py, outerR, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(px, py, innerR, 0, Math.PI * 2);
      ctx.fillStyle = '#ff2b2b';
      ctx.fill();

      ctx.restore();
    },
    [items, radius, size]
  );

  /** 룰렛 회전 */
  const spin = () => {
    if (spinning || items.length === 0) return;
    setSpinning(true);

    if (items.length === 1) {
      setTimeout(() => {
        setSpinning(false);
        onResult?.(items[0]);
      }, 400);
      return;
    }

    let currentAngle = angle;
    let velocity = 0;
    const maxVelocity = 1.1;
    const acceleration = 0.06;
    const friction = 0.985;
    let phase: 'accel' | 'decel' = 'accel';

    const interval = setInterval(() => {
      if (phase === 'accel') {
        velocity += acceleration;
        if (velocity >= maxVelocity) phase = 'decel';
      } else {
        velocity *= friction;

        if (velocity < 0.002) {
          clearInterval(interval);
          setSpinning(false);

          const step = (2 * Math.PI) / items.length;
          let normal = ((currentAngle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
          normal = (normal + Math.PI / 2) % (2 * Math.PI);
          const reversed = (2 * Math.PI - normal) % (2 * Math.PI);
          const index = Math.floor(reversed / step);

          onResult?.(items[index]);
          return;
        }
      }

      currentAngle += velocity;
      setAngle(currentAngle);
    }, 16);
  };

  /** Canvas 업데이트 */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    draw(ctx, angle);
  }, [angle, items, draw]);

  return (
    <div className={styles['container']}>
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        className={
          spinning
            ? `${styles['container__canvas']} ${styles['container__canvas--spinning']}`
            : styles['container__canvas']
        }
      />

      <button onClick={spin} disabled={spinning} className={styles['container__button']}>
        {spinning ? '돌리는 중...' : '돌리기'}
      </button>
    </div>
  );
}
