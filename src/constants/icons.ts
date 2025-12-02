import { FoodTypeFilter, SituationFilter } from '../types/filters';

export const FOOD_TYPE_ICONS: Record<FoodTypeFilter, string> = {
  전체: '',
  베스트: '⭐',
  중식: '🍜',
  양식: '🍔',
  일식: '🍣',
  한식: '🍚',
  분식: '🌭',
};

export const SITUATION_ICONS: Record<SituationFilter, string> = {
  점심: '🍱',
  혼밥: '🙋‍♂️',
  회식: '🍻',
  다이어트: '🥗',
  데이트: '💖',
  '스트레스 받을 때': '😡',
};
