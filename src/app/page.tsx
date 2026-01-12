'use client';

import Carousel, { pendingData } from '@/shared/components/Carousel';
import Clock from '@/shared/components/Clock/Clock';
import WeatherMood from '@/domain/WeatherMood/WeatherMood';
import RoomEntryCard from '@/domain/Room/RoomEntryCard/RoomEntryCard';

import styles from './page.module.scss';

export default function HomePage() {
  return (
    <div className={styles['container']}>
      <div className={styles['container__left']}>
        <Carousel duration={4000} items={pendingData} />

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
      </div>
    </div>
  );
}
