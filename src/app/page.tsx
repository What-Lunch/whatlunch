'use client';

import { useState, useCallback } from 'react';

import Clock from '@/shared/components/Clock/Clock';
import TopTabs from '@/domain/TopTabs/TopTabs';
import WeatherMood from '@/domain/WeatherMood/WeatherMood';
import Ladder from '@/domain/Ladder/Ladder';
import Roulette from '@/domain/Roulette/Roulette';
import KakaoMap from '@/shared/components/KakaoMap';

import Carousel, { pendingData } from '@/shared/components/Carousel';

import styles from './page.module.scss';

export default function HomePage() {
  const [tab, setTab] = useState<'roulette' | 'ladder' | 'map'>('roulette');
  const [isSpinning, setIsSpinning] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchValue, setSearchValue] = useState('맛집');

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setSearchKeyword(searchValue);
    },
    [searchValue]
  );

  return (
    <div className={styles['container']}>
      <div className={styles['container__left']}>
        <Carousel duration={4000} items={pendingData} />
        <section className={styles['container__left__slice']}>오늘 인기있는 음식</section>

        <div className={styles['container__left__main']}>
          <section className={styles['container__left__main__menu-tab']}>
            <TopTabs tab={tab} onChange={setTab} />

            {tab === 'roulette' && (
              <Roulette
                isSpinning={isSpinning}
                onSpinStart={() => setIsSpinning(true)}
                onSpinResult={() => setIsSpinning(false)}
              />
            )}
            {tab === 'ladder' && <Ladder />}
            {tab === 'map' && (
              <div className={styles['container__left__main__menu-tab-map']}>
                <div onClick={handleSearch}>
                  <input
                    type="search"
                    placeholder="Search location"
                    value={searchValue}
                    onChange={e => setSearchValue(e.target.value)}
                  />
                  <button type="submit">검색</button>
                </div>
                <KakaoMap keyword={searchKeyword} />
              </div>
            )}
          </section>

          <section className={styles['container__left__main__option']}>찬성 반대</section>
          <section className={styles['container__left__main__map']}></section>
        </div>
      </div>

      <div className={styles['container__right']}>
        <section className={styles['container__right__clock']}>
          <Clock />
        </section>
        <section className={styles['container__right__weather']}>
          <WeatherMood />
        </section>
        <section className={styles['container__right__chat']}>채팅창</section>
      </div>
    </div>
  );
}
