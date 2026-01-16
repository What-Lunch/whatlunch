import { Menu } from '@/types/api';

// 필터 그룹 모드
export type FilterMode = 'food' | 'situation';

// UI 옵션 정의 (label 포함)
export const FILTER_CONFIG = {
  food: {
    label: '음식 종류',
    options: [
      { value: Menu.Category.ALL, label: '전체' },
      { value: Menu.Category.BEST, label: '베스트' },
      { value: Menu.Category.CHINESE, label: '중식' },
      { value: Menu.Category.WESTERN, label: '양식' },
      { value: Menu.Category.JAPANESE, label: '일식' },
      { value: Menu.Category.KOREAN, label: '한식' },
      { value: Menu.Category.SNACK, label: '분식' },
    ],
  },

  situation: {
    label: '상황별',
    options: [
      { value: Menu.Context.LUNCH, label: '점심' },
      { value: Menu.Context.SOLO, label: '혼밥' },
      { value: Menu.Context.GROUP, label: '회식' },
      { value: Menu.Context.DIET, label: '다이어트' },
      { value: Menu.Context.DATE, label: '데이트' },
      { value: Menu.Context.STRESS, label: '스트레스' },
    ],
  },
} as const;
