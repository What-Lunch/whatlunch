import { useState, useEffect, useRef } from 'react';

import { pickMenus } from '@/shared/utils/recommend/pickMenus';

import { FoodTypeFilter, SituationFilter } from '@/types/filters';

const ALL: FoodTypeFilter = '전체';

export function useRouletteFilter(onChange: (menus: string[]) => void) {
  const [mode, setMode] = useState<'food' | 'situation'>('food');
  const [selectedFoodTypes, setSelectedFoodTypes] = useState<FoodTypeFilter[]>([ALL]);
  const [selectedSituation, setSelectedSituation] = useState<SituationFilter | null>(null);

  const isFirstRun = useRef(true);

  /** 음식 종류 토글 */
  const toggleFoodType = (type: FoodTypeFilter) => {
    const isAll = type === ALL;
    const hasAll = selectedFoodTypes.includes(ALL);
    const isSelected = selectedFoodTypes.includes(type);

    if (isAll) return setSelectedFoodTypes([ALL]);
    if (hasAll) return setSelectedFoodTypes([type]);

    if (isSelected) {
      const updated = selectedFoodTypes.filter(t => t !== type);
      return setSelectedFoodTypes(updated.length ? updated : [ALL]);
    }

    setSelectedFoodTypes(prev => [...prev, type]);
  };

  /** 상황 선택 토글 */
  const toggleSituation = (sit: SituationFilter) => {
    setSelectedSituation(prev => (prev === sit ? null : sit));
  };

  /** 모드 전환 시 반대쪽 초기화 */
  useEffect(() => {
    if (mode === 'food') setSelectedSituation(null);
    else setSelectedFoodTypes([ALL]);
  }, [mode]);

  /** 메뉴 추천 수행 */
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }

    const menus =
      mode === 'food' ? pickMenus(selectedFoodTypes, null) : pickMenus([ALL], selectedSituation);

    onChange(menus.map(m => m.name));
  }, [selectedFoodTypes, selectedSituation, mode, onChange]);

  return {
    mode,
    setMode,
    selectedFoodTypes,
    toggleFoodType,
    selectedSituation,
    toggleSituation,
  };
}
