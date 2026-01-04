'use client';
import { useState } from 'react';
import { TrophyIcon } from 'lucide-react';

import Modal from '@/shared/components/Modal';

import { FAVORITE_MEAL_MOCK } from './mock';

import styles from './FavoriteMenuCard.module.scss';

export default function FavoriteMenuCard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <>
      <section aria-label="즐겨찾기 메뉴" className={styles['meal-favorite']}>
        <header className={styles['meal-favorite__header']}>
          <h2 className={styles['meal-favorite__header__title']}>자주 선택된 메뉴 요약</h2>
          <TrophyIcon className={styles['meal-favorite__header__icon']} />
        </header>
        {FAVORITE_MEAL_MOCK.length === 0 ? (
          <div className={styles['meal-favorite__empty']}>
            <TrophyIcon className={styles['meal-favorite__empty__icon']} />
            <p className={styles['meal-favorite__empty__text']}>아직 즐겨찾기 메뉴가 없어요!</p>
          </div>
        ) : (
          <>
            <ul className={styles['meal-favorite__list']}>
              {FAVORITE_MEAL_MOCK.slice(0, 3).map(item => (
                <li key={item.id} className={styles['meal-favorite__list__item']}>
                  {/* TODO: 각 음식 사진이나 아이콘 추가 필요 */}
                  <div className={styles['meal-favorite__list__item__info']}>
                    <span className={styles['meal-favorite__list__item__info__name']}>
                      {item.menuName}
                    </span>
                    <span className={styles['meal-favorite__list__item__info__category']}>
                      {item.category}
                    </span>
                  </div>
                  <span>{item.count}회</span>
                </li>
              ))}
            </ul>
            <div className={styles['meal-favorite__view-all']}>
              <button
                className={styles['meal-favorite__view-all__button']}
                onClick={() => setIsModalOpen(true)}
              >
                전체기록 보기
              </button>
            </div>
          </>
        )}
      </section>
      {isModalOpen && (
        <>
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title="즐겨찾기 메뉴 전체 기록"
            innerClassName={styles['modal']}
          >
            <ul className={styles['modal__list']}>
              {FAVORITE_MEAL_MOCK.map(item => (
                <li key={item.id} className={styles['modal__list__item']}>
                  <div className={styles['modal__list__item__info']}>
                    <span className={styles['modal__list__item__info__name']}>{item.menuName}</span>
                    <span className={styles['modal__list__item__info__category']}>
                      {item.category}
                    </span>
                  </div>
                  <span>{item.count}회</span>
                </li>
              ))}
            </ul>
          </Modal>
        </>
      )}
    </>
  );
}
