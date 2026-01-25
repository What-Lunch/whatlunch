'use client';

import { useState } from 'react';
import { Sparkles } from 'lucide-react';

import Modal from '@/shared/components/Modal';
import FavoriteToggle from '@/shared/components/FavoriteToggle';

import { FAVORITE_MEAL_MOCK } from './mock';
import styles from './FavoriteMenuCard.module.scss';

export default function FavoriteMenuCard() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  /**
   * 찜하기 상태
   * key: menuId
   * value: boolean
   */
  const [favoriteMap, setFavoriteMap] = useState<Record<string, boolean>>({});

  const handleToggle = (menuId: string) => {
    setFavoriteMap(prev => ({
      ...prev,
      [menuId]: !prev[menuId],
    }));
  };

  return (
    <>
      <section aria-label="내가 찜한 메뉴" className={styles['meal-favorite']}>
        <header className={styles['meal-favorite__header']}>
          <h2 className={styles['meal-favorite__header__title']}>내가 찜한 메뉴</h2>
          <Sparkles className={styles['meal-favorite__header__icon']} />
        </header>

        {FAVORITE_MEAL_MOCK.length === 0 ? (
          <div className={styles['meal-favorite__empty']}>
            <Sparkles className={styles['meal-favorite__empty__icon']} />
            <p className={styles['meal-favorite__empty__text']}>아직 찜한 메뉴가 없어요!</p>
          </div>
        ) : (
          <>
            <ul className={styles['meal-favorite__list']}>
              {FAVORITE_MEAL_MOCK.slice(0, 4).map(item => {
                const isActive = favoriteMap[item.id] ?? false;

                return (
                  <li key={item.id} className={styles['meal-favorite__list__item']}>
                    {/* TODO: 각 음식 사진이나 아이콘 추가 필요 -> 스타일 재검토 */}
                    <div className={styles['meal-favorite__list__item__info']}>
                      <span className={styles['meal-favorite__list__item__info__name']}>
                        {item.menuName}
                      </span>
                      <span className={styles['meal-favorite__list__item__info__category']}>
                        {item.category}
                      </span>
                    </div>

                    <FavoriteToggle
                      isActive={isActive}
                      onToggle={() => handleToggle(item.id)}
                      size={18}
                    />
                  </li>
                );
              })}
            </ul>

            {FAVORITE_MEAL_MOCK.length > 4 && (
              <div className={styles['meal-favorite__view-all']}>
                <button
                  type="button"
                  className={styles['meal-favorite__view-all__button']}
                  onClick={() => setIsModalOpen(true)}
                >
                  전체 찜 목록 보기
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="찜한 메뉴 리스트"
          innerClassName={styles['modal']}
        >
          <ul className={styles['modal__list']}>
            {FAVORITE_MEAL_MOCK.map(item => {
              const isActive = favoriteMap[item.id] ?? false;

              return (
                <li key={item.id} className={styles['modal__list__item']}>
                  <div className={styles['modal__list__item__info']}>
                    <span className={styles['modal__list__item__info__name']}>{item.menuName}</span>
                    <span className={styles['modal__list__item__info__category']}>
                      {item.category}
                    </span>
                  </div>

                  <FavoriteToggle
                    isActive={isActive}
                    onToggle={() => handleToggle(item.id)}
                    size={18}
                  />
                </li>
              );
            })}
          </ul>
        </Modal>
      )}
    </>
  );
}
