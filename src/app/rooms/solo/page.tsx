'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { StarIcon, DicesIcon, Clock } from 'lucide-react';

import Roulette from '@/domain/Roulette/Roulette';
import KakaoMap from '@/shared/components/KakaoMap';

import type { MyPageBadge } from '@/domain/Mypage/MyPageHeader/types';
import styles from './page.module.scss';
import { BaseInput } from '@/shared/components/Input';
import Button from '@/shared/components/Button';

// TODO: 뱃지 컴포넌트 분리 필요
const BADGES: MyPageBadge[] = [
  { id: 'top-menu', tone: 'green', Icon: StarIcon, text: '현재 1등 메뉴: 치킨' },
];

const LOCAL_KEY = 'soloRouletteHistory';

export default function SoloRoomPage() {
  // 룰렛 상태 관리
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [results, setResults] = useState<string[]>([]);
  const searchRef = useRef<HTMLInputElement | null>(null);

  const handleSpinStart = () => {
    setIsSpinning(true);
  };

  const handleSpinResult = useCallback((menuName: string) => {
    setResult(menuName);
    setSearchKeyword(menuName);
    setIsSpinning(false);

    setResults(prev => {
      const newResults = [menuName, ...prev];
      if (typeof window !== 'undefined' && window.localStorage) {
        try {
          window.localStorage.setItem(LOCAL_KEY, JSON.stringify(newResults));
        } catch (e) {
          console.error('localStorage 저장 오류:', e);
        }
      }
      return newResults;
    });
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.localStorage) return;
    try {
      const stored = window.localStorage.getItem(LOCAL_KEY);
      if (stored) {
        setResults(JSON.parse(stored));
      }
    } catch (err) {
      console.error('localStorage 룰렛 결과 파싱 오류:', err);
      window.localStorage.removeItem(LOCAL_KEY);
      setResults([]);
    }
  }, []);

  const handleSearch = () => {
    if (searchRef.current) {
      setSearchKeyword(searchRef.current.value);
    }
  };

  return (
    <div className={styles['solo']}>
      <header className={styles['solo__header']}>
        <div className={styles['solo__header__title']}>
          <DicesIcon size={40} className={styles['solo__header__title__icon']} />
          <div className={styles['solo__header__title__text']}>
            <h2>혼자 메뉴 정하기</h2>
            <span>혼자서도 룰렛을 돌릴 수 있어요!</span>
          </div>
        </div>
        <div className={styles['solo__header__stats']}>
          {BADGES.map(({ id, tone, Icon, text }) => (
            <span
              key={id}
              className={`${styles['solo__header__stats__item']} ${styles[`solo__header__stats__item--${tone}`]}`}
            >
              <Icon className={styles['solo__header__stats__item-icon']} />
              {text}
            </span>
          ))}
        </div>
      </header>
      <main className={styles['solo__content']}>
        <section className={styles['solo__left']}>
          <Roulette
            isSpinning={isSpinning}
            onSpinStart={handleSpinStart}
            onSpinResult={handleSpinResult}
            result={result}
          />
        </section>
        <section className={styles['solo__right']}>
          <div className={styles['solo__map-section']}>
            <div className={styles['solo__map-header']}>
              <h3>지도</h3>
              <p>결과에 따라 지도가 업데이트 돼요!</p>
            </div>

            <div className={styles['solo__map-header']}>
              <BaseInput
                ref={searchRef}
                placeholder="장소를 검색해보세요"
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  }
                }}
              />
              <Button
                type="button"
                className={styles['solo__map-header__search-btn']}
                onClick={handleSearch}
                aria-label="검색"
              >
                검색
              </Button>
            </div>
            <div className={styles['solo__map']}>
              <KakaoMap keyword={searchKeyword} list={false} />
            </div>
          </div>
          <div className={styles['solo__stats-section']}>
            <div className={styles['solo__stats-header']}>
              <h3>🎲 결과 내역</h3>
            </div>
            <div className={styles['solo__top-menu']}>
              <div className={styles['solo__top-menu__icon']}>📊</div>
              <div className={styles['solo__top-menu__info']}>
                <span className={styles['solo__top-menu__name']}>돌린횟수</span>
                <span className={styles['solo__top-menu__count']}>{results.length} 회</span>
              </div>
            </div>
            <div className={styles['solo__mood-stats']}>
              <h4>최근 룰렛 결과</h4>
              <div className={styles['solo__mood-stats__list']}>
                <ul className={styles['solo__mood-stats__list__items']}>
                  {results.slice(0, 8).map((item, idx) => (
                    <li key={idx} className={styles['solo__mood-stats__list__items__item']}>
                      <span className={styles['solo__mood-stats__list__items__item__badge']}>
                        {idx + 1}
                      </span>
                      {item}
                    </li>
                  ))}
                  {results.length === 0 && (
                    <li className={styles['solo__mood-stats__list__items__item--empty']}>
                      🎰 룰렛을 돌려보세요!
                    </li>
                  )}
                </ul>
              </div>
            </div>
            <div className={styles['solo__time-info']}>
              <Clock size={18} />
              <span>
                {new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
