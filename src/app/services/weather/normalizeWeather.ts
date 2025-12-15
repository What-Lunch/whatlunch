import type { WeatherData } from '@/types/api/weather';
import type { AirPollutionData } from '@/types/api/airPollution';

// 날씨 데이터 정규화
export function normalizeWeather(data: WeatherData): WeatherData {
  return {
    ...data,
    weather:
      data.weather && data.weather.length > 0
        ? data.weather
        : [{ main: 'Clear', description: 'Unknown', icon: '01d' }],
    clouds: { all: data.clouds?.all ?? 0 },
  };
}

// 대기오염 데이터 정규화
export function normalizeAir(data?: AirPollutionData): AirPollutionData {
  if (!data || !Array.isArray(data.list) || data.list.length === 0) {
    return createFallbackAir();
  }

  const first = data.list[0];
  const comp = first.components ?? {};

  return {
    ...data,
    list: [
      {
        ...first,
        main: { aqi: first.main?.aqi ?? 1 },
        components: {
          pm2_5: comp.pm2_5 ?? -1,
          pm10: comp.pm10 ?? -1,
          o3: comp.o3 ?? -1,
          no2: comp.no2 ?? -1,
          so2: comp.so2 ?? -1,
          co: comp.co ?? -1,
        },
      },
    ],
  };
}

// 대기오염 데이터 fallback
function createFallbackAir(): AirPollutionData {
  return {
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
