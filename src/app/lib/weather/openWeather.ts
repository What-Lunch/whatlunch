import type { AirPollutionData } from '@/types/api/airPollution';
import type { WeatherData } from '@/types/api/weather';

import { WEATHER_API_KEY } from './env';
import { toLocKeyParts } from './timeSlotCache';

const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// 현재 날씨 정보 조회 - 좌표를 toFixed 캐시 키로 통일
export async function fetchWeather(
  lat: number,
  lon: number,
  revalidateSeconds: number
): Promise<WeatherData> {
  const { fixedLat, fixedLon } = toLocKeyParts(lat, lon);

  const url =
    `${BASE_URL}/weather` +
    `?lat=${fixedLat}` +
    `&lon=${fixedLon}` +
    `&appid=${WEATHER_API_KEY}` +
    `&units=metric` +
    `&lang=kr`;

  const res = await fetch(url, {
    next: { revalidate: revalidateSeconds },
  });

  if (!res.ok) {
    throw new Error(`Weather fetch failed: ${res.status}`);
  }

  return res.json();
}

// 대기 오염 정보 조회 - 날씨와 동일한 좌표 캐시 정책 사용
export async function fetchAirPollution(
  lat: number,
  lon: number,
  revalidateSeconds: number
): Promise<AirPollutionData> {
  const { fixedLat, fixedLon } = toLocKeyParts(lat, lon);

  const url =
    `${BASE_URL}/air_pollution` +
    `?lat=${fixedLat}` +
    `&lon=${fixedLon}` +
    `&appid=${WEATHER_API_KEY}`;

  const res = await fetch(url, {
    next: { revalidate: revalidateSeconds },
  });

  if (!res.ok) {
    throw new Error(`Air pollution fetch failed: ${res.status}`);
  }

  return res.json();
}
