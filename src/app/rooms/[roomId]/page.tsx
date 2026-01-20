'use client';

import { useEffect, useRef } from 'react';
import { Copy, Check, Clock, Users } from 'lucide-react';
import { createSocket } from '@/app/lib/socket';
import { useRouletteResultStore } from '@/shared/stores/rouletteResultStore';
import { useRoomLogic } from './useRoomLogic';
import RoomTabs from '@/shared/components/RoomTabs';
import Chat from '@/domain/Chat';

import styles from './page.module.scss';

// 방 페이지

interface RoomPageProps {
  params: {
    roomId: string;
  };
}

export default function RoomPage({ params }: RoomPageProps) {
  const roomId = params.roomId;
  const { isSoloMode, isValidRoom, copied, copyRoomCode } = useRoomLogic(roomId);
  const { results } = useRouletteResultStore();
  const joinedRoomRef = useRef<string | null>(null);

  useEffect(() => {
    if (isSoloMode) return;
    if (!isValidRoom) return;

    const token = localStorage.getItem('accessToken');
    if (!token) return;

    const socket = createSocket(token);
    if (!socket) return;

    const onConnect = () => {
      // 이미 같은 방에 참가 중이면 무시
      if (joinedRoomRef.current === roomId) return;

      // 다른 방에 남아 있다면 먼저 leave
      if (joinedRoomRef.current) {
        socket.emit('leaveRoom', {
          roomCode: joinedRoomRef.current,
        });
      }

      socket.emit('joinRoom', { roomCode: roomId });
      joinedRoomRef.current = roomId;
    };

    socket.on('connect', onConnect);

    // 이미 연결된 상태라면 즉시 처리
    if (socket.connected) {
      onConnect();
    } else {
      socket.connect();
    }

    return () => {
      socket.off('connect', onConnect);

      if (socket.connected && joinedRoomRef.current) {
        socket.emit('leaveRoom', {
          roomCode: joinedRoomRef.current,
        });
      }

      // leave emit 이후 상태 정리
      joinedRoomRef.current = null;
    };
  }, [roomId, isSoloMode, isValidRoom]);

  if (isValidRoom === null) {
    return <div className={styles['room__loading']}>방 정보를 확인 중입니다</div>;
  }

  return (
    <div className={styles['room']}>
      <header className={styles['room__header']}>
        <div className={styles['room__header__left']}>
          <Users size={32} className={styles['room__header__icon']} />
          <div>
            <h1 className={styles['room__title']}>
              {isSoloMode ? '혼자 메뉴 정하기' : '같이 메뉴 정하기'}
            </h1>
            <p className={styles['room__subtitle']}>함께 룰렛을 돌려보세요!</p>
          </div>
        </div>

        {!isSoloMode && (
          <div className={styles['room__code']}>
            <span className={styles['room__code__label']}>방 코드</span>
            <strong className={styles['room__code__value']}>{roomId}</strong>

            <button
              type="button"
              aria-label="방 코드 복사"
              className={styles['room__code__copy']}
              onClick={copyRoomCode}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? '복사됨' : '복사'}
            </button>
          </div>
        )}
      </header>

      <div className={styles['room__content']}>
        <section className={styles['room__roulette-section']}>
          <RoomTabs />
        </section>

        {!isSoloMode && (
          <aside className={styles['room__right']}>
            <Chat roomCode={roomId} />
          </aside>
        )}
      </div>

      <section className={styles['room__stats-section']}>
        <div className={styles['room__stats-header']}>
          <h3>🎲 결과 내역</h3>
        </div>

        <div className={styles['room__top-menu']}>
          <div className={styles['room__top-menu__icon']}>📊</div>
          <div className={styles['room__top-menu__info']}>
            <span className={styles['room__top-menu__name']}>돌린 횟수</span>
            <span className={styles['room__top-menu__count']}>{results?.length ?? 0} 회</span>
          </div>
        </div>

        <div className={styles['room__mood-stats']}>
          <h4>최근 룰렛 결과</h4>

          <div className={styles['room__mood-stats__list']}>
            <ul className={styles['room__mood-stats__list__items']}>
              {results?.slice(0, 8).map((item, idx) => (
                <li key={item.id} className={styles['room__mood-stats__list__items__item']}>
                  <span className={styles['room__mood-stats__list__items__item__badge']}>
                    {idx + 1}
                  </span>
                  {item.name}
                </li>
              ))}

              {results?.length === 0 && (
                <li className={styles['room__mood-stats__list__items__item--empty']}>
                  🎰 룰렛을 돌려보세요!
                </li>
              )}
            </ul>
          </div>

          <div className={styles['room__time-info']}>
            <Clock size={18} />
            <span>
              {new Date().toLocaleTimeString('ko-KR', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
