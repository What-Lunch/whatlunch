'use client';

import { Orbit, ListOrdered, MapPinned } from 'lucide-react';
import styles from './TopTabs.module.scss';

export type TabType = 'roulette' | 'ladder' | 'map';

interface Props {
  tab: TabType;
  onChange: (value: TabType) => void;
}

export default function TopTabs({ tab, onChange }: Props) {
  return (
    <div className={styles['container']}>
      <div className={styles['container__tabs']}>
        {/* 룰렛 */}
        <button
          className={
            tab === 'roulette'
              ? `${styles['container__tab']} ${styles['container__tab--active']}`
              : styles['container__tab']
          }
          onClick={() => onChange('roulette')}
        >
          <Orbit className={styles['container__icon']} />
          룰렛
        </button>

        {/* 사다리 */}
        <button
          className={
            tab === 'ladder'
              ? `${styles['container__tab']} ${styles['container__tab--active']}`
              : styles['container__tab']
          }
          onClick={() => onChange('ladder')}
        >
          <ListOrdered className={styles['container__icon']} />
          사다리타기
        </button>

        {/* 지도 */}
        <button
          className={
            tab === 'map'
              ? `${styles['container__tab']} ${styles['container__tab--active']}`
              : styles['container__tab']
          }
          onClick={() => onChange('map')}
        >
          <MapPinned className={styles['container__icon']} />
          지도
        </button>
      </div>

      <div className={styles['container__content']}></div>
    </div>
  );
}
