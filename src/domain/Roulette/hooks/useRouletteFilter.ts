import { useState, useCallback, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

import { Category, Context } from '@/types/enum';
import { rouletteApi } from '@/domain/Roulette/api/roulette.api';

type FilterMode = 'category' | 'context';

interface State {
  mode: FilterMode;
  selectedFoodTypes: Category | null;
  selectedSituation: Context | null;
  menus: Menu.GetMenuRes[];
  isLoading: boolean;
}

interface Actions {
  changeMode: (mode: FilterMode) => void;
  toggleFoodType: (category: Category) => void;
  toggleSituation: (context: Context) => void;
}

export function useRouletteFilter(
  syncedState?: {
    mode: FilterMode;
    selectedFoodTypes: Category | null;
    selectedSituation: Context | null;
  } | null
): { state: State; actions: Actions } {
  const [mode, setMode] = useState<FilterMode>(syncedState?.mode || 'category');
  const [selectedFoodTypes, setSelectedFoodTypes] = useState<Category>(
    syncedState?.selectedFoodTypes || Category.ALL
  );
  const [selectedSituation, setSelectedSituation] = useState<Context | null>(
    syncedState?.selectedSituation || null
  );

  const params = useParams();
  const roomId = (params.roomId as string) || 'solo';

  // 동기화된 상태가 있으면 업데이트
  useEffect(() => {
    if (syncedState) {
      setMode(syncedState.mode);
      setSelectedFoodTypes(syncedState.selectedFoodTypes || Category.ALL);
      setSelectedSituation(syncedState.selectedSituation);
    }
  }, [syncedState]);

  const activeFilter = mode === 'category' ? selectedFoodTypes : selectedSituation;

  // 필터에 맞는 메뉴 조회
  const { data: fetchedMenus = [], isLoading } = useQuery({
    queryKey: ['roulette-menus', roomId, mode, activeFilter],
    queryFn: async () => {
      try {
        if (mode === 'category' && selectedFoodTypes && selectedFoodTypes !== Category.ALL) {
          const result = await rouletteApi.getMenusByCategory(selectedFoodTypes, roomId);
          return result.slice(0, 6);
        } else if (mode === 'category' && selectedFoodTypes === Category.ALL) {
          const result = await rouletteApi.getAllMenus(roomId);
          return result.slice(0, 6);
        } else if (mode === 'context' && selectedSituation) {
          const result = await rouletteApi.getMenusByContext(selectedSituation, roomId);
          return result.slice(0, 6);
        }
        return [];
      } catch (error) {
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5분
    enabled: !!roomId,
    retry: 1,
  });

  const changeMode = useCallback((newMode: FilterMode) => {
    setMode(newMode);
  }, []);

  const toggleFoodType = useCallback((category: Category) => {
    setSelectedFoodTypes(prev => (prev === category ? Category.ALL : category));
  }, []);

  const toggleSituation = useCallback((context: Context) => {
    setSelectedSituation(prev => (prev === context ? null : context));
  }, []);

  return {
    state: {
      mode,
      selectedFoodTypes,
      selectedSituation,
      menus: fetchedMenus,
      isLoading,
    },
    actions: {
      changeMode,
      toggleFoodType,
      toggleSituation,
    },
  };
}
