import type { Metadata } from 'next';
import type { CarouselItem } from '@/shared/components/Carousel';
import { menusServiceServer } from '@/services/backend/menus.api';
import { mapTopFavoritesToCarousel } from '@/shared/utils/mapTopFavoritesToCarousel';
import { fetchAirPollution, fetchWeather } from '@/services/weather/openWeather';
import { normalizeAir, normalizeWeather } from '@/services/weather/normalizeWeather';
import { secondsUntilNextKstBoundary } from '@/services/weather/timeSlotCache';
import type { WeatherApiResponse } from '@/features/WeatherMood/hooks/useWeather';

import MainClient from './MainClient';

export const metadata: Metadata = {
  title: {
    absolute: '오늘 뭐먹지? | 직장인 점심 메뉴 추천 & 맛집 지도',
  },
  description:
    '매일 반복되는 점심 고민, 룰렛으로 해결하세요. 날씨와 기분에 딱 맞는 메뉴 추천부터 근처 맛집 검색까지 한 번에!',
  alternates: {
    canonical: 'https://whatlunch.vercel.app',
  },
  openGraph: {
    siteName: 'WhatLunch',
    title: '오늘 뭐먹지? | 직장인 점심 메뉴 추천 & 맛집 지도',
    description:
      '매일 반복되는 점심 고민, 룰렛으로 해결하세요. 날씨와 기분에 딱 맞는 메뉴 추천부터 근처 맛집 검색까지 한 번에!',
    url: 'https://whatlunch.vercel.app',
    type: 'website',
  },
};

const SEOUL_LAT = 37.5665;
const SEOUL_LON = 126.978;

const FALLBACK_ITEMS: CarouselItem[] = Array.from({ length: 3 }, (_, i) => ({
  id: `fallback-${i + 1}`,
  menuName: '추천 메뉴 준비중',
  rank: i + 1,
  favoriteCount: 0,
  stores: [],
}));

export default async function HomePage() {
  const revalidateSeconds = secondsUntilNextKstBoundary();

  const [topMenusResult, weatherResult, airResult] = await Promise.allSettled([
    menusServiceServer.getTopFavoriteMenus(3),
    fetchWeather(SEOUL_LAT, SEOUL_LON, revalidateSeconds),
    fetchAirPollution(SEOUL_LAT, SEOUL_LON, revalidateSeconds),
  ]);

  const topMenus = topMenusResult.status === 'fulfilled' ? topMenusResult.value : [];

  const weatherRaw = weatherResult.status === 'fulfilled' ? weatherResult.value : null;

  const airRaw = airResult.status === 'fulfilled' ? airResult.value : undefined;

  const initialCarouselItems = topMenus.length
    ? mapTopFavoritesToCarousel(topMenus)
    : FALLBACK_ITEMS;

  const initialWeatherData: WeatherApiResponse | null = weatherRaw
    ? {
        weather: normalizeWeather(weatherRaw),
        air: airRaw ? normalizeAir(airRaw) : null,
      }
    : null;

  return (
    <MainClient
      initialTopMenus={topMenus}
      initialCarouselItems={initialCarouselItems}
      initialWeatherData={initialWeatherData}
    />
  );
}
