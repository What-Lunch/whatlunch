'use client';

import { useState } from 'react';

import Clock from '@/shared/components/Clock/Clock';
import { TopTabs } from '@/shared/components/TopTabs';
import { WeatherMood } from '@/domain/WeatherMood';
import Ladder from '@/domain/Ladder/Ladder';
import MapComp from '@/domain/Map/Map';
import { RouletteSection } from '@/domain/Roulette/RouletteSection';

import Carousel, { pendingData } from '@/shared/components/Carousel';

import styles from './page.module.scss';

export default function HomePage() {
  const [tab, setTab] = useState<'roulette' | 'ladder' | 'map'>('roulette');
  const [isSpinning, setIsSpinning] = useState(false);

  return (
    <div className={styles['container']}>
      <div className={styles['container__left']}>
        <Carousel duration={4000} items={pendingData} />
        <section className={styles['container__left__slice']}>오늘 인기있는 음식</section>

        <div className={styles['container__left__main']}>
          <section className={styles['container__left__main__roulette']}>
            <TopTabs tab={tab} onChange={setTab} />

            {tab === 'roulette' && (
              <RouletteSection
                isSpinning={isSpinning}
                onSpinStart={() => setIsSpinning(true)}
                onSpinResult={() => setIsSpinning(false)}
              />
            )}

            {tab === 'ladder' && <Ladder />}
            {tab === 'map' && <MapComp />}
          </section>

          <section className={styles['container__left__main__option']}>찬성 반대</section>
          <section className={styles['container__left__main__map']}>지도</section>
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
