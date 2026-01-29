import { fetcher } from '@/app/lib/fetcher';

class FavoritesService {
  // 찜 목록 조회
  getMyFavorites(): Promise<Favorite.GetMyFavoritesRes[]> {
    return fetcher<Favorite.GetMyFavoritesRes[]>('/favorites/list', {
      method: 'GET',
      auth: true,
    });
  }

  // 찜 추가
  addFavorite(menuId: string): Promise<{ isFavorite: true }> {
    return fetcher<{ isFavorite: true }>('/favorites/add', {
      method: 'POST',
      auth: true,
      body: JSON.stringify({ menuId }),
    });
  }

  // 찜 제거
  removeFavorite(menuId: string): Promise<{ isDeleted: true }> {
    return fetcher<{ isDeleted: true }>('/favorites/remove', {
      method: 'DELETE',
      auth: true,
      body: JSON.stringify({ menuId }),
    });
  }
}

export const favoritesService = new FavoritesService();
