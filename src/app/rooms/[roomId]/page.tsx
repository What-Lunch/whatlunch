'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Copy, Check, Clock, Users } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import RoomTabs from '@/shared/components/RoomTabs';
import Chat from '@/domain/Chat';
import FavoriteToggle from '@/shared/components/FavoriteToggle';
import KakaoMap from '@/shared/components/KakaoMap/KakaoMap';
import Button from '@/shared/components/Button/Button';
import BaseInput from '@/shared/components/Input/BaseInput/BaseInput';
import Loading from '@/shared/components/Loading';

import { useAuthStore } from '@/domain/Auth/store/auth.store';
import { createSocket } from '@/app/lib/socket';
import { useRouletteResultStore } from '@/shared/stores/rouletteResultStore';
import { useRoomLogic } from './useRoomLogic';

import { favoritesService } from '@/app/services/backend/favorites.api';

import styles from './page.module.scss';

// 방 페이지
interface RoomPageProps {
  params: {
    roomId: string;
  };
}

export default function RoomPage({ params }: RoomPageProps) {
  const roomId = params.roomId;
  const { isValidRoom, copied, copyRoomCode } = useRoomLogic(roomId);
  const { getResults, setCurrentRoom } = useRouletteResultStore();
  const [roomResults, setRoomResults] = useState<Menu.GetMenuRes[]>([]);
  const [initialMenus, setInitialMenus] = useState<Menu.GetMenuRes[]>([]);
  const joinedRoomRef = useRef<string | null>(null);
  const { user, isAuthLoading } = useAuthStore();
  const router = useRouter();
  const [favoriteMap, setFavoriteMap] = useState<Record<string, boolean>>({});
  const [socketReady, setSocketReady] = useState(false);
  const [userRole, setUserRole] = useState<'host' | 'guest' | null>(null);
  const queryClient = useQueryClient();

  // 현재 룸 설정 및 결과 가져오기
  useEffect(() => {
    setCurrentRoom(roomId);
    setRoomResults(getResults(roomId));
  }, [roomId, setCurrentRoom, getResults]);

  // 룰렛 결과 실시간 동기화 핸들러
  const handleRouletteResult = useCallback((result: Menu.GetMenuRes) => {
    setRoomResults(prev => [result, ...prev]);
    if (result?.name) {
      setSearchKeyword(result.name);
      if (searchRef.current) {
        searchRef.current.value = result.name;
      }
    }
  }, []);

  // ============ 인증 확인 ============
  useEffect(() => {
    if (isAuthLoading) return;
    if (!user) {
      router.push('/');
      return;
    }
  }, [user, router, isAuthLoading]);

  // ============ Socket 연결 (한 번만) ============
  useEffect(() => {
    if (!isValidRoom) return;
    if (!user) return;

    const socket = createSocket(token);
    if (!socket) return;

    const joinRoomIfNeeded = () => {
      if (joinedRoomRef.current === roomId) return;

      if (joinedRoomRef.current) {
        socket.emit('leaveRoom', { roomCode: joinedRoomRef.current });
      }

      socket.emit('joinRoom', { roomCode: roomId });
      joinedRoomRef.current = roomId;
    };

    socket.on('connected', joinRoomIfNeeded);

    socket.on('roleAssigned', ({ role, menus }) => {
      setUserRole(role);
      setSocketReady(true);
      localStorage.setItem(`role_${roomId}`, role);
      if (menus?.length) setInitialMenus(menus);
    });

    socket.on('joinError', () => {
      localStorage.removeItem('accessToken');
      router.push('/');
    });

    return () => {
      socket.off('connected');
      socket.off('roleAssigned');
      socket.off('joinError');
      joinedRoomRef.current = null;
    };
  }, [roomId, isValidRoom, router, user]);

  // 찜 API
  const addFavoriteMutation = useMutation({
    mutationFn: (menuId: string) => favoritesService.addFavorite(menuId),
    onMutate: (menuId: string) => {
      setFavoriteMap(prev => ({ ...prev, [menuId]: true }));
    },
    onError: (_err, menuId) => {
      setFavoriteMap(prev => ({ ...prev, [menuId]: false }));
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites', 'me'] });
    },
  });

  const removeFavoriteMutation = useMutation({
    mutationFn: (menuId: string) => favoritesService.removeFavorite(menuId),
    onMutate: (menuId: string) => {
      setFavoriteMap(prev => ({ ...prev, [menuId]: false }));
    },
    onError: (_err, menuId) => {
      setFavoriteMap(prev => ({ ...prev, [menuId]: true }));
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites', 'me'] });
    },
  });

  const handleFavoriteToggle = (menuId: string) => {
    const isActive = favoriteMap[menuId] ?? false;
    if (isActive) {
      removeFavoriteMutation.mutate(menuId);
    } else {
      addFavoriteMutation.mutate(menuId);
    }
  };

  // 지도 검색
  const [searchKeyword, setSearchKeyword] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);

  const handleSearch = () => {
    if (searchRef.current) {
      setSearchKeyword(searchRef.current.value);
    }
  };

  if (!isValidRoom) {
    return <div className={styles['room__loading']}>유효하지 않은 방입니다.</div>;
  }

  return (
    <div className={styles['room']}>
      <header className={styles['room__header']}>
        <div className={styles['room__header__left']}>
          <Users size={32} className={styles['room__header__icon']} />
          <div>
            <h1 className={styles['room__title']}>같이 메뉴 정하기</h1>
            <p className={styles['room__subtitle']}>함께 룰렛을 돌려보세요!</p>
          </div>
        </div>

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
      </header>

      <div className={styles['room__content']}>
        <section className={styles['room__roulette-section']}>
          {socketReady && userRole ? (
            <RoomTabs
              userRole={userRole}
              initialMenus={initialMenus}
              onResult={handleRouletteResult}
            />
          ) : (
            <Loading />
          )}
        </section>

        {socketReady && (
          <aside className={styles['room__right']}>
            <Chat roomCode={roomId} />
          </aside>
        )}
      </div>

      <section className={styles['room__stats']}>
        <div className={styles['room__stats__inner']}>
          <div className={styles['room__map-section']}>
            <div className={styles['room__map-header']}>
              <h3>지도</h3>
              <p>결과에 따라 지도가 업데이트 돼요!</p>
            </div>
            <div className={styles['room__map-header']}>
              <BaseInput
                ref={searchRef}
                placeholder="장소를 검색해보세요"
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
              />
              <Button
                type="button"
                className={styles['room__map-header__search-btn']}
                onClick={handleSearch}
              >
                검색
              </Button>
            </div>
            <div className={styles['room__map']}>
              <KakaoMap keyword={searchKeyword} list />
            </div>
          </div>

          <div className={styles['room__result-section']}>
            <div className={styles['room__stats-header']}>
              <h3>🎲 결과 내역</h3>
            </div>

            <div className={styles['room__top-menu']}>
              <div className={styles['room__top-menu__icon']}>📊</div>
              <div className={styles['room__top-menu__info']}>
                <span className={styles['room__top-menu__name']}>돌린 횟수</span>
                <span className={styles['room__top-menu__count']}>
                  {roomResults?.length ?? 0} 회
                </span>
              </div>
            </div>

            <div className={styles['room__mood-stats-content']}>
              <div className={styles['room__mood-stats']}>
                <h4>최근 룰렛 결과</h4>
                <div className={styles['room__mood-stats__list']}>
                  <ul className={styles['room__mood-stats__list__items']}>
                    {roomResults?.map((item, idx) => {
                      const isActive = favoriteMap[item.id] ?? false;
                      return (
                        <li
                          key={`${item.id} + ${idx}`}
                          className={styles['room__mood-stats__list__items__item']}
                        >
                          <span className={styles['room__mood-stats__list__items__item__badge']}>
                            {idx + 1}
                          </span>
                          <span>{item.name}</span>
                          <FavoriteToggle
                            isActive={isActive}
                            onToggle={() => handleFavoriteToggle(item.id)}
                            size={18}
                            ariaLabel={`${item.name} ${isActive ? '찜 해제' : '찜하기'}`}
                          />
                        </li>
                      );
                    })}
                    {(!roomResults || roomResults.length === 0) && (
                      <li className={styles['room__mood-stats__list__items__item--empty']}>
                        🎰 룰렛을 돌려보세요!
                      </li>
                    )}
                  </ul>
                </div>
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
          </div>
        </div>
      </section>
    </div>
  );
}
