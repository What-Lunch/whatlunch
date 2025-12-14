import { NextResponse } from 'next/server';

import type { AirPollutionData } from '@/types/api/airPollution';
import type { WeatherData } from '@/types/api/weather';

// 시간대(morning / evening) 기준으로 12시간 캐싱
const CACHE_DURATION = 12 * 60 * 60 * 1000;

const SEOUL_LAT = 37.5665;
const SEOUL_LON = 126.978;

// 하루를 두 구간으로 나눠 캐시하기 위한 타입
type TimeSlot = 'morning' | 'evening';

// 시간대별 캐시 데이터 구조
interface CacheData {
  weather: WeatherData;
  air: AirPollutionData;
}

// 시간대별 캐시(위치별로 동적)
const cache: Record<TimeSlot, Record<string, CacheData>> = {
  morning: {},
  evening: {},
};

// 캐시 유효성 판단을 위한 시간대별 타임스탬프
const cacheTimestamp: Record<TimeSlot, Record<string, number>> = {
  morning: {},
  evening: {},
};

function getCurrentTimeSlot(): TimeSlot {
  const hour = new Date().getHours();

  // 06 ~ 17 → 오전
  if (hour >= 6 && hour < 18) return 'morning';

  // 18 ~ 다음날 05시 → 저녁
  return 'evening';
}

function getBoundaryEndMs(base: Date) {
  const hour = base.getHours();
  const end = new Date(base);

  // 06:00 ~ 17:59 → 18:00까지 유효
  if (hour >= 6 && hour < 18) {
    end.setHours(18, 0, 0, 0);
    return end.getTime();
  }

  // 18:00 ~ 다음날 05:59 → 다음 06:00까지 유효
  end.setHours(6, 0, 0, 0);

  if (hour >= 18) {
    end.setDate(end.getDate() + 1);
  }

  return end.getTime();
}

function toLocKey(lat: number, lon: number) {
  // 캐시 키 폭발 방지용(소수 2자리)
  const rLat = Math.round(lat * 100) / 100;
  const rLon = Math.round(lon * 100) / 100;
  return `lat${rLat}_lon${rLon}`;
}

export async function GET(request: Request) {
  try {
    const timeSlot = getCurrentTimeSlot();
    const now = Date.now();

    const { searchParams } = new URL(request.url);
    const useUserLocation = searchParams.get('useUserLocation') === 'true';

    const rawLat = Number(searchParams.get('lat'));
    const rawLon = Number(searchParams.get('lon'));

    // 사용자 위치 요청일 때만 좌표 반영(유효하지 않으면 서울 fallback)
    const lat = useUserLocation && Number.isFinite(rawLat) ? rawLat : SEOUL_LAT;
    const lon = useUserLocation && Number.isFinite(rawLon) ? rawLon : SEOUL_LON;

    const locKey = useUserLocation ? toLocKey(lat, lon) : 'seoul';

    const cached = cache[timeSlot][locKey];
    const cachedAt = cacheTimestamp[timeSlot][locKey];

    // 캐시가 유효한지 확인
    const isCacheValid =
      Boolean(cached) &&
      typeof cachedAt === 'number' &&
      now - cachedAt < CACHE_DURATION &&
      now < getBoundaryEndMs(new Date(cachedAt));

    if (isCacheValid) {
      return NextResponse.json(cached);
    }

    const apiKey = process.env.WEATHER_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: '날씨 API 키가 설정되어 있지 않습니다.' }, { status: 500 });
    }

    // 현재 날씨 호출
    const weatherUrl =
      `https://api.openweathermap.org/data/2.5/weather` +
      `?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=kr`;

    // 배포 환경에서 캐시 안정성(선택): 12시간 revalidate
    const weatherRes = await fetch(weatherUrl, { next: { revalidate: 60 * 60 * 12 } });

    if (!weatherRes.ok) {
      return NextResponse.json({ error: 'weather fetch failed' }, { status: weatherRes.status });
    }

    const weatherData: WeatherData = await weatherRes.json();

    // fallback 처리
    if (!weatherData.weather || weatherData.weather.length === 0) {
      weatherData.weather = [{ main: 'Clear', description: 'Unknown', icon: '01d' }];
    }

    weatherData.clouds = { all: weatherData.clouds?.all ?? 0 };

    // 대기 오염 호출
    const airUrl =
      `https://api.openweathermap.org/data/2.5/air_pollution` +
      `?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    const airRes = await fetch(airUrl, { next: { revalidate: 60 * 60 * 12 } });

    let airData: AirPollutionData;

    if (airRes.ok) {
      airData = await airRes.json();

      // list가 없거나 비어있으면 기본 엔트리 생성
      if (!Array.isArray(airData.list) || airData.list.length === 0) {
        airData.list = [
          {
            main: { aqi: 1 },
            components: {
              pm2_5: -1,
              pm10: -1,
              o3: -1,
              no2: -1,
              so2: -1,
              co: -1,
            },
          },
        ];
      }

      const comp = airData.list[0].components ?? {};

      // 여기부터는 list[0] 존재가 보장되니 안전
      airData.list[0].components = {
        pm2_5: comp.pm2_5 ?? -1,
        pm10: comp.pm10 ?? -1,
        o3: comp.o3 ?? -1,
        no2: comp.no2 ?? -1,
        so2: comp.so2 ?? -1,
        co: comp.co ?? -1,
      };

      // aqi가 혹시 없으면 보정
      airData.list[0].main = { aqi: airData.list[0].main?.aqi ?? 1 };
    } else {
      airData = {
        list: [
          {
            main: { aqi: 1 },
            components: {
              pm2_5: -1,
              pm10: -1,
              o3: -1,
              no2: -1,
              so2: -1,
              co: -1,
            },
          },
        ],
      };
    }

    const responseData: CacheData = { weather: weatherData, air: airData };

    // 캐싱 저장
    cache[timeSlot][locKey] = responseData;
    cacheTimestamp[timeSlot][locKey] = now;

    return NextResponse.json(responseData);
  } catch (error) {
    return NextResponse.json({ error: 'server crash', detail: String(error) }, { status: 500 });
  }
}
