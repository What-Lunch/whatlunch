import { useState, useEffect, useMemo, useRef } from 'react';

import { FoodTypeFilter, SituationFilter, FilterMode } from './../../../shared/constants/filters';

import { pickMenus } from '@/shared/utils/recommend/pickMenus';
import { FILTER_CONFIG } from '@/shared/constants/filters';

import { FilterOption } from '@/types/roulette';

const ALL: FoodTypeFilter = '전체';

export function useRouletteFilter(onChange: (menus: string[]) => void) {
  const [mode, setMode] = useState<FilterMode>('food');
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

  /** 음식 옵션 */
  const foodOptions: FilterOption<FoodTypeFilter>[] = useMemo(
    () =>
      FILTER_CONFIG.food.options.map(opt => ({
        value: opt.value,
        label: opt.label,
        icon: FILTER_CONFIG.food.icons[opt.value],
        isActive: selectedFoodTypes.includes(opt.value),
      })),
    [selectedFoodTypes]
  );

  /** 상황 옵션 */
  const situationOptions: FilterOption<SituationFilter>[] = useMemo(
    () =>
      FILTER_CONFIG.situation.options.map(opt => ({
        value: opt.value,
        label: opt.label,
        icon: FILTER_CONFIG.situation.icons[opt.value],
        isActive: selectedSituation === opt.value,
      })),
    [selectedSituation]
  );

  /** 모드 변경 시 다른 필터 초기화 */
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
    foodOptions,
    situationOptions,
    toggleFoodType,
    toggleSituation,
  };
}
