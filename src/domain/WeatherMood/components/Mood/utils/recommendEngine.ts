// 배열 섞기 (Fisher–Yates)
function shuffleArray<T>(list: T[]): T[] {
  const result = [...list];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

// 추천 생성 (셔플 + 최근 제외 + 고정된 결과)
export function generateRecommendations(
  sourceMenus: string[],
  recentMenus: string[] = [],
  limit = 6
): string[] {
  // 최근 추천 메뉴 제외
  const filteredMenus = sourceMenus.filter(menu => !recentMenus.includes(menu));

  // 추천 개수가 부족하면 전체 메뉴 사용
  const menuPool = filteredMenus.length >= limit ? filteredMenus : sourceMenus;

  // 한 번만 섞기
  const shuffledMenus = shuffleArray(menuPool);

  // 앞에서 limit개 선택
  return shuffledMenus.slice(0, limit);
}
