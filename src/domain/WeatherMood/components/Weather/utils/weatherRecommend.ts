import type { TempGroup } from '@/domain/WeatherMood/components/Weather/constants/recommend';

import type { WeatherMain } from '@/types/api/weather'; // OpenWeather API에서 사용하는 날씨 상태 타입

import { TEMP_BOUNDARY } from '@/domain/WeatherMood/components/Weather/constants/recommend';
import { fallbackMenus } from '@/domain/WeatherMood/components/Weather/constants/recommend';
import { tempMenus } from '@/domain/WeatherMood/components/Weather/constants/recommend';
import { weatherMenus } from '@/domain/WeatherMood/components/Weather/constants/recommend';
import { MIN_RECOMMEND_COUNT } from '@/domain/WeatherMood/components/Weather/constants/recommend';

// 온도값을 tempMenus의 구간으로 매핑
export function getTempGroup(temp: number): TempGroup {
  if (temp <= TEMP_BOUNDARY.cold) return 'cold';
  if (temp <= TEMP_BOUNDARY.cool) return 'cool';
  if (temp <= TEMP_BOUNDARY.mild) return 'mild';
  if (temp <= TEMP_BOUNDARY.warm) return 'warm';
  return 'hot';
}

// 배열에서 랜덤으로 지정 개수 추출 (Fisher–Yates 기반)
export function pickRandom<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count);
}

// 최종 추천 메뉴 생성
export function makeFinalRecommend(weather: WeatherMain, temp: number): string[] {
  const tempGroup = getTempGroup(temp);

  const weatherMenu = weatherMenus[weather] ?? fallbackMenus;
  const tempMenu = tempMenus[tempGroup] ?? fallbackMenus;

  // 메뉴 합치기 + 중복 제거
  const unique = Array.from(new Set(tempMenu.concat(weatherMenu)));

  // 최소 메뉴 개수 보장
  const safeMenus =
    unique.length >= MIN_RECOMMEND_COUNT
      ? unique
      : Array.from(new Set(unique.concat(fallbackMenus)));

  // 랜덤으로 N개 추출
  return pickRandom(safeMenus, MIN_RECOMMEND_COUNT);
}
