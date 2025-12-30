'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import { Utensils, X } from 'lucide-react';

import { RECENT_MEAL_DECISIONS_MOCK } from './mock';
import type { MealDecisionItem } from './types';

import styles from './RecentMenuDecisionCard.module.scss';

interface RecentMenuDecisionCardProps {
  items?: readonly MealDecisionItem[];
  onClickRechoose?: (id: string) => void;
}

const MAX_VISIBLE_ITEMS = 3;

export default function RecentMenuDecisionCard({
  items = RECENT_MEAL_DECISIONS_MOCK,
  onClickRechoose,
}: RecentMenuDecisionCardProps) {
  const router = useRouter();

  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const visibleItems = useMemo(() => items.slice(0, MAX_VISIBLE_ITEMS), [items]);
  const shouldShowViewAll = items.length > MAX_VISIBLE_ITEMS;

  const handleClickRechoose = (id: string) => {
    if (onClickRechoose) {
      onClickRechoose(id);
      return;
    }

    router.push('/');
  };

  const handleOpenHistory = () => setIsHistoryOpen(true);
  const handleCloseHistory = () => setIsHistoryOpen(false);

  return (
    <div>
      <section className={styles['meal-history']} aria-label="최근 메뉴 결정 결과">
        <header className={styles['meal-history__header']}>
          <h2 className={styles['meal-history__header__title']}>최근 메뉴 결정 결과</h2>
        </header>

        <ul className={styles['meal-history__list']}>
          {visibleItems.map(item => (
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
                onClick={() => handleClickRechoose(item.id)}
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
                    onClick={() => handleClickRechoose(item.id)}
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
    </div>
  );
}
