'use client';

import { useState, useCallback } from 'react';
import type { FormEvent } from 'react';
import { Shuffle, MapPin } from 'lucide-react';

import TopTabs, { TopTabItem } from '@/shared/components/TopTabs';
import Roulette from '@/domain/Roulette/Roulette';
import KakaoMap from '@/shared/components/KakaoMap';

import styles from './RoomTabs.module.scss';

const TAB_LIST = [
  { value: 'roulette', label: '룰렛', icon: <Shuffle size={18} /> },
  { value: 'map', label: '지도', icon: <MapPin size={18} /> },
] as const satisfies readonly TopTabItem[];

const isMainTab = (value: string): value is TopTabItem['value'] =>
  TAB_LIST.some(tab => tab.value === value);

export default function RoomTabs() {
  const [activeTab, setActiveTab] = useState<TopTabItem['value']>('roulette');
  const [isSpinning, setIsSpinning] = useState(false);
  const [rouletteResult, setRouletteResult] = useState<string | null>(null);

  const [searchValue, setSearchValue] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');

  const handleSearch = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      setSearchKeyword(searchValue);
    },
    [searchValue]
  );

  const renderPanel = (value: string) => {
    if (value === 'roulette') {
      return (
        <Roulette
          isSpinning={isSpinning}
          result={rouletteResult}
          onSpinStart={() => setIsSpinning(true)}
          onSpinResult={result => {
            setIsSpinning(false);
            setRouletteResult(result);
          }}
        />
      );
    }

    if (value === 'map') {
      return (
        <div className={styles['room-tabs__map']}>
          <form onSubmit={handleSearch} className={styles['room-tabs__form']}>
            <input
              type="search"
              placeholder="장소를 검색해보세요"
              value={searchValue}
              onChange={e => setSearchValue(e.target.value)}
              className={styles['room-tabs__input']}
            />
            <button type="submit" className={styles['room-tabs__button']}>
              검색
            </button>
          </form>

          <KakaoMap keyword={searchKeyword} />
        </div>
      );
    }

    return null;
  };

  return (
    <>
      <TopTabs
        items={TAB_LIST}
        value={activeTab}
        onChange={next => isMainTab(next) && setActiveTab(next)}
        renderPanel={renderPanel}
        lazyMount
      />

      {activeTab === 'roulette' && rouletteResult && (
        <section className={styles['room-tabs__result']}>
          <h2 className={styles['room-tabs__result-title']}>“{rouletteResult}” 주변 장소</h2>
          <KakaoMap keyword={rouletteResult} list />
        </section>
      )}
    </>
  );
}
