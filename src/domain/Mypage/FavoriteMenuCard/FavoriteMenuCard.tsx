'use client';

import { useState, useMemo, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import Modal from '@/shared/components/Modal';
import FavoriteToggle from '@/shared/components/FavoriteToggle';

import styles from './FavoriteMenuCard.module.scss';
import { favoritesServiceClient } from '@/app/services/backend/favorites.api';

// 찜 추가 기준으로 정렬
type FavoriteWithAddedAt = Favorite.GetMyFavoritesRes & { addedAt?: string };

export default function FavoriteMenuCard({
  favoriteMenus,
}: {
  favoriteMenus: Favorite.GetMyFavoritesRes[];
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const [favoriteMap, setFavoriteMap] = useState<Record<string, boolean>>(() =>
    favoriteMenus
      .filter((menu): menu is Favorite.GetMyFavoritesRes => menu != null)
      .reduce((acc, menu) => ({ ...acc, [menu._id]: true }), {} as Record<string, boolean>)
  );
  const [localFavorites, setLocalFavorites] = useState<FavoriteWithAddedAt[]>([]);

  useEffect(() => {
    // 초기 로드 시 createdAt을 addedAt으로 사용
    const withAddedAt = favoriteMenus
      .filter(item => item != null)
      .map(menu => ({ ...menu, addedAt: menu.createdAt || new Date().toISOString() }));
    setLocalFavorites(withAddedAt);
  }, [favoriteMenus]);

  // 찜 추가 시점(addedAt) 기준 최신순 정렬
  const sortedFavorites = useMemo(
    () =>
      localFavorites.slice().sort((a, b) => {
        const aTime = a.addedAt || a.createdAt || '';
        const bTime = b.addedAt || b.createdAt || '';
        if (!aTime || !bTime) return 0;
        return new Date(bTime).getTime() - new Date(aTime).getTime();
      }),
    [localFavorites]
  );

  const favoriteMutation = useMutation({
    mutationFn: (menuId: string) => favoritesServiceClient.addFavorite(menuId),
    onMutate: (menuId: string) => {
      setFavoriteMap(prev => ({ ...prev, [menuId]: true }));
      // 찜 추가 시 맨 위에 배치
      const foundMenu = favoriteMenus.find(menu => menu._id === menuId);
      if (foundMenu) {
        const newMenu: FavoriteWithAddedAt = {
          ...foundMenu,
          addedAt: new Date().toISOString(),
        };
        setLocalFavorites(prev => [newMenu, ...prev.filter(menu => menu._id !== menuId)]);
      }
    },
    onError: (_err, menuId) => {
      setFavoriteMap(prev => ({ ...prev, [menuId]: false }));
      // 에러 시 원래대로 복구
      const withAddedAt = favoriteMenus
        .filter(item => item != null)
        .map(menu => ({ ...menu, addedAt: menu.createdAt || new Date().toISOString() }));
      setLocalFavorites(withAddedAt);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites', 'me'] });
    },
  });

  const unfavoriteMutation = useMutation({
    mutationFn: (menuId: string) => favoritesServiceClient.removeFavorite(menuId),
    onMutate: (menuId: string) => {
      setFavoriteMap(prev => ({ ...prev, [menuId]: false }));
      // 찜 해제 시 제거
      setLocalFavorites(prev => prev.filter(menu => menu._id !== menuId));
    },
    onError: (_err, menuId) => {
      setFavoriteMap(prev => ({ ...prev, [menuId]: true }));
      // 에러 시 원래대로 복구
      const withAddedAt = favoriteMenus
        .filter(item => item != null)
        .map(menu => ({ ...menu, addedAt: menu.createdAt || new Date().toISOString() }));
      setLocalFavorites(withAddedAt);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites', 'me'] });
    },
  });

  const handleFavoriteToggle = (menuId: string) => {
    const isActive = favoriteMap[menuId] ?? false;
    if (isActive) {
      unfavoriteMutation.mutate(menuId);
    } else {
      favoriteMutation.mutate(menuId);
    }
  };

  return (
    <>
      <section aria-label="내가 찜한 메뉴" className={styles['meal-favorite']}>
        <header className={styles['meal-favorite__header']}>
          <h2 className={styles['meal-favorite__header__title']}>내가 찜한 메뉴</h2>
          <Sparkles className={styles['meal-favorite__header__icon']} />
        </header>

        {sortedFavorites.length === 0 ? (
          <div className={styles['meal-favorite__empty']}>
            <Sparkles className={styles['meal-favorite__empty__icon']} />
            <p className={styles['meal-favorite__empty__text']}>아직 찜한 메뉴가 없어요!</p>
          </div>
        ) : (
          <>
            <ul className={styles['meal-favorite__list']}>
              {sortedFavorites.slice(0, 4).map(menu => (
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
                    isActive={favoriteMap[menu._id] ?? true}
                    onToggle={() => handleFavoriteToggle(menu._id)}
                    size={18}
                  />
                </li>
              ))}
            </ul>

            {sortedFavorites.length > 4 && (
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
            {sortedFavorites.map(menu => (
              <li key={menu._id} className={styles['modal__list__item']}>
                <div className={styles['modal__list__item__info']}>
                  <span className={styles['modal__list__item__info__name']}>{menu.name}</span>
                  <span className={styles['modal__list__item__info__category']}>
                    {menu.category}
                  </span>
                </div>

                <FavoriteToggle
                  isActive={favoriteMap[menu._id] ?? true}
                  onToggle={() => handleFavoriteToggle(menu._id)}
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
