'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Utensils } from 'lucide-react';

import { RECENT_MEAL_DECISIONS_MOCK } from './mock';
import { formatDate } from '@/shared/utils/date';

import Modal from '@/shared/components/Modal';
import styles from './RecentMenuDecisionCard.module.scss';

const MAX_VISIBLE_ITEMS = 4;

export default function RecentMenuDecisionCard() {
  const router = useRouter();
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const items = RECENT_MEAL_DECISIONS_MOCK;
  const isEmpty = items.length === 0;
  const shouldShowViewAll = items.length > MAX_VISIBLE_ITEMS;

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

        {isEmpty ? (
          <div className={styles['meal-history__empty']} aria-live="polite">
            <Utensils className={styles['meal-history__empty__icon']} aria-hidden="true" />
            <p className={styles['meal-history__empty__title']}>아직 메뉴 결정 기록이 없어요</p>
            <p className={styles['meal-history__empty__desc']}>
              메뉴를 한 번 결정하면 여기에 기록이 쌓여요
            </p>
            <button
              type="button"
              className={styles['meal-history__empty__action']}
              onClick={handleClickRechoose}
            >
              메뉴 다시 고르기
            </button>
          </div>
        ) : (
          <>
            <ul className={styles['meal-history__list']}>
              {items.slice(0, MAX_VISIBLE_ITEMS).map(item => (
                <li key={item.id} className={styles['meal-history__list__item']}>
                  <div className={styles['meal-history__list__item__left']}>
                    <div className={styles['meal-history__list__item__menu']}>
                      <Utensils
                        className={styles['meal-history__list__item__menu__icon']}
                        aria-hidden="true"
                      />
                      <p className={styles['meal-history__list__item__menu__name']}>
                        {item.menuName}
                      </p>
                    </div>

                    <p className={styles['meal-history__list__item__date']}>
                      {formatDate(item.decidedAt)}
                    </p>
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
          </>
        )}
      </section>

      {/* 전체 기록 모달 */}
      {!isEmpty && isHistoryOpen && (
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
                    <Utensils
                      className={styles['meal-history-modal__item__menu__icon']}
                      aria-hidden="true"
                    />
                    <p className={styles['meal-history-modal__item__menu__name']}>
                      {item.menuName}
                    </p>
                  </div>
                  <p className={styles['meal-history-modal__item__date']}>
                    {formatDate(item.decidedAt)}
                  </p>
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
