import type { Metadata } from 'next';
import SoloClient from './SoloClient';

export const metadata: Metadata = {
  title: '혼밥 메뉴 정하기',
  description: '혼밥 뭐 먹지? 눈치 보지 말고 룰렛으로 정해보세요. 혼자 가기 좋은 식당 추천까지.',
  keywords: ['혼밥', '점심추천', '메뉴룰렛', '혼술', '맛집지도'],
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
  openGraph: {
    title: '혼밥 메뉴 정하기 | 결정 못하는 사람을 위한 혼자만의 룰렛',
    description: '혼밥 뭐 먹지? 눈치 보지 말고 룰렛으로 정해보세요. 혼자 가기 좋은 식당 추천까지.',
    url: 'https://whatlunch.vercel.app/rooms/solo',
  },
};

export default function SoloRoomPage() {
  return <SoloClient />;
}
