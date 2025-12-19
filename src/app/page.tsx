'use client';

import { useState } from 'react';

import { MapPin, Shuffle, Table2 } from 'lucide-react';

import Carousel, { pendingData } from '@/shared/components/Carousel';
import Clock from '@/shared/components/Clock/Clock';
import TopTabs from '@/shared/components/TopTabs';
import WeatherMood from '@/domain/WeatherMood/WeatherMood';
import Ladder from '@/domain/Ladder/Ladder';
import Roulette from '@/domain/Roulette/Roulette';

import type { TopTabItem } from '@/shared/components/TopTabs';

import styles from './page.module.scss';

const TAB_LIST = [
  { value: 'roulette', label: '룰렛', icon: <Shuffle size={18} /> },
  { value: 'ladder', label: '사다리', icon: <Table2 size={18} /> },
  { value: 'map', label: '지도', icon: <MapPin size={18} /> },
] as const satisfies readonly TopTabItem[];

type MainTab = (typeof TAB_LIST)[number]['value'];
const DEFAULT_TAB: MainTab = TAB_LIST[0].value;

const isMainTab = (value: string): value is MainTab => TAB_LIST.some(item => item.value === value);

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<MainTab>(DEFAULT_TAB);
  const [isSpinning, setIsSpinning] = useState(false);

  // 각 탭이 한 번이라도 마운트되었는지 여부 기록
  const [mountedTabs, setMountedTabs] = useState<Record<MainTab, boolean>>({
    roulette: true,
    ladder: false,
    map: false,
  });

  const handleChangeTab = (next: string) => {
    if (!isMainTab(next)) return;

    setActiveTab(next);
    setMountedTabs(prev => (prev[next] ? prev : { ...prev, [next]: true }));
  };

  // 각 탭에 해당하는 패널 컴포넌트
  const panels: Record<MainTab, JSX.Element> = {
    roulette: (
      <Roulette
        isSpinning={isSpinning}
        onSpinStart={() => setIsSpinning(true)}
        onSpinResult={() => setIsSpinning(false)}
      />
    ),
    ladder: <Ladder />,
    map: <div>지도</div>,
  };

  const renderMainPanel = (active: string) => {
    if (!isMainTab(active)) return null;

    // lazyMount된 탭이 아니면 렌더링하지 않음
    if (!mountedTabs[active]) return null;

    return panels[active]; // 각 탭에 해당하는 패널 반환
  };

  return (
    <div className={styles['container']}>
      <div className={styles['container__left']}>
        <Carousel duration={4000} items={pendingData} />
        <section className={styles['container__left__slice']}>오늘 인기있는 음식</section>

        <div className={styles['container__left__main']}>
          <section className={styles['container__left__main__roulette']}>
            <TopTabs
              items={TAB_LIST}
              value={activeTab}
              onChange={handleChangeTab}
              renderPanel={renderMainPanel}
              lazyMount
            />
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
