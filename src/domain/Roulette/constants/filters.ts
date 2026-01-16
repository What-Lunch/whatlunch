import { Category, Context } from '@/types/enum';

export type FilterMode = 'food' | 'situation';

export const FILTER_CONFIG = {
  food: {
    label: '음식 종류',
    options: [
      { value: Category.ALL, label: '전체' },
      { value: Category.BEST, label: '베스트' },
      { value: Category.CHINESE, label: '중식' },
      { value: Category.WESTERN, label: '양식' },
      { value: Category.JAPANESE, label: '일식' },
      { value: Category.KOREAN, label: '한식' },
      { value: Category.SNACK, label: '분식' },
    ],
  },

  situation: {
    label: '상황별',
    options: [
      { value: Context.LUNCH, label: '점심' },
      { value: Context.SOLO, label: '혼밥' },
      { value: Context.GROUP, label: '회식' },
      { value: Context.DIET, label: '다이어트' },
      { value: Context.DATE, label: '데이트' },
      { value: Context.STRESS, label: '스트레스' },
    ],
  },
} as const;
