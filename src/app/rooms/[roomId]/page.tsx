'use client';

import { useEffect, useState, useRef } from 'react';
import { Copy, Check, Clock, StarIcon, Users } from 'lucide-react';

import RoomTabs from '@/shared/components/RoomTabs';
import Chat from '@/domain/Chat';
import Roulette from '@/domain/Roulette/Roulette';
import KakaoMap from '@/shared/components/KakaoMap';
import { BaseInput } from '@/shared/components/Input';
import Button from '@/shared/components/Button';
import { useRoomLogic } from './useRoomLogic';

import styles from './page.module.scss';
import type { MyPageBadge } from '@/domain/Mypage/MyPageHeader/types';

// 방 페이지
interface RoomPageProps {
  params: {
    roomId: string;
  };
}

const LOCAL_KEY_PREFIX = 'roomRouletteHistory_';

export default function RoomPage({ params }: RoomPageProps) {
  const roomId = params.roomId;
  const { isSoloMode, isValidRoom, copied, copyRoomCode } = useRoomLogic(roomId);

  // 룰렛 상태
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [results, setResults] = useState<string[]>([]);
  const searchRef = useRef<HTMLInputElement | null>(null);

  const LOCAL_KEY = `${LOCAL_KEY_PREFIX}${roomId}`;

  const handleSpinStart = () => {
    setIsSpinning(true);
  };

  const handleSpinResult = (menuName: string) => {
    setResult(menuName);
    setSearchKeyword(menuName);
    setIsSpinning(false);

    const newResults = [menuName, ...results];
    setResults(newResults);
    localStorage.setItem(LOCAL_KEY, JSON.stringify(newResults));
  };

  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_KEY);
    if (stored) {
      setResults(JSON.parse(stored));
    }
  }, [LOCAL_KEY]);

  const handleSearch = () => {
    if (searchRef.current) {
      setSearchKeyword(searchRef.current.value);
    }
  };

  if (isValidRoom === null) {
    return <div className={styles['room__loading']}>방 정보를 확인 중입니다</div>;
  }

  return (
    <div className={styles['room']}>
      <header className={styles['room__header']}>
        <div className={styles['room__header__left']}>
          <Users size={32} className={styles['room__header__icon']} />
          <div>
            <h1 className={styles['room__title']}>
              {isSoloMode ? '혼자 메뉴 정하기' : '같이 메뉴 정하기'}
            </h1>
            <p className={styles['room__subtitle']}>함께 룰렛을 돌려보세요!</p>
          </div>
        </div>

        {!isSoloMode && (
          <div className={styles['room__code']}>
            <span className={styles['room__code__label']}>방 코드</span>
            <strong className={styles['room__code__value']}>{roomId}</strong>

            <button
              type="button"
              aria-label="방 코드 복사"
              className={styles['room__code__copy']}
              onClick={copyRoomCode}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? '복사됨' : '복사'}
            </button>
          </div>
        )}
      </header>

      <div className={styles['room__content']}>
        <div className={styles['room__left']}>
          <section className={styles['room__roulette-section']}>
            <RoomTabs />
          </section>

          <section className={styles['room__stats-section']}>
            <div className={styles['room__stats-header']}>
              <h3>🎲 결과 내역</h3>
            </div>
            <div className={styles['room__top-menu']}>
              <div className={styles['room__top-menu__icon']}>📊</div>
              <div className={styles['room__top-menu__info']}>
                <span className={styles['room__top-menu__name']}>돌린횟수</span>
                <span className={styles['room__top-menu__count']}>{results.length} 회</span>
              </div>
            </div>
            <div className={styles['room__mood-stats']}>
              <h4>최근 룰렛 결과</h4>
              <div className={styles['room__mood-stats__list']}>
                <ul className={styles['room__mood-stats__list__items']}>
                  {results.slice(0, 8).map((item, idx) => (
                    <li key={idx} className={styles['room__mood-stats__list__items__item']}>
                      <span className={styles['room__mood-stats__list__items__item__badge']}>
                        {idx + 1}
                      </span>
                      {item}
                    </li>
                  ))}
                  {results.length === 0 && (
                    <li className={styles['room__mood-stats__list__items__item--empty']}>
                      🎰 룰렛을 돌려보세요!
                    </li>
                  )}
                </ul>
              </div>
            </div>
            <div className={styles['room__time-info']}>
              <Clock size={18} />
              <span>
                {new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </section>
        </div>

        {!isSoloMode && (
          <aside className={styles['room__right']}>
            <Chat />
          </aside>
        )}
      </div>
    </div>
  );
}
