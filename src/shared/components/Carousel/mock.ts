const ChineseSet1 = [
  '/foods/Chinese/Pepper_Pork.png',
  '/foods/Chinese/Sweet_Pork.png',
  '/foods/Chinese/Fried_Rice.png',
  '/foods/Chinese/Tofu_with_Sauce.png',
];

const ChineseSet2 = [
  '/foods/Chinese/Spicy_Hotpot.png',
  '/foods/Chinese/Tofu_with_Sauce.png',
  '/foods/Chinese/Spicy_Noodle_Soup.png',
  '/foods/Chinese/Fried_Rice.png',
];

const WesternSet = [
  '/foods/Western/Pasta.png',
  '/foods/Western/Risotto.png',
  '/foods/Western/Steak.png',
  '/foods/Western/Burger.png',
];

const pendingData = [
  {
    src: ChineseSet1,
    title: '청화루',
    category: 'Chinese',
    rating: 4.5,
    location: '서울대 입구',
  },
  {
    src: ChineseSet2,
    title: '사천화로',
    category: 'Chinese',
    rating: 4.2,
    location: '서울 강남',
  },
  {
    src: WesternSet,
    title: '비스트로29',
    category: 'Western',
    rating: 3.8,
    location: '홍대 입구',
  },
];

export default pendingData;
