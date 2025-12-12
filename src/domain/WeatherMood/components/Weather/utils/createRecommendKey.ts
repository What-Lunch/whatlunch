import type { WeatherMain } from '@/types/api/weather';

import type { TempGroup } from '@/domain/WeatherMood/components/Weather/constants/recommend';

// Weather 추천 결과를 캐시하기 위한 key 생성
export function createRecommendKey(weather: WeatherMain, tempGroup: TempGroup): string {
  return `recommend_${weather}_${tempGroup}`;
}
