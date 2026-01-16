import { useCallback, useMemo, useState } from 'react';

import { pickMenus } from '@/domain/Roulette/core/pickMenus';
import { FilterMode } from '@/domain/Roulette/constants/filters';

import { Category, Context } from '@/types/enum';
export function useRouletteFilter() {
  const [mode, setMode] = useState<FilterMode>('food'); // 현재 필터 모드(food/situation)
  const [selectedFoodTypes, setSelectedFoodTypes] = useState<Category[]>([Category.ALL]); // 선택된 음식 타입
  const [selectedSituation, setSelectedSituation] = useState<Context | null>(null); // 선택된 상황
  const computedTypes = useMemo(() => {
    return selectedFoodTypes.includes(Category.ALL) ? null : selectedFoodTypes;
  }, [selectedFoodTypes]); // ALL 제외한 실질 필터 타입 계산

  const menus = useMemo(() => {
    return mode === 'food' ? pickMenus(computedTypes, null) : pickMenus(null, selectedSituation);
  }, [mode, computedTypes, selectedSituation]); // 필터 상태 기반 메뉴 목록 생성

  const changeMode = useCallback((nextMode: FilterMode) => {
    if (nextMode === 'food') setSelectedSituation(null);
    else setSelectedFoodTypes([Category.ALL]);
    setMode(nextMode);
  }, []); // 모드 전환 + 상대 필터 초기화

  const toggleFoodType = useCallback((type: Category) => {
    setSelectedFoodTypes(prev => {
      const isAll = type === Category.ALL;
      const hasAll = prev.includes(Category.ALL);
      const isSelected = prev.includes(type);

      if (isAll) return [Category.ALL];
      if (hasAll) return [type];
      if (isSelected) {
        const rest = prev.filter(v => v !== type);
        return rest.length > 0 ? rest : [Category.ALL];
      }
      return [...prev, type];
    });
  }, []); // 음식 타입 토글(ALL 규칙 포함)

  const toggleSituation = useCallback((sit: Context) => {
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
