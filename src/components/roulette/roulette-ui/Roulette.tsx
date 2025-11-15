'use client';

import React, { useEffect, useRef, useState } from 'react';
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
  const generateColor = (i: number) => {
    const hue = (360 / items.length) * i;
    return `hsl(${hue}, 85%, 75%)`;
  };

  /** 룰렛 그리기 */
  const draw = (ctx: CanvasRenderingContext2D, baseAngle: number) => {
    ctx.clearRect(0, 0, size, size);

    const step = (2 * Math.PI) / items.length;

    items.forEach((item, i) => {
      const start = baseAngle + step * i;
      const end = baseAngle + step * (i + 1);

      // 섹터 색
      ctx.beginPath();
      ctx.moveTo(radius, radius);
      ctx.fillStyle = generateColor(i);
      ctx.arc(radius, radius, radius - 4, start, end);
      ctx.fill();

      // 텍스트
      ctx.save();
      ctx.translate(radius, radius);

      // 섹터 중앙 방향으로 회전
      ctx.rotate(start + step / 2);

      ctx.fillStyle = '#000';
      ctx.font = '18px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // 텍스트를 안쪽 방향으로 회전
      ctx.rotate(Math.PI);

      // 텍스트 배치
      ctx.fillText(item, -radius * 0.5, 0);

      ctx.restore();
    });

    /** 상단 포인터 추가 (이게 빠져서 사라졌던 것임) */
    ctx.save();
    ctx.translate(radius, radius);

    // 원형 포인터
    ctx.beginPath();
    ctx.fillStyle = '#ff3b3b';
    ctx.arc(0, -radius + 30, 18, 0, Math.PI * 2); // (x,y,radius)
    ctx.fill();

    ctx.restore();

    ctx.restore();
  };

  /** 룰렛 회전 */
  const spin = () => {
    if (spinning || items.length === 0) return;

    setSpinning(true);

    let currentAngle = angle;
    let velocity = 0;
    const maxVelocity = 1.1; // 최고 속도
    const acceleration = 0.06; // 가속도
    const friction = 0.985; // 감속 비율

    let phase: 'accel' | 'decel' = 'accel';

    const interval = setInterval(() => {
      // 가속 단계
      if (phase === 'accel') {
        velocity += acceleration;
        if (velocity >= maxVelocity) {
          phase = 'decel';
        }
      }

      // 감속 단계
      if (phase === 'decel') {
        velocity *= friction;

        // 멈출 지점
        if (velocity < 0.002) {
          clearInterval(interval);
          setSpinning(false);

          const step = (2 * Math.PI) / items.length;

          let normalized = ((currentAngle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);

          // pointer가 12시 방향이므로 PI/2 보정
          normalized = (normalized + Math.PI / 2) % (2 * Math.PI);

          // canvas 기준 맞추기 위해 뒤집기
          const reversed = (2 * Math.PI - normalized) % (2 * Math.PI);

          const index = Math.floor(reversed / step);

          onResult?.(items[index]);
          return;
        }
      }

      currentAngle += velocity;
      setAngle(currentAngle);
    }, 16); // 60fps
  };

  /** 캔버스 업데이트 */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    draw(ctx, angle);
  }, [angle, items]);

  return (
    <div className={styles.container}>
      <canvas ref={canvasRef} width={size} height={size} />
      <button onClick={spin} disabled={spinning}>
        {spinning ? '돌리는 중...' : '돌리기'}
      </button>
    </div>
  );
}
