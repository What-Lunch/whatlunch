import { useCallback, useState } from 'react';
import { useParams } from 'next/navigation';

import { useQuery } from '@tanstack/react-query';

import { FilterMode } from '@/domain/Roulette/constants/filters';

import { Category, Context } from '@/types/enum';
import { menusService } from '@/app/services/backend/menus.api';

export function useRouletteFilter() {
  const [mode, setMode] = useState<FilterMode>('category'); // 현재 필터 모드(food/situation)
  const [selectedFoodTypes, setSelectedFoodTypes] = useState<Category | null>(Category.ALL); // 선택된 음식 타입
  const [selectedSituation, setSelectedSituation] = useState<Context | null>(null); // 선택된 상황

  const params = useParams();
  const roomId = params.roomId as string;

  const activeFilter = mode === 'category' ? selectedFoodTypes : selectedSituation;

  // TODO: 에러 로직 추가 필요
  const { data: fetchedMenus, isLoading: queryLoading } = useQuery({
    queryKey: ['roulette-menus', roomId, activeFilter],
    queryFn: async () => {
      const params: Menu.GetMenuReq = {};
      if (mode === 'category' && selectedFoodTypes && selectedFoodTypes !== Category.ALL) {
        params.category = selectedFoodTypes;
      }
      if (mode === 'context' && selectedSituation) {
        params.context = selectedSituation;
      }
      return await menusService.getMenusRoulette(params);
    },
    staleTime: 5 * 60 * 1000,
  });

  const changeMode = useCallback((nextMode: FilterMode) => {
    if (nextMode === 'category') setSelectedSituation(null);
    else setSelectedFoodTypes(null);
    setMode(nextMode);
  }, []); // 모드 전환 + 상대 필터 초기화

  const toggleFoodType = useCallback((type: Category) => {
    setSelectedFoodTypes(prev => (prev === type ? null : type));
  }, []); // 음식 타입 토글(단일 선택)

  const toggleSituation = useCallback((sit: Context) => {
    setSelectedSituation(prev => (prev === sit ? null : sit));
  }, []); // 상황 토글(단일 선택)

  return {
    state: {
      mode, // 현재 모드
      menus: fetchedMenus || [], // 현재 필터 기반 메뉴 목록
      isLoading: queryLoading,
      selectedFoodTypes,
      selectedSituation,
    },
    actions: {
      changeMode,
      toggleFoodType,
      toggleSituation,
    },
  };
}
