import { fetcher } from '@/app/lib/fetcher';

class MenusService {
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

    if (params.limit !== undefined) queryObj.limit = params.limit.toString();

    const query = new URLSearchParams(queryObj).toString();

    return fetcher<Menu.GetMenuRes[]>(`/menus/roulette?${query}`, {
      method: 'GET',
    });
  }
}

export const menusService = new MenusService();
