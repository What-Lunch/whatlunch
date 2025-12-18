import { FoodTypeFilter, FOOD_TYPE } from '@/domain/Roulette/constants/filters';

// 음식 필터 토글
export function toggleFoodWithAll(
  prev: FoodTypeFilter[],
  toggled: FoodTypeFilter
): FoodTypeFilter[] {
  const isAll = toggled === FOOD_TYPE.ALL;
  const hasAll = prev.includes(FOOD_TYPE.ALL);
  const isSelected = prev.includes(toggled);

  // 항상 ALL 단독만 유지
  if (isAll) {
    return [FOOD_TYPE.ALL];
  }

  // 기존에 ALL만 선택되어 있었다면 → 개별 선택으로 대체
  if (hasAll) {
    return [toggled];
  }

  // 이미 선택된 타입을 해제하는 경우
  if (isSelected) {
    const next = prev.filter(type => type !== toggled);
    // 모든 타입이 해제되면 ALL로 복귀
    return next.length > 0 ? next : [FOOD_TYPE.ALL];
  }

  // 새로운 타입을 추가하는 경우
  return [...prev, toggled];
}
