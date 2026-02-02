'use client';

import { useQuery } from '@tanstack/react-query';

import Carousel from '@/shared/components/Carousel';
import type { CarouselItem } from '@/shared/components/Carousel';
import Clock from '@/shared/components/Clock/Clock';
import WeatherMood from '@/domain/WeatherMood/WeatherMood';
import RoomEntryCard from '@/domain/Room/RoomEntryCard/RoomEntryCard';
import QuoteCard from '@/domain/QuoteCard';

import { menusServiceClient } from '@/app/services/backend/menus.api';
import { mapTopFavoritesToCarousel } from '@/app/utils/mapTopFavoritesToCarousel';

import styles from './page.module.scss';

// 서버 없을 때도 보여줄 fallback
const FALLBACK_ITEMS: CarouselItem[] = [
  {
    id: 'fallback-1',
    menuName: '추천 메뉴 준비중',
    rank: 1,
    favoriteCount: 0,
    stores: [],
  },
  {
    id: 'fallback-2',
    menuName: '추천 메뉴 준비중',
    rank: 2,
    favoriteCount: 0,
    stores: [],
  },
  {
    id: 'fallback-3',
    menuName: '추천 메뉴 준비중',
    rank: 3,
    favoriteCount: 0,
    stores: [],
  },
];

export default function HomePage() {
  const {
    data: topMenus,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['menus', 'favorites', 'top'],
    queryFn: () => menusServiceClient.getTopFavoriteMenus(3),
    staleTime: 30_000,
  });

  const carouselItems: CarouselItem[] =
    !isLoading && !isError && topMenus?.length
      ? mapTopFavoritesToCarousel(topMenus)
      : FALLBACK_ITEMS;

  return (
    <div className={styles['container']}>
      <div className={styles['container__left']}>
        <Carousel duration={4000} items={carouselItems} />

        <div className={styles['container__left__main']}>
          <section className={styles['container__left__main__room-entry']}>
            <RoomEntryCard />
          </section>
        </div>
      </div>

      <div className={styles['container__right']}>
        <section className={styles['container__right__clock']}>
          <Clock />
        </section>
        <section className={styles['container__right__weather']}>
          <WeatherMood />
        </section>
        <section className={styles['container__right__quote']}>
          <QuoteCard />
        </section>
      </div>
    </div>
  );
}
