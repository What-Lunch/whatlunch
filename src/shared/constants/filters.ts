import { FOOD_TYPE_ICONS, SITUATION_ICONS } from './icons';

export const FILTER_CONFIG = {
  food: {
    label: '음식 종류',
    options: [
      { value: '전체', label: '전체' },
      { value: '베스트', label: '베스트' },
      { value: '중식', label: '중식' },
      { value: '양식', label: '양식' },
      { value: '일식', label: '일식' },
      { value: '한식', label: '한식' },
      { value: '분식', label: '분식' },
    ],
    icons: FOOD_TYPE_ICONS,
  },

  situation: {
    label: '상황별',
    options: [
      { value: '점심', label: '점심' },
      { value: '혼밥', label: '혼밥' },
      { value: '회식', label: '회식' },
      { value: '다이어트', label: '다이어트' },
      { value: '데이트', label: '데이트' },
      { value: '스트레스 받을 때', label: '스트레스 받을 때' },
    ],
    icons: SITUATION_ICONS,
  },
} as const;

// 모드 타입 자동 생성
export type FilterMode = keyof typeof FILTER_CONFIG;

// 음식 필터 타입 자동 생성
export type FoodTypeFilter = (typeof FILTER_CONFIG.food.options)[number]['value'];

// 상황 필터 타입 자동 생성
export type SituationFilter = (typeof FILTER_CONFIG.situation.options)[number]['value'];
