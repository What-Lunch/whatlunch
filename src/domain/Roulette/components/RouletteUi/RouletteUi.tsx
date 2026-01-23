'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';

import { getSocket, isSocketConnected } from '@/app/lib/socket';
import { useRouletteSync } from '../../hooks/useRouletteSync';
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
}

export default function RouletteUi({
  items,
  onStart,
  onResult,
  filters = {},
  userRole,
}: RouletteUiProps) {
  const [angle, setAngle] = useState(0);
  const [spinning, setSpinning] = useState(false);

  const params = useParams();
  const roomCode = (params.roomId as string) || 'solo';
  const isSoloMode = roomCode === 'solo';

  const rouletteRef = useRef<HTMLDivElement>(null);

  // 동기화 스핀 훅
  const { startSyncedSpin } = useRouletteSync({
    angle,
    setAngle,
    setSpinning,
    onResult,
    items,
  });

  // ============ WebSocket 이벤트 리스너 ============
  useEffect(() => {
    if (isSoloMode) return;

    const socket = getSocket();
    if (!socket) {
      console.log('[RouletteUi] Socket 없음');
      return;
    }

    const handleRouletteSpinStarted = ({
      rotation,
      duration,
      result,
    }: {
      rotation: number;
      duration: number;
      result: Menu.GetMenuRes;
    }) => {
      console.log('[RouletteUi] 회전 시작:', { rotation, duration, result: result.name });
      startSyncedSpin(rotation, duration, result);
    };

    socket.on('rouletteSpinStarted', handleRouletteSpinStarted);

    return () => {
      socket.off('rouletteSpinStarted', handleRouletteSpinStarted);
    };
  }, [isSoloMode, startSyncedSpin]);

  // ============ 룰렛 클릭 핸들러 ============
  const handleClick = useCallback(() => {
    if (spinning || items.length === 0) {
      console.log('[룰렛] 클릭 무시:', { spinning, itemsLength: items.length });
      return;
    }

    // 멀티 모드에서는 호스트만 클릭 가능
    if (!isSoloMode && userRole !== 'host') {
      console.log('[룰렛] 게스트는 룰렛을 돌릴 수 없습니다');
      return;
    }

    console.log('[룰렛] 클릭:', { isSoloMode, itemsLength: items.length, userRole });

    if (isSoloMode) {
      // 솔로 모드: 로컬 스핀
      console.log('[룰렛] 솔로 모드 회전 시작');
      onStart();

      const randomIndex = Math.floor(Math.random() * items.length);
      const baseRotation = 360 * (8 + Math.random() * 4); // 더 많이 회전 (8~12바퀴)
      const itemAngle = (360 / items.length) * randomIndex;
      const finalRotation = baseRotation + itemAngle;

      console.log('[룰렛] 회전 정보:', {
        randomIndex,
        finalRotation,
        item: items[randomIndex].name,
      });

      startSyncedSpin(finalRotation, 5000, items[randomIndex]); // 5초로 증가
    } else {
      // 멀티 모드: 서버에 요청
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
        console.log('[emit] 룰렛 시작 요청:', { roomCode, filters });
        onStart();
      }
    }
  }, [spinning, items, isSoloMode, onStart, startSyncedSpin, roomCode, filters, userRole]);

  // ============ 렌더링 ============
  if (!items || items.length === 0) {
    return (
      <div className={styles['roulette-ui']}>
        <div className={styles['roulette-wheel']}>
          <div className={styles['roulette-center']}>
            <p style={{ textAlign: 'center', color: '#999' }}>메뉴를 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  const colors = [
    '#FF6B6B',
    '#4ECDC4',
    '#45B7D1',
    '#FFA07A',
    '#98D8C8',
    '#F7DC6F',
    '#BB8FCE',
    '#85C1E2',
    '#F8B739',
    '#52B788',
    '#F06292',
    '#AED581',
  ];

  return (
    <div className={styles['roulette-ui']}>
      {/* 포인터 (상단 고정) */}
      <div className={styles['roulette-pointer']}>▼</div>

      {/* 룰렛 휠 */}
      <div
        ref={rouletteRef}
        className={styles['roulette-wheel']}
        style={{
          transform: `rotate(${angle}deg)`,
          transition: spinning ? 'transform 5s cubic-bezier(0.17, 0.67, 0.35, 0.95)' : 'none',
        }}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
          }
        }}
      >
        {/* SVG 원형 룰렛 */}
        <svg width="400" height="400" viewBox="0 0 400 400" style={{ transform: 'rotate(-90deg)' }}>
          {items.map((item, index) => {
            const startAngle = (360 / items.length) * index;
            const endAngle = (360 / items.length) * (index + 1);
            const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

            const startRad = (startAngle * Math.PI) / 180;
            const endRad = (endAngle * Math.PI) / 180;

            const x1 = 200 + 180 * Math.cos(startRad);
            const y1 = 200 + 180 * Math.sin(startRad);
            const x2 = 200 + 180 * Math.cos(endRad);
            const y2 = 200 + 180 * Math.sin(endRad);

            const pathData = `
              M 200 200
              L ${x1} ${y1}
              A 180 180 0 ${largeArcFlag} 1 ${x2} ${y2}
              Z
            `;

            return (
              <g key={item.id}>
                {/* 부채꼴 */}
                <path
                  d={pathData}
                  fill={colors[index % colors.length]}
                  stroke="#fff"
                  strokeWidth="2"
                />

                {/* 텍스트 */}
                <text
                  x="200"
                  y="200"
                  fill="#fff"
                  fontSize="14"
                  fontWeight="bold"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  transform={`
                    rotate(${startAngle + (endAngle - startAngle) / 2} 200 200)
                    translate(0 -120)
                  `}
                >
                  {item.name}
                </text>
              </g>
            );
          })}
        </svg>

        {/* 중앙 원 */}
        <div className={styles['roulette-center']}>{spinning ? '🎰' : '클릭!'}</div>
      </div>

      {/* 디버그 정보 */}
      <div style={{ marginTop: '20px', fontSize: '12px', color: '#999', textAlign: 'center' }}>
        항목: {items.length} | 회전: {spinning ? '진행중' : '대기'} | 각도: {Math.round(angle)}°
      </div>
    </div>
  );
}
