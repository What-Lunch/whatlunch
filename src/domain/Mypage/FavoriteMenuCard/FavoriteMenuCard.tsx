'use client';

import { useState, useMemo } from 'react';
import { Sparkles } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import Modal from '@/shared/components/Modal';
import FavoriteToggle from '@/shared/components/FavoriteToggle';

import styles from './FavoriteMenuCard.module.scss';
import { favoritesServiceClient } from '@/app/services/backend/favorites.api';

export default function FavoriteMenuCard({
  favoriteMenus,
}: {
  favoriteMenus: Favorite.GetMyFavoritesRes[];
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const validFavorites = useMemo(() => favoriteMenus.filter(item => item != null), [favoriteMenus]);

  // 찜 삭제
  const removeFavoriteMutation = useMutation({
    mutationFn: (menuId: string) => favoritesServiceClient.removeFavorite(menuId),

    onMutate: async menuId => {
      await queryClient.cancelQueries({ queryKey: ['favorites', 'list'] });

      const prev = queryClient.getQueryData<Favorite.GetMyFavoritesRes[]>(['favorites', 'list']);

      // 목록에서 제거
      queryClient.setQueryData<Favorite.GetMyFavoritesRes[]>(['favorites', 'list'], old => {
        if (!old) return old;
        return old.filter(item => item._id !== menuId);
      });

      return { prev };
    },

    onError: (_err, _menuId, context) => {
      if (context?.prev) {
        queryClient.setQueryData<Favorite.GetMyFavoritesRes[]>(['favorites', 'list'], context.prev);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites', 'list'] });
    },
  });

  return (
    <>
      <section aria-label="내가 찜한 메뉴" className={styles['meal-favorite']}>
        <header className={styles['meal-favorite__header']}>
          <h2 className={styles['meal-favorite__header__title']}>내가 찜한 메뉴</h2>
          <Sparkles className={styles['meal-favorite__header__icon']} />
        </header>

        {validFavorites.length === 0 ? (
          <div className={styles['meal-favorite__empty']}>
            <Sparkles className={styles['meal-favorite__empty__icon']} />
            <p className={styles['meal-favorite__empty__text']}>아직 찜한 메뉴가 없어요!</p>
          </div>
        ) : (
          <>
            <ul className={styles['meal-favorite__list']}>
              {validFavorites.slice(0, 4).map(menu => (
                <li key={menu._id} className={styles['meal-favorite__list__item']}>
                  <div className={styles['meal-favorite__list__item__info']}>
                    <span className={styles['meal-favorite__list__item__info__name']}>
                      {menu.name}
                    </span>
                    <span className={styles['meal-favorite__list__item__info__category']}>
                      {menu.category}
                    </span>
                  </div>

                  <FavoriteToggle
                    isActive
                    onToggle={() => removeFavoriteMutation.mutate(menu._id)}
                    size={18}
                  />
                </li>
              ))}
            </ul>

            {validFavorites.length > 4 && (
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

      {/* 전체보기 모달 */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="찜한 메뉴 리스트"
          innerClassName={styles['modal']}
        >
          <ul className={styles['modal__list']}>
            {validFavorites.map(menu => (
              <li key={menu._id} className={styles['modal__list__item']}>
                <div className={styles['modal__list__item__info']}>
                  <span className={styles['modal__list__item__info__name']}>{menu.name}</span>
                  <span className={styles['modal__list__item__info__category']}>
                    {menu.category}
                  </span>
                </div>

                <FavoriteToggle
                  isActive
                  onToggle={() => removeFavoriteMutation.mutate(menu._id)}
                  size={18}
                />
              </li>
            ))}
          </ul>
        </Modal>
      )}
    </>
  );
}
