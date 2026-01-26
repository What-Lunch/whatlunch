import { useMemo } from 'react';

import { Category, Context } from '@/types/enum';

const FOOD_ICONS = {
  [Category.ALL]: '🍽️',
  [Category.BEST]: '⭐',
  [Category.CHINESE]: '🍜',
  [Category.WESTERN]: '🍔',
  [Category.JAPANESE]: '🍣',
  [Category.KOREAN]: '🍚',
  [Category.SNACK]: '🌭',
};

const SITUATION_ICONS = {
  [Context.LUNCH]: '🍱',
  [Context.SOLO]: '🙋‍♂️',
  [Context.GROUP]: '🍻',
  [Context.DIET]: '🥗',
  [Context.DATE]: '💖',
  [Context.STRESS]: '😡',
};

interface FilterOption {
  value: string;
  label: string;
  icon: string;
  isActive: boolean;
}

export function useFilterOptions(
  selectedFoodTypes: Category | null,
  selectedSituation: Context | null
): {
  foodOptions: FilterOption[];
  situationOptions: FilterOption[];
} {
  const foodOptions = useMemo(() => {
    const categories: Category[] = [
      Category.ALL,
      Category.KOREAN,
      Category.CHINESE,
      Category.JAPANESE,
      Category.WESTERN,
      Category.SNACK,
      Category.BEST,
    ];

    return categories.map(cat => ({
      value: cat,
      label: cat,
      icon: FOOD_ICONS[cat],
      isActive: selectedFoodTypes === cat,
    }));
  }, [selectedFoodTypes]);

  const situationOptions = useMemo(() => {
    const contexts: Context[] = [
      Context.GROUP,
      Context.DATE,
      Context.DIET,
      Context.LUNCH,
      Context.SOLO,
      Context.STRESS,
    ];

    return contexts.map(ctx => ({
      value: ctx,
      label: ctx,
      icon: SITUATION_ICONS[ctx],
      isActive: selectedSituation === ctx,
    }));
  }, [selectedSituation]);

  return { foodOptions, situationOptions };
}
