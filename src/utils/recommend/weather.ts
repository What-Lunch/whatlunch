export const tempMenus: Record<string, string[]> = {
  cold: ['우동', '라멘', '따뜻한 라떼', '미역국', '어묵탕', '부대찌개'],
  cool: ['칼국수', '수제비', '짜장면', '피자', '돈까스'],
  mild: ['김밥', '파스타', '샐러드', '라떼', '카레'],
  warm: ['냉모밀', '아이스라떼', '샐러드', '비빔밥', '잔치국수'],
  hot: ['냉면', '수박주스', '콩국수', '아이스크림', '메밀전병'],
};

export function getTempGroup(temp: number) {
  if (temp <= 5) return 'cold';
  if (temp <= 12) return 'cool';
  if (temp <= 20) return 'mild';
  if (temp <= 27) return 'warm';
  return 'hot';
}

export const weatherMenus: Record<string, string[]> = {
  Clear: ['비빔밥', '샐러드', '냉모밀', '아이스라떼'],
  Clouds: ['칼국수', '수제비', '라멘', '피자'],
  Rain: ['파전', '막걸리', '어묵탕', '우동'],
  Drizzle: ['파전', '잔치국수', '만두국'],
  Thunderstorm: ['부대찌개', '떡볶이', '마라탕'],
  Snow: ['크림스프', '우동', '라떼', '따뜻한 전골'],
  Mist: ['따뜻한 차', '죽', '유부우동'],
};

export function getFinalRecommend(main: string, temp: number): string[] {
  const today = new Date().toISOString().split('T')[0];
  const cacheKey = `dailyRecommend_${today}`;

  const cachedRecommend = localStorage.getItem(cacheKey);
  if (cachedRecommend) {
    return JSON.parse(cachedRecommend);
  }

  const tempGroup = getTempGroup(temp);

  const combinedMenus = Array.from(
    new Set([...(tempMenus[tempGroup] ?? []), ...(weatherMenus[main] ?? [])])
  );

  const selectRandomItems = (menus: string[], count: number) => {
    const pool = [...menus];
    const selected: string[] = [];

    for (let i = 0; i < count && pool.length > 0; i++) {
      const randomIndex = Math.floor(Math.random() * pool.length);
      selected.push(pool[randomIndex]);
      pool.splice(randomIndex, 1);
    }

    return selected;
  };

  const finalRecommend = selectRandomItems(combinedMenus, 6);
  const result = finalRecommend.length > 0 ? finalRecommend : ['추천 준비 중'];
  localStorage.setItem(cacheKey, JSON.stringify(result));

  return result;
}
