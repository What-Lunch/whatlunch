import type { MealDecisionItem } from './types';

export const RECENT_MEAL_DECISIONS_MOCK: readonly MealDecisionItem[] = [
  { id: 'm1', menuName: '삼겹살', decidedAt: '2025.12.22 18:30' },
  { id: 'm2', menuName: '파스타', decidedAt: '2025.12.21 12:15' },
  { id: 'm3', menuName: '초밥', decidedAt: '2025.12.20 19:00' },
  { id: 'm4', menuName: '돈까쓰1', decidedAt: '2025.12.18 19:00' },
  { id: 'm4', menuName: '돈까쓰2', decidedAt: '2025.12.18 19:00' },
  { id: 'm4', menuName: '돈까쓰3', decidedAt: '2025.12.18 19:00' },
  { id: 'm4', menuName: '돈까쓰4', decidedAt: '2025.12.18 19:00' },
] as const;
