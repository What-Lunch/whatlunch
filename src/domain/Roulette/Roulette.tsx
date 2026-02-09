'use client';

import { memo, useCallback, useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

import Button from '@/shared/components/Button';
import RouletteFilter from './components/RouletteFilter';
import RouletteUi from './components/RouletteUi';
import RouletteModal from './components/RouletteModal';
import Loading from '@/shared/components/Loading';

import { getSocket } from '@/app/lib/socket';
import { Category, Context } from '@/types/enum';

import type { RouletteControllerProps } from './types';
import styles from './Roulette.module.scss';

export const Roulette = memo(function Roulette({
  onSpinResult,
  onSpinStart,
  userRole,
  initialMenus = [],
  isSpinning = false,
}: RouletteControllerProps) {
  const [menus, setMenus] = useState<Menu.GetMenuRes[]>(initialMenus);
  const [spinning, setSpinning] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [filters, setFilters] = useState<{
    category?: Category[];
    context?: Context[];
  }>({});
  const [localResult, setLocalResult] = useState<Menu.GetMenuRes | null>(null);

  // 게스트용 동기화된 필터 상태
  const [syncedFilterState, setSyncedFilterState] = useState<{
    mode: 'category' | 'context';
    selectedFoodTypes: Category | null;
    selectedSituation: Context | null;
  } | null>(null);

  const params = useParams();
  const roomCode = (params?.roomId as string) || 'solo';
  const isSoloMode = roomCode === 'solo';

  // 최초 입장/재입장 시 서버 menus만 사용
  useEffect(() => {
    if (initialMenus && initialMenus.length > 0) {
      setMenus(initialMenus);
    }
  }, [initialMenus]);

  // ============ WebSocket 이벤트 리스너 ============
  useEffect(() => {
    if (isSoloMode) return;

    const socket = getSocket();
    if (!socket) return;

    // 메뉴 동기화 이벤트 (서버에서 직접 메뉴 목록 받음)
    const handleMenusSync = ({ menus }: { menus: Menu.GetMenuRes[] }) => {
      setMenus(menus);
    };

    // 역할 할당 이벤트 - 초기 메뉴 설정
    const handleRoleAssigned = ({ menus }: { role: string; menus: Menu.GetMenuRes[] }) => {
      if (menus && menus.length > 0) {
        setMenus(menus);
      }
    };

    // 필터 업데이트 이벤트 (호스트와 게스트 모두)
    const handleFiltersUpdated = ({
      filters,
      mode,
      selectedFoodTypes,
      selectedSituation,
      menus,
    }: {
      filters: { category?: Category[]; context?: Context[] };
      mode: 'category' | 'context';
      selectedFoodTypes: Category | null;
      selectedSituation: Context | null;
      updatedBy: string;
      menus: Menu.GetMenuRes[];
    }) => {
      setFilters(filters);
      setSyncedFilterState({ mode, selectedFoodTypes, selectedSituation });
      setMenus(menus); // 호스트도 서버에서 받은 메뉴 목록 사용
    };

    socket.on('menusSync', handleMenusSync);
    socket.on('roleAssigned', handleRoleAssigned);
    socket.on('rouletteFiltersUpdated', handleFiltersUpdated);

    return () => {
      socket.off('menusSync', handleMenusSync);
      socket.off('roleAssigned', handleRoleAssigned);
      socket.off('rouletteFiltersUpdated', handleFiltersUpdated);
    };
  }, [isSoloMode]);

  // ============ 필터 변경 ============
  const handleFiltersChange = useCallback(
    (
      newFilters: { category?: Category[]; context?: Context[] },
      mode: 'category' | 'context',
      selectedFoodTypes: Category | null,
      selectedSituation: Context | null
    ) => {
      setFilters(newFilters);
      // 서버에서 받은 menus 배열을 그대로 사용 (섞거나 정렬하지 않음)
      if (!isSoloMode && userRole === 'host') {
        const socket = getSocket();
        if (socket) {
          socket.emit('updateRouletteFilters', {
            roomCode,
            filters: newFilters,
            mode,
            selectedFoodTypes,
            selectedSituation,
          });
        }
      }
    },
    [roomCode, isSoloMode, userRole]
  );

  // ============ 룰렛 결과 ============
  const handleResult = useCallback(
    (item: Menu.GetMenuRes) => {
      setLocalResult(item);
      setModalOpen(true);
      onSpinResult(item);
      setSpinning(false);
    },
    [onSpinResult]
  );

  // ============ 스핀 시작 시 결과 초기화 ============
  const handleSpinStart = useCallback(() => {
    setLocalResult(null);
    setModalOpen(false);
    onSpinStart?.();
    onSpinResult(null);
    setSpinning(true);
  }, [onSpinStart, onSpinResult]);

  // ============ 모달 제어 ============
  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
  }, []);

  return (
    <div className={styles['roulette']}>
      <p className={styles['roulette__today']}>
        오늘의 메뉴 {localResult ? <span>{localResult.name} !</span> : <span>?</span>}
      </p>

      <div className={styles['roulette__wheel-wrapper']}>
        {isSoloMode && menus.length === 0 ? (
          <Loading />
        ) : (
          <RouletteUi
            items={menus}
            onStart={handleSpinStart}
            onResult={handleResult}
            filters={filters}
            userRole={userRole}
          />
        )}
      </div>

      <div className={styles['roulette__result-btn']}>
        <Button
          disabled={!localResult}
          onClick={() => setModalOpen(true)}
          className={styles['roulette__result-btn__button']}
        >
          결과 보기
        </Button>
      </div>

      {(isSoloMode || userRole === 'host') && (
        <RouletteFilter
          onChange={setMenus}
          onFiltersChange={userRole === 'host' || isSoloMode ? handleFiltersChange : undefined}
          disabled={(userRole !== 'host' && !isSoloMode) || spinning || isSpinning}
          syncedFilterState={syncedFilterState}
          isVisible={true}
        />
      )}

      {modalOpen && localResult && <RouletteModal menu={localResult} onClose={handleCloseModal} />}
    </div>
  );
});

export default Roulette;
