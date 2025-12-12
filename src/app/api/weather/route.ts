import { NextResponse } from 'next/server';
import type { WeatherData } from '@/types/api/weather';
import type { AirPollutionData } from '@/types/api/airPollution';

// 시간대(morning / evening) 기준으로 12시간 캐싱
const CACHE_DURATION = 12 * 60 * 60 * 1000;

// 하루를 두 구간으로 나눠 캐시하기 위한 타입
type TimeSlot = 'morning' | 'evening';

// 시간대별 캐시 데이터 구조
interface CacheData {
  weather: WeatherData;
  air: AirPollutionData;
}

// 다른 위치 요청이어도 같은 캐시 사용됨
const cache: Record<TimeSlot, CacheData | null> = {
  morning: null,
  evening: null,
};

const cacheTimestamp: Record<TimeSlot, number | null> = {
  morning: null,
  evening: null,
};

function getCurrentTimeSlot(): TimeSlot {
  const hour = new Date().getHours();

  // 06 ~ 17 → morning
  if (hour >= 6 && hour < 18) return 'morning';

  // 18 ~ 다음날 05 → evening
  return 'evening';
}

export async function GET(request: Request) {
  try {
    const timeSlot = getCurrentTimeSlot();
    const now = Date.now();

    const { searchParams } = new URL(request.url);
    const lat = Number(searchParams.get('lat') ?? 37.5665);
    const lon = Number(searchParams.get('lon') ?? 126.978);

    const cached = cache[timeSlot];
    const cachedAt = cacheTimestamp[timeSlot];

    // 캐시가 유효한지 확인
    const isCacheValid = cached && cachedAt && now - cachedAt < CACHE_DURATION;

    if (isCacheValid) {
      return NextResponse.json(cached);
    }

    const apiKey = process.env.WEATHER_API_KEY!;

    // 현재 날씨 호출
    const weatherUrl =
      `https://api.openweathermap.org/data/2.5/weather` +
      `?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=kr`;

    const weatherRes = await fetch(weatherUrl);
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

    const airRes = await fetch(airUrl);

    let airData: AirPollutionData;

    if (airRes.ok) {
      airData = await airRes.json();
      const comp = airData.list?.[0]?.components ?? {};
      airData.list[0].components = {
        pm2_5: comp.pm2_5 ?? -1,
        pm10: comp.pm10 ?? -1,
        o3: comp.o3 ?? -1,
        no2: comp.no2 ?? -1,
        so2: comp.so2 ?? -1,
        co: comp.co ?? -1,
      };
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

    // 캐싱 저장
    cache[timeSlot] = { weather: weatherData, air: airData };
    cacheTimestamp[timeSlot] = now;

    return NextResponse.json({ weather: weatherData, air: airData });
  } catch (error) {
    return NextResponse.json({ error: 'server crash', detail: String(error) }, { status: 500 });
  }
}
