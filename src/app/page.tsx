'use client';

import { useState, useCallback } from 'react';
import type { FormEvent } from 'react';
import { MapPin, Shuffle, Table2 } from 'lucide-react';
import Carousel, { pendingData } from '@/shared/components/Carousel';
import Clock from '@/shared/components/Clock/Clock';
import TopTabs, { TopTabItem } from '@/shared/components/TopTabs';
import WeatherMood from '@/domain/WeatherMood/WeatherMood';
import Ladder from '@/domain/Ladder/Ladder';
import Roulette from '@/domain/Roulette/Roulette';
import KakaoMap from '@/shared/components/KakaoMap';
import styles from './page.module.scss';
import Chat from '@/domain/Chat';

const TAB_LIST = [
  { value: 'roulette', label: '룰렛', icon: <Shuffle size={18} /> },
  { value: 'ladder', label: '사다리', icon: <Table2 size={18} /> },
  { value: 'map', label: '지도', icon: <MapPin size={18} /> },
] as const satisfies readonly TopTabItem[];

const isMainTab = (value: string): value is TopTabItem['value'] =>
  TAB_LIST.some(item => item.value === value);

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<TopTabItem['value']>(TAB_LIST[0].value);
  const [isSpinning, setIsSpinning] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchValue, setSearchValue] = useState('맛집');
  const [rouletteResult, setRouletteResult] = useState<string | null>(null);

  const handleSearch = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      setSearchKeyword(searchValue);
    },
    [searchValue]
  );

  // 활성 탭 상태만 변경
  const handleChangeTab = (next: string) => {
    if (!isMainTab(next)) return;
    setActiveTab(next);
  };

  // 패널 생성만 담당 (lazyMount는 TopTabs가 처리)
  const renderMainPanel = (value: string) => {
    if (!isMainTab(value)) return null;

    if (value === 'roulette') {
      return (
        <Roulette
          isSpinning={isSpinning}
          onSpinStart={() => setIsSpinning(true)}
          onSpinResult={result => {
            setIsSpinning(false);
            setRouletteResult(result);
          }}
          result={rouletteResult}
        />
      );
    }

    if (value === 'ladder') {
      return <Ladder />;
    }

    if (value === 'map') {
      return (
        <div className={styles['container__left__main__menu-tab-map']}>
          <form
            onSubmit={handleSearch}
            className={styles['container__left__main__menu-tab-map__form']}
          >
            <input
              type="search"
              placeholder="Search location"
              value={searchValue}
              onChange={e => setSearchValue(e.target.value)}
              className={styles['container__left__main__menu-tab-map__input']}
            />
            <button type="submit" className={styles['container__left__main__menu-tab-map__button']}>
              검색
            </button>
          </form>

          <div className={styles['container__left__main__menu-tab-map__map']}>
            <KakaoMap keyword={searchKeyword} />
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className={styles['container']}>
      <div className={styles['container__left']}>
        <Carousel duration={4000} items={pendingData} />
        <section className={styles['container__left__slice']}>오늘 인기있는 음식</section>

        <div className={styles['container__left__main']}>
          <section className={styles['container__left__main__menu-tab']}>
            <TopTabs
              items={TAB_LIST}
              value={activeTab}
              onChange={handleChangeTab}
              renderPanel={renderMainPanel}
              lazyMount
            />
          </section>

          <section className={styles['container__left__main__option']}>찬성 반대</section>
          {rouletteResult && (
            <section className={styles['container__left__main__map']}>
              <KakaoMap keyword={rouletteResult || searchKeyword} list={false} />
            </section>
          )}
        </div>
      </div>

      <div className={styles['container__right']}>
        {/* TODO: section 스타일 삭제 및 각 컴포넌트로 스타일 이전 필요 */}
        <section className={styles['container__right__clock']}>
          <Clock />
        </section>
        <section className={styles['container__right__weather']}>
          <WeatherMood />
        </section>

        <Chat />
      </div>
    </div>
  );
}
