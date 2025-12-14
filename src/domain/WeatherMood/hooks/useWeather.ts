import { useCallback, useEffect, useState } from 'react';

import type { AirPollutionData } from '@/types/api/airPollution';
import type { WeatherData } from '@/types/api/weather';

// API 응답 타입(날씨 + 대기)
interface WeatherApiResponse {
  weather: WeatherData;
  air: AirPollutionData;
}

// useWeather 상태 타입
interface WeatherState {
  weather: WeatherData | null;
  air: AirPollutionData | null;
  error: string | null;
  loading: boolean;
  usedUserLocation: boolean;
}

// 사용자 위치 가져오기(빠른 응답 우선 옵션)
function getUserLocation(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('GEO_NOT_SUPPORTED'));
      return;
    }

    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: false, // 속도 우선
      timeout: 6000,
      maximumAge: 60_000, // 1분 내 캐시 위치 허용
    });
  });
}

export function useWeather() {
  const [state, setState] = useState<WeatherState>({
    weather: null,
    air: null,
    error: null,
    loading: true,
    usedUserLocation: false,
  });

  const fetchWeather = useCallback(async (params?: { lat: number; lon: number }) => {
    // 위치 파라미터가 있으면 사용자 위치 API, 없으면 기본(서울) API
    const url = params
      ? `/api/weather?useUserLocation=true&lat=${encodeURIComponent(String(params.lat))}&lon=${encodeURIComponent(
          String(params.lon)
        )}`
      : `/api/weather`;

    const res = await fetch(url);
    if (!res.ok) throw new Error(`API_ERROR_${res.status}`);

    const json: WeatherApiResponse = await res.json();
    if (!json.weather || !json.air) throw new Error('INVALID_WEATHER_DATA');

    return json;
  }, []);

  useEffect(() => {
    let isMounted = true; // 언마운트 후 setState 방지

    async function load() {
      // 기본(서울) 먼저 표시
      setState(prev => ({ ...prev, loading: true, error: null }));

      try {
        const base = await fetchWeather();
        if (!isMounted) return;

        setState({
          weather: base.weather,
          air: base.air,
          error: null,
          loading: false, // 서울 데이터로 먼저 화면 오픈
          usedUserLocation: false,
        });
      } catch (error) {
        if (!isMounted) return;

        setState(prev => ({
          ...prev,
          error: parseErrorMessage(error),
          loading: false,
          usedUserLocation: false,
        }));
        return; // 기본 데이터 실패 시 종료
      }

      // 사용자 위치로 성공시에만 덮어쓰기
      try {
        const pos = await getUserLocation();
        if (!isMounted) return;

        const lat = Number(pos.coords.latitude);
        const lon = Number(pos.coords.longitude);
        if (!Number.isFinite(lat) || !Number.isFinite(lon)) return;

        const data = await fetchWeather({ lat, lon });
        if (!isMounted) return;

        setState({
          weather: data.weather,
          air: data.air,
          error: null,
          loading: false,
          usedUserLocation: true,
        });
      } catch {
        // 위치 실패 시 서울 데이터 유지
      }
    }

    load();

    return () => {
      isMounted = false;
    };
  }, [fetchWeather]);

  return state;
}

function parseErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return '알 수 없는 오류가 발생했습니다.';
}
