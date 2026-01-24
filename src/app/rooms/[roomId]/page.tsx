'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Copy, Check, Clock, Users } from 'lucide-react';

import RoomTabs from '@/shared/components/RoomTabs';
import Chat from '@/domain/Chat';

import { useAuthStore } from '@/domain/Auth/store/auth.store';
import { createSocket, disconnectSocket } from '@/app/lib/socket';
import { useRouletteResultStore } from '@/shared/stores/rouletteResultStore';
import { useRoomLogic } from './useRoomLogic';

import styles from './page.module.scss';

interface RoomPageProps {
  params: {
    roomId: string;
  };
}

export default function RoomPage({ params }: RoomPageProps) {
  const roomId = params.roomId;
  const { isSoloMode, isValidRoom, copied, copyRoomCode } = useRoomLogic(roomId);
  const { getResults, setCurrentRoom } = useRouletteResultStore();
  const [roomResults, setRoomResults] = useState<Menu.GetMenuRes[]>([]);
  const [initialMenus, setInitialMenus] = useState<Menu.GetMenuRes[]>([]);
  const joinedRoomRef = useRef<string | null>(null);
  const { user, isAuthLoading } = useAuthStore();
  const router = useRouter();

  const [socketReady, setSocketReady] = useState(false);
  const [userRole, setUserRole] = useState<'host' | 'guest' | null>(null);

  // 현재 룸 설정 및 결과 가져오기
  useEffect(() => {
    setCurrentRoom(roomId);
    setRoomResults(getResults(roomId));
  }, [roomId, setCurrentRoom, getResults]);

  // 룰렛 결과 실시간 동기화 핸들러
  const handleRouletteResult = (result: Menu.GetMenuRes) => {
    setRoomResults(prev => [result, ...prev]);
  };

  // ============ 인증 확인 ============
  useEffect(() => {
    if (isAuthLoading) return;
    if (!user) {
      router.push('/');
    }
  }, [user, router, isAuthLoading]);

  // ============ Socket 연결 (한 번만) ============
  useEffect(() => {
    if (isSoloMode) {
      setSocketReady(true);
      return;
    }

    if (isValidRoom === null) {
      return;
    }

    if (!isValidRoom) {
      return;
    }

    const token = localStorage.getItem('accessToken');
    if (!token) {
      return;
    }

    // Socket 생성
    const socket = createSocket(token);
    if (!socket) {
      console.error('[Socket] 생성 실패');
      return;
    }

    // 연결 성공 이벤트 대기 (user 정보가 설정된 후)
    const handleConnected = () => {
      // 인증 완료 후 방 입장
      socket.emit('joinRoom', { roomCode: roomId });
      joinedRoomRef.current = roomId;
    };

    // 방 입장 응답
    const handleRoleAssigned = ({
      role,
      menus,
    }: {
      role: 'host' | 'guest';
      menus?: Menu.GetMenuRes[];
    }) => {
      setUserRole(role);
      setSocketReady(true);
      localStorage.setItem(`role_${roomId}`, role);

      if (menus && menus.length > 0) {
        setInitialMenus(menus);
      }
    };

    const handleJoinError = ({ reason }: { reason: string }) => {
      console.error('[방] 입장 실패:', reason);
      // 토큰 만료 시 재로그인 필요
      if (reason === 'UNAUTHORIZED' || reason === 'INVALID_TOKEN') {
        localStorage.removeItem('accessToken');
        router.push('/');
      }
    };

    // 이벤트 리스너 등록
    socket.on('connected', handleConnected);
    socket.on('roleAssigned', handleRoleAssigned);
    socket.on('joinError', handleJoinError);

    // 정리
    return () => {
      socket.off('connected', handleConnected);
      socket.off('roleAssigned', handleRoleAssigned);
      socket.off('joinError', handleJoinError);

      // 마지막 방 참가자가 나가면 연결 해제
      if (joinedRoomRef.current === roomId) {
        joinedRoomRef.current = null;
      }
    };
  }, [roomId, isSoloMode, isValidRoom, router]);

  // ============ 페이지 이동 시 연결 정리 ============
  useEffect(() => {
    return () => {
      if (!isValidRoom) {
        disconnectSocket();
      }
    };
  }, [isValidRoom]);

  if (isValidRoom === null) {
    return <div className={styles['room__loading']}>방 정보를 확인 중입니다...</div>;
  }

  if (!isValidRoom) {
    return <div className={styles['room__loading']}>유효하지 않은 방입니다.</div>;
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
            <p className={styles['room__subtitle']}>
              {isSoloMode ? '룰렛을 돌려보세요!' : '함께 룰렛을 돌려보세요!'}
            </p>
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
          {isSoloMode ? (
            <RoomTabs userRole="host" onResult={handleRouletteResult} />
          ) : socketReady && userRole ? (
            <RoomTabs
              userRole={userRole}
              initialMenus={initialMenus}
              onResult={handleRouletteResult}
            />
          ) : (
            <div>연결 중...</div>
          )}
        </section>

        {!isSoloMode && socketReady && (
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
            <span className={styles['room__top-menu__count']}>{roomResults?.length ?? 0} 회</span>
          </div>
        </div>

        <div className={styles['room__mood-stats']}>
          <h4>최근 룰렛 결과</h4>

          <div className={styles['room__mood-stats__list']}>
            <ul className={styles['room__mood-stats__list__items']}>
              {roomResults?.slice(0, 8).map((item, idx) => (
                <li
                  key={`${item.id}-${idx}`}
                  className={styles['room__mood-stats__list__items__item']}
                >
                  <span className={styles['room__mood-stats__list__items__item__badge']}>
                    {idx + 1}
                  </span>
                  {item.name}
                </li>
              ))}

              {!roomResults ||
                (roomResults.length === 0 && (
                  <li className={styles['room__mood-stats__list__items__item--empty']}>
                    🎰 룰렛을 돌려보세요!
                  </li>
                ))}
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
