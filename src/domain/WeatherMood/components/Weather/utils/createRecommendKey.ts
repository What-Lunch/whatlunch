import type { WeatherMain } from '@/types/api/weather';

import type { TempGroup } from '@/domain/WeatherMood/components/Weather/constants/recommend';
import type { TimeSlot } from '@/domain/WeatherMood/components/Weather/constants/timeSlot';

// Weather 추천 결과를 캐시하기 위한 key 생성
export function createRecommendKey(
  weather: WeatherMain,
  tempGroup: TempGroup,
  timeSlot: TimeSlot
): string {
  return `recommend_${weather}_${tempGroup}_${timeSlot}`;
}
