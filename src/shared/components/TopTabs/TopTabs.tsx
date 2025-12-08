'use client';

import { Orbit, ListOrdered, MapPinned } from 'lucide-react';

import TabButton from './TabButton/TabButton';

import { TopTabsProps } from './type';

import styles from './TopTabs.module.scss';

export default function TopTabs({ tab, onChange }: TopTabsProps) {
  return (
    <div className={styles['container']}>
      <div className={styles['container__tabs']}>
        <TabButton value="roulette" tab={tab} onChange={onChange} icon={<Orbit />}>
          룰렛
        </TabButton>

        <TabButton value="ladder" tab={tab} onChange={onChange} icon={<ListOrdered />}>
          사다리타기
        </TabButton>

        <TabButton value="map" tab={tab} onChange={onChange} icon={<MapPinned />}>
          지도
        </TabButton>
      </div>
    </div>
  );
}
