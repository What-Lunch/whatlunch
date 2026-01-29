import { CarouselItem } from '@/shared/components/Carousel/type';
import { TopFavoriteMenu } from '@/app/services/backend/menus.api';
import { getFoodImageByMenu } from './getFoodImageByMenu';
import { createStoresByMenu } from './createStoresByMenu';

export function mapTopFavoritesToCarousel(menus: TopFavoriteMenu[]): CarouselItem[] {
  return menus.map((menu, index) => {
    const image = getFoodImageByMenu(menu.name, menu.category); // 이미지 보장

    return {
      id: menu.id,
      menuName: menu.name,
      rank: index + 1,
      favoriteCount: menu.favoriteCount,
      stores: createStoresByMenu(menu.name, image),
    };
  });
}
