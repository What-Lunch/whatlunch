import type { MenuSummaryData } from './types';

export const MENU_SUMMARY_MOCK = {
  items: [
    { id: 'category', title: '가장 많이 선택한 카테고리', value: '한식 (42%)', percentage: 42 },
    { id: 'mealTier', title: '평균 식사 기준', value: '보통 한 끼 식사를 가장 자주 선택해요.' },
    { id: 'time', title: '선호하는 시간대', value: '주로 저녁 시간대(18:00~20:00)에 식사해요.' },
    { id: 'style', title: '식사 스타일', value: '혼밥 위주의 식사 패턴이에요.' },
  ],
} satisfies MenuSummaryData;
