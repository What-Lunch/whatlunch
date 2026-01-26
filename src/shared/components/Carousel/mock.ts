const ChineseStores = [
  {
    id: 'store-ch-01',
    name: '청화루',
    location: '서울대 입구',
    image: '/foods/Chinese/Pepper_Pork.png',
  },
  {
    id: 'store-ch-02',
    name: '사천화로',
    location: '서울 강남',
    image: '/foods/Chinese/Spicy_Hotpot.png',
  },
  {
    id: 'store-ch-03',
    name: '화룡점정',
    location: '건대',
    image: '/foods/Chinese/Fried_Rice.png',
  },
  {
    id: 'store-ch-04',
    name: '중화식탁',
    location: '합정',
    image: '/foods/Chinese/Tofu_with_Sauce.png',
  },
];

const WesternStores = [
  {
    id: 'store-w-01',
    name: '비스트로29',
    location: '홍대 입구',
    image: '/foods/Western/Steak.png',
  },
  {
    id: 'store-w-02',
    name: '라빠스타',
    location: '연남동',
    image: '/foods/Western/Pasta.png',
  },
  {
    id: 'store-w-03',
    name: '더그릴',
    location: '이태원',
    image: '/foods/Western/Burger.png',
  },
  {
    id: 'store-w-04',
    name: '루체',
    location: '성수',
    image: '/foods/Western/Risotto.png',
  },
];

const KoreanStores = [
  {
    id: 'store-k-01',
    name: '국대떡볶이',
    location: '강남',
    image: '/foods/Western/Risotto.png',
  },
  {
    id: 'store-k-02',
    name: '신전떡볶이',
    location: '홍대',
    image: '/foods/Western/Risotto.png',
  },
  {
    id: 'store-k-03',
    name: '엽기떡볶이',
    location: '잠실',
    image: '/foods/Western/Risotto.png',
  },
  {
    id: 'store-k-04',
    name: '죠스떡볶이',
    location: '합정',
    image: '/foods/Western/Risotto.png',
  },
];

const trendingMenuData = [
  {
    id: 'menu-korean-01',
    menuName: '떡볶이',
    rank: 1,
    favoriteCount: 412,
    stores: KoreanStores,
  },
  {
    id: 'menu-chinese-01',
    menuName: '중식',
    rank: 2,
    favoriteCount: 312,
    stores: ChineseStores,
  },
  {
    id: 'menu-western-01',
    menuName: '양식',
    rank: 3,
    favoriteCount: 241,
    stores: WesternStores,
  },
];

export default trendingMenuData;
