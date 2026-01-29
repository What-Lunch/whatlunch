import { Category } from '@/types/enum';

// 메뉴 카테고리 (ALL, BEST 제외)
type MenuCategory = Exclude<Category, Category.ALL | Category.BEST>;

export function getFoodImageByMenu(menuName: string, category: MenuCategory): string {
  const normalized = menuName.replace(/\s/g, '');

  // 한식
  if (category === Category.KOREAN) {
    if (normalized.includes('제육볶음')) return '/foods/Korean/Jeyuk_bokkeum.png';
    if (normalized.includes('불고기')) return '/foods/Korean/Bulgogi.png';
    if (normalized.includes('된장찌개')) return '/foods/Korean/Doenjang.png';
    if (normalized.includes('김치찌개')) return '/foods/Korean/Kimchi_jjigae.png';
    if (normalized.includes('비빔밥')) return '/foods/Korean/Bibimbap.png';
    return '/foods/Korean/noimg.png';
  }

  // 중식
  if (category === Category.CHINESE) {
    if (normalized.includes('볶음밥')) return '/foods/Chinese/Fried_Rice.png';
    if (normalized.includes('마라탕')) return '/foods/Chinese/Spicy_Hotpot.png';
    if (normalized.includes('탕수육')) return '/foods/Chinese/Sweet_Pork.png';
    if (normalized.includes('짬뽕')) return '/foods/Chinese/Jjambbong.png';
    return '/foods/Chinese/noimg.png';
  }

  // 양식
  if (category === Category.WESTERN) {
    if (normalized.includes('파스타')) return '/foods/Western/Pasta.png';
    if (normalized.includes('피자')) return '/foods/Western/Pizza.png';
    if (normalized.includes('스테이크')) return '/foods/Western/Steak.png';
    if (normalized.includes('샐러드')) return '/foods/Western/Salad.png';
    return '/foods/Western/noimg.png';
  }

  // 일식
  if (category === Category.JAPANESE) {
    if (normalized.includes('초밥') || normalized.includes('스시'))
      return '/foods/Japanese/Sushi.png';
    if (normalized.includes('라멘')) return '/foods/Japanese/Miso_ramen.png';
    if (normalized.includes('돈카츠') || normalized.includes('돈까스'))
      return '/foods/Japanese/Tonkatsu.png';
    if (normalized.includes('우동')) return '/foods/Japanese/Udon.png';
    return '/foods/Japanese/noimg.png';
  }

  // 스낵
  if (category === Category.SNACK) {
    if (normalized.includes('떡볶이')) return '/foods/Snack/Tteokbokki.png';
    if (normalized.includes('튀김')) return '/foods/Snack/Fried.png';
    if (normalized.includes('라면')) return '/foods/Snack/Ramen.png';
    return '/foods/Snack/noimg.png';
  }

  // fallback
  return '/foods/Korean/noimg.png';
}
