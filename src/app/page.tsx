'use client';

import { useState } from 'react';

import Clock from '@/components/Clock/Clock';
import { TopTabs } from '@/components/common/TopTabs';
import { WeatherMood } from '@/components/WeatherMood';
import Ladder from '@/components/Ladder/Ladder';
import MapComp from '@/components/Map/Map';
import { RouletteSection } from '@/components/Roulette/RouletteSection/RouletteSection';

import styles from './page.module.scss';

export default function HomePage() {
  const [tab, setTab] = useState<'roulette' | 'ladder' | 'map'>('roulette');
  const [isSpinning, setIsSpinning] = useState(false);

  return (
    <div className={styles['container']}>
      <div className={styles['container__left']}>
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
