import { fetcher } from '@/app/lib/fetcher';
import type { MenuCategory } from '@/domain/Mypage/FavoriteMenuCard';

export interface TopFavoriteMenu {
  id: string;
  name: string;
  category: MenuCategory;
  favoriteCount: number;
}

class MenusService {
  // 룰렛 메뉴 조회
  getMenusRoulette(params: Menu.GetMenuReq): Promise<Menu.GetMenuRes[]> {
    const queryObj: Record<string, string> = {};

    if (params.category) {
      queryObj.category = Array.isArray(params.category)
        ? params.category.join(',')
        : params.category;
    }

    if (params.context) {
      queryObj.context = Array.isArray(params.context) ? params.context.join(',') : params.context;
    }

    if (params.limit !== undefined) {
      queryObj.limit = params.limit.toString();
    }

    const query = new URLSearchParams(queryObj).toString();

    return fetcher<Menu.GetMenuRes[]>(`/menus/roulette?${query}`, {
      method: 'GET',
    });
  }

  // 찜 메뉴 조회
  getTopFavoriteMenus(limit = 3): Promise<TopFavoriteMenu[]> {
    return fetcher<TopFavoriteMenu[]>(`/menus/favorites/top?limit=${limit}`, {
      method: 'GET',
    });
  }
}

export const menusService = new MenusService();
