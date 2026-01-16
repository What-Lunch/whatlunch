import { useCallback, useMemo, useState } from 'react';

import { pickMenus } from '@/domain/Roulette/core/pickMenus';
import { Menu } from '@/types/api';
import { FilterMode } from '@/domain/Roulette/constants/filters';

export function useRouletteFilter() {
  const [mode, setMode] = useState<FilterMode>('food'); // 현재 필터 모드(food/situation)
  const [selectedFoodTypes, setSelectedFoodTypes] = useState<Menu.Category[]>([Menu.Category.ALL]); // 선택된 음식 타입
  const [selectedSituation, setSelectedSituation] = useState<Menu.Context | null>(null); // 선택된 상황

  const computedTypes = useMemo(() => {
    return selectedFoodTypes.includes(Menu.Category.ALL) ? null : selectedFoodTypes;
  }, [selectedFoodTypes]); // ALL 제외한 실질 필터 타입 계산

  const menus = useMemo(() => {
    return mode === 'food' ? pickMenus(computedTypes, null) : pickMenus(null, selectedSituation);
  }, [mode, computedTypes, selectedSituation]); // 필터 상태 기반 메뉴 목록 생성

  const changeMode = useCallback((nextMode: FilterMode) => {
    if (nextMode === 'food') setSelectedSituation(null);
    else setSelectedFoodTypes([Menu.Category.ALL]);
    setMode(nextMode);
  }, []); // 모드 전환 + 상대 필터 초기화

  const toggleFoodType = useCallback((type: Menu.Category) => {
    setSelectedFoodTypes(prev => {
      const isAll = type === Menu.Category.ALL;
      const hasAll = prev.includes(Menu.Category.ALL);
      const isSelected = prev.includes(type);

      if (isAll) return [Menu.Category.ALL];
      if (hasAll) return [type];
      if (isSelected) {
        const rest = prev.filter(v => v !== type);
        return rest.length > 0 ? rest : [Menu.Category.ALL];
      }
      return [...prev, type];
    });
  }, []); // 음식 타입 토글(ALL 규칙 포함)

  const toggleSituation = useCallback((sit: Menu.Context) => {
    setSelectedSituation(prev => (prev === sit ? null : sit));
  }, []); // 상황 토글(단일 선택)

  return {
    state: {
      mode, // 현재 모드
      menus, // 현재 필터 기반 메뉴 목록
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
