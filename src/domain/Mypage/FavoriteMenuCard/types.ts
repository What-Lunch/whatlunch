export enum MenuCategory {
  KOREAN = 'korean',
  CHINESE = 'chinese',
  JAPANESE = 'japanese',
  WESTERN = 'western',
  SNACK = 'snack',
}
export interface FavoriteMenu {
  id: string;
  name: string;
  category: MenuCategory;
}

export interface GetMyFavoritesRes {
  id: string;
  menuId: FavoriteMenu | null;
  createdAt: string;
}
