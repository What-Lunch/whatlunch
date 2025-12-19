import type { WeatherMain } from '@/types/api/weather';

// 추천 메뉴 최소 개수
export const MIN_RECOMMEND_COUNT = 6;

// 온도 구간 기준값
export const TEMP_BOUNDARY = {
  cold: 5,
  cool: 12,
  mild: 20,
  warm: 27,
} as const;

// fallback 메뉴
export const fallbackMenus: string[] = ['김밥', '라면', '샌드위치', '우동', '파스타', '샐러드'];

// 온도 구간별 추천 메뉴
export const tempMenus: Record<string, string[]> = {
  cold: ['우동', '라멘', '따뜻한 라떼', '미역국', '어묵탕', '부대찌개'],
  cool: ['칼국수', '수제비', '짜장면', '피자', '돈까스'],
  mild: ['김밥', '파스타', '샐러드', '라떼', '카레'],
  warm: ['냉모밀', '아이스라떼', '샐러드', '비빔밥', '잔치국수'],
  hot: ['냉면', '수박주스', '콩국수', '아이스크림', '메밀전병'],
};

export type TempGroup = keyof typeof tempMenus;

// 날씨 상태별 추천 메뉴
export const weatherMenus: Record<WeatherMain, string[]> = {
  Clear: ['비빔밥', '샐러드', '냉모밀', '아이스라떼', '샌드위치', '포케'],
  Clouds: ['칼국수', '수제비', '라멘', '피자', '된장찌개', '김치볶음밥'],
  Rain: ['해물파전', '막걸리', '어묵탕', '우동', '김치찌개', '짬뽕'],
  Drizzle: ['김치전', '잔치국수', '만두국', '수제비', '감자전'],
  Thunderstorm: ['부대찌개', '떡볶이', '마라탕', '매운갈비찜', '불닭'],
  Snow: ['크림스프', '핫초코', '샤브샤브', '갈비탕', '군고구마', '사골국'],
  Mist: ['쌀국수', '설렁탕', '죽', '따뜻한 차', '콩나물국밥'],
  Fog: ['곰탕', '버섯전골', '순두부찌개', '우동', '샤브샤브'],
  Haze: ['삼겹살', '목살구이', '도라지차', '물냉면', '비빔국수'],
  Dust: ['삼겹살', '오리고기', '기름진 중식', '녹차', '미나리삼겹살'],
  Sand: ['차돌박이', '매운탕', '삼겹살', '생강차', '보쌈'],
  Smoke: ['훈제오리', '삼계탕', '배숙', '콩나물국', '북엇국'],
  Ash: ['해독주스', '야채죽', '물냉면', '클린푸드'],
  Squall: ['치킨', '햄버거', '라면', '배달 족발', '피자'],
};
