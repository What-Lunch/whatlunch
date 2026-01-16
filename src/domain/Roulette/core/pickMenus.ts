import { MenuItem } from '../utils/menuItem';
import { Category, Context } from '@/types/enum';
import { shuffleMenus } from './shuffleMenus';

const pickCache = new Map<string, MenuItem[]>(); // 필터 조합(types + situation)에 따른 결과 메뉴 배열 캐싱
const MAX_RESULTS = 8; // UX 상 룰렛 섹션을 8개로 고정하기 위한 상수

// 캐시 키 생성: Type 배열은 정렬하여 순서 차이 제거
function makeCacheKey(types: Category[] | null, situation: Context | null) {
  const sortedTypes = types ? [...types].sort() : null;
  return JSON.stringify({ types: sortedTypes, situation });
}

export function pickMenus(types: Category[] | null, situation: Context | null): MenuItem[] {
  const key = makeCacheKey(types, situation);

  // 캐싱된 결과 반환
  const cached = pickCache.get(key);
  if (cached) return cached;

  const hasType = Array.isArray(types) && types.length > 0;
  const hasSituation = typeof situation === 'string';

  let pool: MenuItem[] = MENU_DATA;

  // 1차 필터링 (타입 + 상황)
  if (hasType) {
    pool = pool.filter(item => types!.includes(item.type));
  }

  if (hasSituation) {
    pool = pool.filter(item => item.situations.includes(situation!));
  }

  // 결과가 없으면 필터를 완화
  if (pool.length === 0) {
    // 타입 필터 제거하고 상황만 유지
    if (hasSituation) {
      const fallbackBySituation = MENU_DATA.filter(item => item.situations.includes(situation!));

      if (fallbackBySituation.length > 0) {
        pool = fallbackBySituation;
      }
    }

    // 없으면 전체 메뉴
    if (pool.length === 0) {
      pool = MENU_DATA;
    }
  }

  // 결과 생성 + 캐싱
  const result = shuffleMenus(pool).slice(0, MAX_RESULTS);

  pickCache.set(key, result);
  return result;
}
