import { Category } from '@/types/enum';
import type { MenuCategory } from '@/features/WeatherMood/components/MenuModal/types';

const GLOBAL_FALLBACK_IMAGE = '/foods/noimg.webp';

type FoodImageRule = {
  keywords: string[];
  src: string;
};

type CategoryImageConfig = {
  defaultSrc: string;
  rules: FoodImageRule[];
};

// 카테고리별 이미지 설정
const FOOD_IMAGE_CONFIG: Record<MenuCategory, CategoryImageConfig> = {
  [Category.KOREAN]: {
    defaultSrc: '/foods/Korean/noimg.webp',
    rules: [
      { keywords: ['비빔밥'], src: '/foods/Korean/Bibimbap.webp' },
      { keywords: ['국밥'], src: '/foods/Korean/Gukbap.webp' },
      { keywords: ['불고기'], src: '/foods/Korean/Bulgogi.webp' },
      { keywords: ['삼겹살'], src: '/foods/Korean/Samgyeopsal.webp' },
      { keywords: ['냉면'], src: '/foods/Korean/Naengmyeon.webp' },
      { keywords: ['잡채'], src: '/foods/Korean/Japchae.webp' },
      { keywords: ['떡국'], src: '/foods/Korean/Tteokguk.webp' },
      { keywords: ['순두부'], src: '/foods/Korean/Sundubu_Jjigae.webp' },
    ],
  },

  [Category.CHINESE]: {
    defaultSrc: '/foods/Chinese/noimg.webp',
    rules: [
      { keywords: ['짜장'], src: '/foods/Chinese/Jajangmyeon.webp' },
      { keywords: ['짬뽕'], src: '/foods/Chinese/Jjamppong.webp' },
      { keywords: ['탕수육'], src: '/foods/Chinese/Tangsuyuk.webp' },
      { keywords: ['마파'], src: '/foods/Chinese/Mapo_Tofu.webp' },
      { keywords: ['양장피'], src: '/foods/Chinese/Yangjangpi.webp' },
      { keywords: ['유산슬'], src: '/foods/Chinese/Yusanseul.webp' },
      { keywords: ['깐풍'], src: '/foods/Chinese/Kkanpunggi.webp' },
      { keywords: ['동파'], src: '/foods/Chinese/Dongpo_Pork.webp' },
    ],
  },

  [Category.JAPANESE]: {
    defaultSrc: '/foods/Japanese/noimg.webp',
    rules: [
      { keywords: ['초밥', '스시'], src: '/foods/Japanese/Sushi.webp' },
      { keywords: ['돈코츠라멘', '라멘'], src: '/foods/Japanese/Tonkotsu_Ramen.webp' },
      { keywords: ['우동'], src: '/foods/Japanese/Udon.webp' },
      { keywords: ['야키토리'], src: '/foods/Japanese/Yakitori.webp' },
      { keywords: ['타코야키'], src: '/foods/Japanese/Takoyaki.webp' },
      { keywords: ['튀김'], src: '/foods/Japanese/Tempura.webp' },
      { keywords: ['규동'], src: '/foods/Japanese/Gyudon.webp' },
      { keywords: ['오코노미'], src: '/foods/Japanese/Okonomiyaki.webp' },
    ],
  },

  [Category.WESTERN]: {
    defaultSrc: '/foods/Western/noimg.webp',
    rules: [
      { keywords: ['피시앤칩스'], src: '/foods/Western/FishandChips.webp' },
      { keywords: ['리조또'], src: '/foods/Western/Risotto.webp' },
      { keywords: ['라자냐'], src: '/foods/Western/Lasagna.webp' },
      { keywords: ['샐러드'], src: '/foods/Western/Salad.webp' },
      { keywords: ['햄버거'], src: '/foods/Western/Hamburger.webp' },
      { keywords: ['피자'], src: '/foods/Western/Pizza.webp' },
      { keywords: ['파스타'], src: '/foods/Western/Pasta.webp' },
      { keywords: ['스테이크'], src: '/foods/Western/Steak.webp' },
    ],
  },

  [Category.SNACK]: {
    defaultSrc: '/foods/Snack/noimg.webp',
    rules: [
      { keywords: ['떡볶이'], src: '/foods/Snack/Tteokbokki.webp' },
      { keywords: ['김밥'], src: '/foods/Snack/Gimbap.webp' },
      { keywords: ['라면'], src: '/foods/Snack/Ramyeon.webp' },
      { keywords: ['토스트'], src: '/foods/Snack/Street_Toast.webp' },
      { keywords: ['핫도그'], src: '/foods/Snack/Corn_Dog.webp' },
      { keywords: ['만두'], src: '/foods/Snack/Assorted_Mandu.webp' },
      { keywords: ['닭강정'], src: '/foods/Snack/Dakgangjeong.webp' },
      { keywords: ['순대'], src: '/foods/Snack/Sundae.webp' },
    ],
  },
};

/**
 * 메뉴 이름 + 카테고리를 기준으로 음식 이미지 경로를 반환한다.
 *
 * - 키워드 매칭 실패 시: 카테고리 기본 이미지
 * - 카테고리 자체가 잘못된 경우: 글로벌 fallback 이미지
 */
export function getFoodImageByMenu(menuName: string, category: MenuCategory): string {
  const normalized = menuName.replace(/\s/g, '');
  const config = FOOD_IMAGE_CONFIG[category];

  if (!config) return GLOBAL_FALLBACK_IMAGE;

  const matched = config.rules.find(rule =>
    rule.keywords.some(keyword => normalized.includes(keyword))
  );

  return matched?.src ?? config.defaultSrc ?? GLOBAL_FALLBACK_IMAGE;
}
