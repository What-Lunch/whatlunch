import type { Metadata } from 'next';
import MainClient from './MainClient';

export const metadata: Metadata = {
  title: {
    absolute: '오늘 뭐 먹지? | 직장인 점심 메뉴 추천 & 맛집 지도',
  },
  description:
    '매일 반복되는 점심 고민, 룰렛으로 해결하세요. 날씨와 기분에 딱 맞는 메뉴 추천부터 근처 맛집 검색까지 한 번에!',
  openGraph: {
    title: '직장인 점심 메뉴 추천 & 맛집 지도',
    description:
      '매일 반복되는 점심 고민, 룰렛으로 해결하세요. 날씨와 기분에 딱 맞는 메뉴 추천부터 근처 맛집 검색까지 한 번에!',
    url: 'https://whatlunch.vercel.app',
  },
};

export default function HomePage() {
  return <MainClient />;
}
