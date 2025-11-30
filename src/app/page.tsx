'use client';

import { useState } from 'react';
import { Shuffle } from 'lucide-react';

import Clock from '@/components/Clock/Clock';
import { TopTabs } from '@/components/common/TopTabs';
import { WeatherMood } from '@/components/WeatherMood';
import { Roulette, RouletteFilter, ResultModal } from '@/components/Roulette';
import Ladder from '@/components/Ladder/Ladder';
import MapComp from '@/components/Map/Map';
import Button from '@/components/common/Button/Button';

import styles from './page.module.scss';

export default function HomePage() {
  const [tab, setTab] = useState<'roulette' | 'ladder' | 'map'>('roulette');

  const [menus, setMenus] = useState<string[]>([]);
  const [resultMenu, setResultMenu] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);

  return (
    <div className={styles['container']}>
      <div className={styles['container__left']}>
        <section className={styles['container__left__slice']}>오늘 인기있는 음식</section>

        <div className={styles['container__left__main']}>
          <section className={styles['container__left__main__roulette']}>
            <TopTabs tab={tab} onChange={setTab} />

            {tab === 'roulette' && (
              <>
                <p className={styles['today']}>
                  오늘의 메뉴 {resultMenu ? <span>{resultMenu}</span> : <span>?</span>}
                </p>
                <div className={styles.rouletteWrapper}>
                  <Button
                    variant="neutral"
                    mode="fill"
                    padding="0"
                    fontSize="0"
                    disabled={isSpinning || menus.length < 2}
                    onClick={() => setMenus(prev => [...prev].sort(() => Math.random() - 0.5))}
                    className={styles.shuffleBtn}
                  >
                    <Shuffle size={20} />
                  </Button>

                  <Roulette
                    items={menus}
                    onStart={() => setIsSpinning(true)}
                    onResult={menu => {
                      setIsSpinning(false);
                      setResultMenu(menu);
                      setModalOpen(true);
                    }}
                  />
                </div>

                <div className={styles.resultBtnWrapper}>
                  <Button
                    variant="neutral"
                    mode="fill"
                    disabled={!resultMenu || isSpinning}
                    onClick={() => setModalOpen(true)}
                  >
                    결과 보기
                  </Button>
                </div>

                <RouletteFilter onChange={setMenus} disabled={isSpinning} />

                {modalOpen && resultMenu && (
                  <ResultModal menu={resultMenu} onClose={() => setModalOpen(false)} />
                )}
              </>
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
