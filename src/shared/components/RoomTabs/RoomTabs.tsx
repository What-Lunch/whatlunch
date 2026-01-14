'use client';

import { useState, useCallback, useRef } from 'react';
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

interface RoomTabsProps {
  onResult?: (result: string) => void;
}

export default function RoomTabs({ onResult }: RoomTabsProps) {
  const [activeTab, setActiveTab] = useState<TopTabItem['value']>('roulette');
  const [isSpinning, setIsSpinning] = useState(false);
  const [rouletteResult, setRouletteResult] = useState<string | null>(null);

  const searchRef = useRef<HTMLInputElement>(null);
  const [searchKeyword, setSearchKeyword] = useState('');

  const handleSearch = useCallback((e: FormEvent) => {
    e.preventDefault();
    const value = searchRef.current?.value ?? '';
    setSearchKeyword(value);
    setRouletteResult(null);
  }, []);

  const handleRouletteResult = useCallback(
    (result: string) => {
      setIsSpinning(false);
      setRouletteResult(result);
      setSearchKeyword(result);

      if (searchRef.current) {
        searchRef.current.value = result;
      }

      onResult?.(result);
    },
    [onResult]
  );

  const renderPanel = (value: string) => {
    if (value === 'roulette') {
      return (
        <Roulette
          isSpinning={isSpinning}
          result={rouletteResult}
          onSpinStart={() => setIsSpinning(true)}
          onSpinResult={handleRouletteResult}
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
              ref={searchRef}
              defaultValue={searchKeyword}
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
    </>
  );
}
