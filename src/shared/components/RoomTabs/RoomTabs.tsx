'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import type { FormEvent } from 'react';
import { useParams } from 'next/navigation';
import { Shuffle, MapPin } from 'lucide-react';

import TopTabs, { type TopTabItem } from '@/shared/components/TopTabs';
import Roulette from '@/domain/Roulette';
import KakaoMap from '@/shared/components/KakaoMap';

import { useRouletteResultStore } from '@/shared/stores/rouletteResultStore';
import { getSocket, isSocketConnected } from '@/app/lib/socket';

import styles from './RoomTabs.module.scss';

const TAB_LIST = [
  { value: 'roulette', label: '룰렛', icon: <Shuffle size={18} /> },
  { value: 'map', label: '지도', icon: <MapPin size={18} /> },
] as const satisfies readonly TopTabItem[];

const isMainTab = (value: string): value is TopTabItem['value'] =>
  TAB_LIST.some(tab => tab.value === value);

interface RoomTabsProps {
  userRole?: 'host' | 'guest' | null;
  initialMenus?: Menu.GetMenuRes[];
  onResult?: (result: Menu.GetMenuRes) => void;
}

export default function RoomTabs({ userRole, initialMenus = [], onResult }: RoomTabsProps) {
  const [activeTab, setActiveTab] = useState<TopTabItem['value']>('roulette');
  const [isSpinning, setIsSpinning] = useState(false);
  const [rouletteResult, setRouletteResult] = useState<Menu.GetMenuRes | null>(null);

  const searchRef = useRef<HTMLInputElement>(null);
  const [searchKeyword, setSearchKeyword] = useState('');

  const params = useParams();
  const roomCode = (params.roomId as string) || 'solo';
  const isSoloMode = roomCode === 'solo';

  // 룸별 독립적인 결과 저장소
  const { addResult, setCurrentRoom } = useRouletteResultStore();

  // 현재 룸 설정
  useEffect(() => {
    setCurrentRoom(roomCode);
  }, [roomCode, setCurrentRoom]);

  const handleSearch = useCallback((e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = searchRef.current?.value ?? '';
    setSearchKeyword(value);
    setRouletteResult(null);
  }, []);

  // ============ WebSocket 이벤트 리스너 설정 ============
  useEffect(() => {
    if (isSoloMode) {
      return;
    }

    const socket = getSocket();
    if (!socket) {
      return;
    }

    // 호스트/게스트 역할 요청 (재접속 시에도)
    socket.emit('joinRoom', { roomCode, role: userRole });

    // 탭 동기화
    const handleTabSync = ({ activeTab: newTab }: { activeTab: TopTabItem['value'] }) => {
      setActiveTab(newTab);
    };

    // 룰렛 회전 시작
    const handleRouletteSpinStarted = () => {
      setIsSpinning(true);
    };

    // 상태 동기화
    const handleRouletteStateSync = ({
      state,
    }: {
      state: {
        activeTab: TopTabItem['value'];
        isSpinning: boolean;
        result: Menu.GetMenuRes | null;
      };
    }) => {
      setActiveTab(state.activeTab);
      setIsSpinning(state.isSpinning);
      if (state.result) {
        setRouletteResult(state.result);
      }
    };

    // 이벤트 리스너 등록
    socket.on('tabSync', handleTabSync);
    socket.on('rouletteSpinStarted', handleRouletteSpinStarted);
    socket.on('rouletteStateSync', handleRouletteStateSync);

    // 현재 상태 요청 (재접속 시 동기화)
    setTimeout(() => {
      socket.emit('requestRouletteState', { roomCode });
    }, 500);

    return () => {
      socket.off('tabSync', handleTabSync);
      socket.off('rouletteSpinStarted', handleRouletteSpinStarted);
      socket.off('rouletteStateSync', handleRouletteStateSync);
    };
  }, [roomCode, isSoloMode, userRole]);

  // ============ 탭 변경 핸들러 ============
  const handleTabChange = useCallback(
    (tab: string) => {
      if (!isMainTab(tab)) return;

      if (isSoloMode) {
        setActiveTab(tab);
        return;
      }

      // 룰렛 탭만 실시간 동기화, 지도(map)는 각자 조작
      if (tab === 'roulette') {
        if (!isSocketConnected()) {
          console.warn('[탭변경] Socket 미연결');
          setActiveTab(tab);
          return;
        }
        const socket = getSocket();
        if (socket) {
          socket.emit('tabChange', { roomCode, tab });
        } else {
          setActiveTab(tab);
        }
      } else {
        // 지도(map) 탭은 로컬 상태만 변경
        setActiveTab(tab);
      }
    },
    [roomCode, isSoloMode]
  );

  // ============ 룰렛 이벤트 핸들러 ============
  const handleRouletteStart = useCallback(() => {
    setIsSpinning(true);
  }, []);

  const handleRouletteResultLocal = useCallback(
    (result: Menu.GetMenuRes | null) => {
      setIsSpinning(false);
      setRouletteResult(result);
      setSearchKeyword(result?.name ?? '');

      if (searchRef.current) {
        searchRef.current.value = result?.name ?? '';
      }

      // 룸별 결과 저장
      if (result) addResult(roomCode, [result]);
      // 부모 컴포넌트에 결과 전파
      if (onResult && result) {
        onResult(result);
      }
    },
    [roomCode, addResult, onResult]
  );
  if (!userRole) return null;

  // ============ 렌더링 ============
  const renderPanel = (value: string) => {
    switch (value) {
      case 'roulette':
        return (
          <Roulette
            isSpinning={isSpinning}
            onSpinStart={handleRouletteStart}
            onSpinResult={handleRouletteResultLocal}
            result={rouletteResult}
            userRole={userRole}
            initialMenus={initialMenus}
          />
        );
      case 'map':
        return (
          <div className={styles['room-tabs__map']}>
            <form onSubmit={handleSearch} className={styles['room-tabs__form']}>
              <input
                type="search"
                placeholder="장소를 검색해보세요"
                ref={searchRef}
                defaultValue={searchKeyword}
                className={styles['room-tabs__input']}
              />
              <button type="submit" className={styles['room-tabs__button']}>
                검색
              </button>
            </form>

            <KakaoMap keyword={searchKeyword} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <TopTabs
      items={TAB_LIST}
      value={activeTab}
      onChange={handleTabChange}
      renderPanel={renderPanel}
      lazyMount
    />
  );
}
