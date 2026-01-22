'use client';

import { useState, useRef, useCallback } from 'react';
import { StarIcon, DicesIcon, Clock } from 'lucide-react';

import Roulette from '@/domain/Roulette/Roulette';
import KakaoMap from '@/shared/components/KakaoMap';
import Badge, { BadgeProps } from '@/shared/components/Badge';
import { BaseInput } from '@/shared/components/Input';
import Button from '@/shared/components/Button';

import { useRouletteResultStore } from '@/shared/stores/rouletteResultStore';
import styles from './page.module.scss';

const BADGES: BadgeProps[] = [
  { id: 'top-menu', variant: 'green', Icon: StarIcon, text: '현재 1등 메뉴: 치킨' },
];

// TODO: 시간 렌더링 실시간 업데이트는 구현 필요
export default function SoloRoomPage() {
  // 룰렛 상태 관리
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<Menu.GetMenuRes | null>(null);

  const [searchKeyword, setSearchKeyword] = useState('');
  const searchRef = useRef<HTMLInputElement | null>(null);

  const handleSpinStart = () => {
    setIsSpinning(true);
  };

  const { results, addResult } = useRouletteResultStore();

  const handleSpinResult = useCallback(
    (selectedMenu: Menu.GetMenuRes) => {
      setResult(selectedMenu);
      setSearchKeyword(selectedMenu.name);
      setIsSpinning(false);
      addResult([selectedMenu]);
    },
    [addResult]
  );

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
          {BADGES.map(({ id, variant, Icon, text }) => (
            <Badge key={id} id={id} variant={variant} Icon={Icon} text={text} />
          ))}
        </div>
      </header>
      <main className={styles['solo__content']}>
        <div className={styles['solo__main-section']}>
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
                <KakaoMap keyword={searchKeyword} list />
              </div>
            </div>
          </section>
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
                {results.slice(0, 8).map((item: Menu.GetMenuRes, idx: number) => (
                  <li key={item.id} className={styles['solo__mood-stats__list__items__item']}>
                    <span className={styles['solo__mood-stats__list__items__item__badge']}>
                      {idx + 1}
                    </span>
                    {item.name}
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
      </main>
    </div>
  );
}
