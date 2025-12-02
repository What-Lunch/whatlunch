import { MENU_DATA } from '../constants/menuData';
import { FoodTypeFilter, SituationFilter } from '../types/filters';
import { MenuItem } from '../types/menu';

export function pickMenus(types: FoodTypeFilter[], situation: SituationFilter | null): MenuItem[] {
  let pool = MENU_DATA;

  const isOnlyAll = types.length === 1 && types[0] === '전체';

  if (!isOnlyAll) {
    pool = pool.filter(item => item.types.some(t => types.includes(t)));
  }

  if (situation) {
    pool = pool.filter(item => item.situations.includes(situation));
  }

  if (pool.length === 0) {
    if (!isOnlyAll) {
      pool = MENU_DATA.filter(item => item.types.some(t => types.includes(t)));
    } else {
      pool = [...MENU_DATA];
    }
  }

  const shuffled = [...pool].sort(() => Math.random() - 0.5);

  return shuffled.slice(0, Math.max(1, Math.min(shuffled.length, 8)));
}
