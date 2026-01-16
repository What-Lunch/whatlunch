import { useMemo } from 'react';

import { FILTER_FULL_CONFIG } from '@/domain/Roulette/constants';
import { Menu } from '@/types/api';

export function useFilterOptions(
  selectedFoodTypes: Menu.Category[],
  selectedSituation: Menu.Context | null
) {
  // 음식 옵션 구성
  const foodOptions = useMemo(() => {
    return FILTER_FULL_CONFIG.food.options.map(opt => ({
      ...opt,
      icon: FILTER_FULL_CONFIG.food.icons[opt.value],
      isActive: selectedFoodTypes.includes(opt.value),
    }));
  }, [selectedFoodTypes]);

  // 상황 옵션 구성
  const situationOptions = useMemo(() => {
    return FILTER_FULL_CONFIG.situation.options.map(opt => ({
      ...opt,
      icon: FILTER_FULL_CONFIG.situation.icons[opt.value],
      isActive: selectedSituation === opt.value,
    }));
  }, [selectedSituation]);

  return { foodOptions, situationOptions };
}
