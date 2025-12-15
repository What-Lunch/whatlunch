import { useCallback, useEffect, useRef, useState } from 'react';

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

const GEO_WAIT_TIMEOUT_MS = 2500;
// 사용자 위치 가져오기(빠른 응답 우선 옵션)
function getUserLocation(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('GEO_NOT_SUPPORTED'));
      return;
    }

    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: false, // 속도 우선
      maximumAge: 60_000, // 1분 내 캐시 위치 허용
    });
  });
}
// 위치 팝업 대기 방지를 위한 타임아웃
function withTimeout<T>(promise: Promise<T>, ms: number, code: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = window.setTimeout(() => reject(new Error(code)), ms);

    promise
      .then(v => {
        window.clearTimeout(timer);
        resolve(v);
      })
      .catch(e => {
        window.clearTimeout(timer);
        reject(e);
      });
  });
}

// UI 표시용 에러 메시지 정규화
function parseErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return '알 수 없는 오류가 발생했습니다.';
}

export function useWeather() {
  const [state, setState] = useState<WeatherState>({
    weather: null,
    air: null,
    error: null,
    loading: true,
    usedUserLocation: false,
  });

  // 최신 요청만 반영
  const requestIdRef = useRef(0);

  const fetchWeatherApi = useCallback(async (params?: { lat: number; lon: number }) => {
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
    requestIdRef.current += 1;
    const rid = requestIdRef.current;

    // 이전 실행 결과 반영을 막기 위한 스테일 체크
    const isStale = () => requestIdRef.current !== rid;

    const setSuccessState = (data: WeatherApiResponse, usedUserLocation: boolean) => {
      setState({
        weather: data.weather,
        air: data.air,
        error: null,
        loading: false,
        usedUserLocation,
      });
    };

    const setErrorState = (error: unknown) => {
      setState({
        weather: null,
        air: null,
        error: parseErrorMessage(error),
        loading: false,
        usedUserLocation: false,
      });
    };

    async function load() {
      // 기본(서울) 먼저 표시
      setState(prev => ({ ...prev, loading: true, error: null }));

      // 위치를 먼저 시도하고 실패 시 서울로 폴백
      try {
        const pos = await withTimeout(getUserLocation(), GEO_WAIT_TIMEOUT_MS, 'GEO_WAIT_TIMEOUT');
        if (isStale()) return;

        const lat = Number(pos.coords.latitude);
        const lon = Number(pos.coords.longitude);
        if (Number.isFinite(lat) && Number.isFinite(lon)) {
          const data = await fetchWeatherApi({ lat, lon });
          if (isStale()) return;

          setSuccessState(data, true);
          return;
        }
      } catch {
        // 위치 실패 시 서울 데이터 유지
      }

      try {
        const data = await fetchWeatherApi();
        if (isStale()) return;

        setSuccessState(data, false);
      } catch (error) {
        if (isStale()) return;

        setErrorState(error);
      }
    }

    load();

    return () => {
      // requestId로 스테일 처리하므로 별도 cleanup 작업은 불필요
    };
  }, [fetchWeatherApi]);

  return state;
}
