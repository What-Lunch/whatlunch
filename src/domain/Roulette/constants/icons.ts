import { FOOD_TYPE, FoodTypeFilter, SITUATION_TYPE, SituationFilter } from './filters';

// Food 아이콘 자동 연결
export const FOOD_ICONS: Record<FoodTypeFilter, string> = {
  [FOOD_TYPE.ALL]: '🍽️',
  [FOOD_TYPE.BEST]: '⭐',
  [FOOD_TYPE.CHINESE]: '🍜',
  [FOOD_TYPE.WESTERN]: '🍔',
  [FOOD_TYPE.JAPANESE]: '🍣',
  [FOOD_TYPE.KOREAN]: '🍚',
  [FOOD_TYPE.SNACK]: '🌭',
};

// Situation 아이콘 자동 연결
export const SITUATION_ICONS: Record<SituationFilter, string> = {
  [SITUATION_TYPE.LUNCH]: '🍱',
  [SITUATION_TYPE.SOLO]: '🙋‍♂️',
  [SITUATION_TYPE.PARTY]: '🍻',
  [SITUATION_TYPE.DIET]: '🥗',
  [SITUATION_TYPE.DATE]: '💖',
  [SITUATION_TYPE.STRESS]: '😡',
};
