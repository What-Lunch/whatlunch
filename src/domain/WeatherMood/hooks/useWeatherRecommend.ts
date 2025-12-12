import { useEffect, useState } from 'react';

import { createRecommendKey } from '@/domain/WeatherMood/components/Weather/utils/createRecommendKey';
import { makeFinalRecommend } from '@/domain/WeatherMood/components/Weather/utils/weatherRecommend';
import { getTempGroup } from '@/domain/WeatherMood/components/Weather/utils/weatherRecommend';

import type { WeatherMain } from '@/types/api/weather';

interface WeatherRecommendState {
  menus: string[] | null; // 추천 메뉴
  loading: boolean;
}

// 날씨 데이터 기반으로 추천 메뉴를 계산하고 캐시까지 처리하는 훅
export function useWeatherRecommend(weather: WeatherMain | null, temp: number | null) {
  const [state, setState] = useState<WeatherRecommendState>({
    menus: null,
    loading: true,
  });

  useEffect(() => {
    // 추천 계산에 필요한 값이 아직 준비되지 않은 경우
    if (!weather || temp === null) {
      setState({ menus: null, loading: true });
      return;
    }

    // 날씨 + 온도 그룹 기준으로 추천 캐시 key 생성
    const key = createRecommendKey(weather, getTempGroup(temp));

    try {
      // localStorage에 저장된 추천 결과가 있는지 확인
      const cached = window.localStorage.getItem(key);

      if (cached) {
        setState({
          menus: JSON.parse(cached),
          loading: false,
        });
        return;
      }

      // 캐시가 없으면 추천 로직 실행
      const result = makeFinalRecommend(weather, temp);

      // 추천 결과를 localStorage에 저장
      window.localStorage.setItem(key, JSON.stringify(result));

      setState({
        menus: result,
        loading: false,
      });
    } catch {
      setState({ menus: null, loading: false });
    }
  }, [weather, temp]);

  return state;
}
