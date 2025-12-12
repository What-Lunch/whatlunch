import { useState, useEffect, useCallback } from 'react';

import type { WeatherData } from '@/types/api/weather';
import type { AirPollutionData } from '@/types/api/airPollution';

// 날씨 API에서 내려오는 응답 구조
interface WeatherApiResponse {
  weather: WeatherData;
  air: AirPollutionData; // 공기오염 정보
}

// useWeather 훅에서 관리하는 상태 구조
interface WeatherState {
  weather: WeatherData | null;
  air: AirPollutionData | null;
  error: string | null;
  loading: boolean;
}

// 사용자 위치 정보 요청
function getUserLocation(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('GEO_NOT_SUPPORTED'));
      return;
    }

    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 5000,
    });
  });
}

export function useWeather() {
  const [state, setState] = useState<WeatherState>({
    weather: null,
    air: null,
    error: null,
    loading: true,
  });

  // 날씨 + 공기질 데이터 요청 함수
  const fetchWeather = useCallback(async (params?: { lat: number; lon: number }) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    // 새로운 요청 시작 → 로딩 상태로 변경

    try {
      // 위치 정보가 있으면 해당 좌표, 없으면 기본 지역 요청
      const url = params ? `/api/weather?lat=${params.lat}&lon=${params.lon}` : `/api/weather`;

      const res = await fetch(url);
      if (!res.ok) throw new Error(`API_ERROR_${res.status}`);

      const json: WeatherApiResponse = await res.json();
      if (!json.weather || !json.air) throw new Error('INVALID_WEATHER_DATA');

      return json;
    } catch (error) {
      throw error;
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    // 컴포넌트가 아직 화면에 있는지 체크

    async function load() {
      try {
        const pos = await getUserLocation();
        if (!isMounted) return;

        const data = await fetchWeather({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        });

        if (isMounted) {
          setState({
            weather: data.weather,
            air: data.air,
            error: null,
            loading: false,
          });
        }
      } catch {
        // 위치 실패 시 기본 지역으로 요청
        try {
          const data = await fetchWeather();

          if (isMounted) {
            setState({
              weather: data.weather,
              air: data.air,
              error: null,
              loading: false,
            });
          }
        } catch (err) {
          if (isMounted) {
            setState(prev => ({
              ...prev,
              error: parseErrorMessage(err),
              loading: false,
            }));
          }
        }
      }
    }

    load();

    return () => {
      isMounted = false; // 컴포넌트가 사라졌음을 표시
    };
  }, [fetchWeather]);

  return state;
}

// 에러 타입을 문자열로 변환
function parseErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return '알 수 없는 오류가 발생했습니다.';
}
