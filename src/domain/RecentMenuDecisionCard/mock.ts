import type { MealDecisionItem } from './types';

export const RECENT_MEAL_DECISIONS_MOCK: readonly MealDecisionItem[] = [
  { id: 'm1', menuName: '삼겹살', decidedAt: '2025.12.22 18:30' },
  { id: 'm2', menuName: '파스타', decidedAt: '2025.12.21 12:15' },
  { id: 'm3', menuName: '초밥', decidedAt: '2025.12.20 19:00' },
  { id: 'm4', menuName: '김치찌개', decidedAt: '2025.12.18 19:00' },
  { id: 'm5', menuName: '우동', decidedAt: '2025.12.18 19:00' },
  { id: 'm6', menuName: '라멘', decidedAt: '2025.12.18 19:00' },
  { id: 'm7', menuName: '피자', decidedAt: '2025.12.18 19:00' },
] as const;
