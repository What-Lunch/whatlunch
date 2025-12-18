// Food 타입 정의 & 상수
export const FOOD_TYPE = {
  ALL: 'all',
  BEST: 'best',
  CHINESE: 'chinese',
  WESTERN: 'western',
  JAPANESE: 'japanese',
  KOREAN: 'korean',
  SNACK: 'snack',
} as const;

export type FoodTypeFilter = (typeof FOOD_TYPE)[keyof typeof FOOD_TYPE];

// Situation 타입 정의 & 상수
export const SITUATION_TYPE = {
  LUNCH: 'lunch',
  SOLO: 'solo',
  PARTY: 'party',
  DIET: 'diet',
  DATE: 'date',
  STRESS: 'stress',
} as const;

export type SituationFilter = (typeof SITUATION_TYPE)[keyof typeof SITUATION_TYPE];

// 필터 그룹 모드
export type FilterMode = 'food' | 'situation';

// UI 옵션 정의 (label 포함)
export const FILTER_CONFIG = {
  food: {
    label: '음식 종류',
    options: [
      { value: FOOD_TYPE.ALL, label: '전체' },
      { value: FOOD_TYPE.BEST, label: '베스트' },
      { value: FOOD_TYPE.CHINESE, label: '중식' },
      { value: FOOD_TYPE.WESTERN, label: '양식' },
      { value: FOOD_TYPE.JAPANESE, label: '일식' },
      { value: FOOD_TYPE.KOREAN, label: '한식' },
      { value: FOOD_TYPE.SNACK, label: '분식' },
    ],
  },

  situation: {
    label: '상황별',
    options: [
      { value: SITUATION_TYPE.LUNCH, label: '점심' },
      { value: SITUATION_TYPE.SOLO, label: '혼밥' },
      { value: SITUATION_TYPE.PARTY, label: '회식' },
      { value: SITUATION_TYPE.DIET, label: '다이어트' },
      { value: SITUATION_TYPE.DATE, label: '데이트' },
      { value: SITUATION_TYPE.STRESS, label: '스트레스' },
    ],
  },
} as const;
