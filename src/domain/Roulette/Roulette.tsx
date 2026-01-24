'use client';

import { memo, useCallback, useState, useEffect } from 'react';
import { Shuffle } from 'lucide-react';
import { useParams } from 'next/navigation';

import Button from '@/shared/components/Button';
import RouletteFilter from './components/RouletteFilter';
import RouletteUi from './components/RouletteUi';
import RouletteModal from './components/RouletteModal';

import { shuffleMenus } from './core/shuffleMenus';
import { getSocket } from '@/app/lib/socket';
import { Category, Context } from '@/types/enum';

import type { RouletteControllerProps } from './type';
import styles from './Roulette.module.scss';

export const Roulette = memo(function Roulette({
  isSpinning,
  onSpinStart,
  onSpinResult,
  result,
  userRole,
  initialMenus = [],
}: RouletteControllerProps) {
  const [menus, setMenus] = useState<Menu.GetMenuRes[]>(initialMenus);
  const [modalOpen, setModalOpen] = useState(false);
  const [filters, setFilters] = useState<{
    category?: Category[];
    context?: Context[];
  }>({});

  // 게스트용 동기화된 필터 상태
  const [syncedFilterState, setSyncedFilterState] = useState<{
    mode: 'category' | 'context';
    selectedFoodTypes: Category | null;
    selectedSituation: Context | null;
  } | null>(null);

  const params = useParams();
  const roomCode = (params.roomId as string) || 'solo';
  const isSoloMode = roomCode === 'solo';

  const canShuffle = menus.length > 1;

  // 초기 메뉴 업데이트
  useEffect(() => {
    if (initialMenus && initialMenus.length > 0 && menus.length === 0) {
      setMenus(initialMenus);
    }
  }, [initialMenus, menus.length]);

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

  // ============ 메뉴 변경 ============
  const handleMenusChange = useCallback((newMenus: Menu.GetMenuRes[]) => {
    // 모든 모드에서 메뉴를 6개로 제한하여 설정
    setMenus(newMenus.slice(0, 6));
  }, []);

  // ============ 필터 변경 ============
  const handleFiltersChange = useCallback(
    (
      newFilters: { category?: Category[]; context?: Context[] },
      mode: 'category' | 'context',
      selectedFoodTypes: Category | null,
      selectedSituation: Context | null
    ) => {
      setFilters(newFilters);

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

  // ============ 메뉴 섞기 ============
  const handleShuffle = useCallback(() => {
    if (!canShuffle) return;
    setMenus(prevMenus => shuffleMenus(prevMenus));
  }, [canShuffle]);

  // ============ 룰렛 결과 ============
  const handleResult = useCallback(
    (item: Menu.GetMenuRes) => {
      setModalOpen(true);
      onSpinResult(item);
    },
    [onSpinResult]
  );

  // ============ 모달 제어 ============
  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
  }, []);

  const openResultModal = useCallback(() => {
    if (!result) return;
    setModalOpen(true);
  }, [result]);

  return (
    <div className={styles['roulette']}>
      <p className={styles['roulette__today']}>
        오늘의 메뉴 {result ? <span>{result.name}</span> : <span>?</span>}
      </p>

      <div className={styles['roulette__wheel-wrapper']}>
        <Button
          variant="neutral"
          mode="fill"
          padding="0"
          fontSize="0"
          disabled={isSpinning || !canShuffle}
          onClick={handleShuffle}
          className={styles['roulette__shuffle-btn']}
        >
          <Shuffle size={20} />
        </Button>

        <RouletteUi
          items={menus}
          onStart={onSpinStart}
          onResult={handleResult}
          filters={filters}
          userRole={userRole}
        />
      </div>

      <div className={styles['roulette__result-btn-wrapper']}>
        <Button
          variant="neutral"
          mode="fill"
          disabled={!result || isSpinning}
          onClick={openResultModal}
        >
          결과 보기
        </Button>
      </div>

      {/* 호스트만 필터 UI 보임, 게스트는 서버에서 받은 메뉴만 사용 */}
      {(isSoloMode || userRole === 'host') && (
        <RouletteFilter
          onChange={handleMenusChange}
          onFiltersChange={handleFiltersChange}
          disabled={isSpinning}
          syncedFilterState={syncedFilterState}
          isVisible={true}
        />
      )}

      {modalOpen && result && <RouletteModal menu={result} onClose={handleCloseModal} />}
    </div>
  );
});

export default Roulette;
