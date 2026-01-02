'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { Utensils, X } from 'lucide-react';

import { RECENT_MEAL_DECISIONS_MOCK } from './mock';

import styles from './RecentMenuDecisionCard.module.scss';

const MAX_VISIBLE_ITEMS = 3;

export default function RecentMenuDecisionCard() {
  const router = useRouter();

  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const items = RECENT_MEAL_DECISIONS_MOCK;
  const shouldShowViewAll = items.length > MAX_VISIBLE_ITEMS;

  // 현재는 reroll 트리거만 필요
  const handleClickRechoose = () => {
    router.push('/?reroll=1');
  };

  const handleOpenHistory = useCallback(() => setIsHistoryOpen(true), []);
  const handleCloseHistory = useCallback(() => setIsHistoryOpen(false), []);

  // 바깥 스크롤 잠금 + 스크롤바 폭 보정
  useEffect(() => {
    if (!isHistoryOpen) return;

    const scrollY = window.scrollY;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';

    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      const top = document.body.style.top;

      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';

      const restoredY = top ? Math.abs(parseInt(top, 10)) : scrollY;
      window.scrollTo(0, restoredY);
    };
  }, [isHistoryOpen]);

  // ESC 키로 모달 닫기
  useEffect(() => {
    if (!isHistoryOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      e.preventDefault();
      handleCloseHistory();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isHistoryOpen, handleCloseHistory]);

  return (
    <>
      <section className={styles['meal-history']} aria-label="최근 메뉴 결정 결과">
        <header className={styles['meal-history__header']}>
          <h2 className={styles['meal-history__header__title']}>최근 메뉴 결정 결과</h2>
        </header>

        <ul className={styles['meal-history__list']}>
          {items.slice(0, MAX_VISIBLE_ITEMS).map(item => (
            <li key={item.id} className={styles['meal-history__list__item']}>
              <div className={styles['meal-history__list__item__left']}>
                <div className={styles['meal-history__list__item__menu']}>
                  <Utensils className={styles['meal-history__list__item__menu__icon']} />
                  <p className={styles['meal-history__list__item__menu__name']}>{item.menuName}</p>
                </div>

                <p className={styles['meal-history__list__item__date']}>{item.decidedAt}</p>
              </div>

              <button
                type="button"
                className={styles['meal-history__list__item__action']}
                onClick={handleClickRechoose}
                aria-label={`${item.menuName} 다른 메뉴 선택`}
              >
                다른 메뉴 선택
              </button>
            </li>
          ))}
        </ul>

        {shouldShowViewAll && (
          <button
            type="button"
            className={styles['meal-history__view-all']}
            onClick={handleOpenHistory}
          >
            전체 기록 보기
          </button>
        )}
      </section>

      {/* 전체 기록 모달 */}
      {isHistoryOpen && (
        <div className={styles['meal-history-modal']} role="dialog" aria-modal="true">
          <button
            type="button"
            className={styles['meal-history-modal__backdrop']}
            onClick={handleCloseHistory}
            aria-label="모달 닫기"
          />

          <div className={styles['meal-history-modal__panel']}>
            <header className={styles['meal-history-modal__header']}>
              <h3 className={styles['meal-history-modal__title']}>전체 기록</h3>

              <button
                type="button"
                className={styles['meal-history-modal__close']}
                onClick={handleCloseHistory}
                aria-label="닫기"
              >
                <X className={styles['meal-history-modal__close__icon']} />
              </button>
            </header>

            <ul className={styles['meal-history-modal__list']}>
              {items.map(item => (
                <li key={item.id} className={styles['meal-history-modal__item']}>
                  <div className={styles['meal-history-modal__item__left']}>
                    <div className={styles['meal-history-modal__item__menu']}>
                      <Utensils className={styles['meal-history-modal__item__menu__icon']} />
                      <p className={styles['meal-history-modal__item__menu__name']}>
                        {item.menuName}
                      </p>
                    </div>

                    <p className={styles['meal-history-modal__item__date']}>{item.decidedAt}</p>
                  </div>

                  <button
                    type="button"
                    className={styles['meal-history-modal__item__action']}
                    onClick={handleClickRechoose}
                    aria-label={`${item.menuName} 다른 메뉴 선택`}
                  >
                    다른 메뉴 선택
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
