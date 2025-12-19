import { FILTER_CONFIG } from './filters';
import { FOOD_ICONS, SITUATION_ICONS } from './icons';

export const DEFAULT_IMAGE = '/foods/noimg.png';

export const FILTER_FULL_CONFIG = {
  food: {
    ...FILTER_CONFIG.food,
    icons: FOOD_ICONS,
  },
  situation: {
    ...FILTER_CONFIG.situation,
    icons: SITUATION_ICONS,
  },
} as const;

export * from './filters';
export * from './icons';
