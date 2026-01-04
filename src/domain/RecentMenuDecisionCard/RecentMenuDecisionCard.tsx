'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';

import { Utensils } from 'lucide-react';

import { RECENT_MEAL_DECISIONS_MOCK } from './mock';

import Modal from '@/shared/components/Modal';
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
          <div className={styles['meal-history__view-all']}>
            <button
              type="button"
              className={styles['meal-history__view-all__button']}
              onClick={handleOpenHistory}
            >
              전체 기록 보기
            </button>
          </div>
        )}
      </section>

      {/* 전체 기록 모달 */}
      {isHistoryOpen && (
        <Modal
          isOpen={isHistoryOpen}
          onClose={handleCloseHistory}
          title="전체 기록"
          innerClassName={styles['meal-history-modal']}
        >
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
        </Modal>
      )}
    </>
  );
}
