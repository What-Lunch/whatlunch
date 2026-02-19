import type { Metadata } from 'next';
import Link from 'next/link';
import MainClient from './MainClient';

export const metadata: Metadata = {
  title: {
    absolute: '오늘 뭐먹지? | 직장인 점심 메뉴 추천 & 맛집 지도',
  },
  description:
    '매일 반복되는 점심 고민, 룰렛으로 해결하세요. 날씨와 기분에 딱 맞는 메뉴 추천부터 근처 맛집 검색까지 한 번에!',
  alternates: {
    canonical: 'https://whatlunch.vercel.app',
  },
  openGraph: {
    siteName: 'WhatLunch',
    title: '오늘 뭐먹지? | 직장인 점심 메뉴 추천 & 맛집 지도',
    description:
      '매일 반복되는 점심 고민, 룰렛으로 해결하세요. 날씨와 기분에 딱 맞는 메뉴 추천부터 근처 맛집 검색까지 한 번에!',
    url: 'https://whatlunch.vercel.app',
    type: 'website',
  },
};

export default function HomePage() {
  return (
    <>
      <MainClient />

      <section style={{ maxWidth: 720, margin: '64px auto 0', padding: '0 16px 48px' }}>
        <h1>오늘 뭐먹지? 점메추 룰렛으로 점심 메뉴 추천</h1>

        <p>
          오늘 뭐먹지 고민될 때 점메추 룰렛으로 빠르게 메뉴를 결정하세요. 직장인 점심 메뉴 추천,
          혼밥 메뉴 추천까지 지원하는 메뉴 추천 서비스입니다. what lunch 검색으로도 쉽게 찾을 수
          있습니다.
        </p>

        <p>
          매일 반복되는 점심 고민을 줄이고 싶다면 점메추 룰렛을 통해 빠르게 메뉴를 선택해보세요.
          다양한 카테고리별 추천과 날씨 기반 추천까지, 당신의 점심 선택을 도와드립니다.
        </p>

        <nav style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 24 }}>
          <Link href="/점메추-룰렛">점메추 룰렛</Link>
          <Link href="/오늘-뭐먹지">오늘 뭐먹지</Link>
          <Link href="/점심-메뉴-추천">점심 메뉴 추천</Link>
          <Link href="/혼밥-메뉴-추천">혼밥 메뉴 추천</Link>
        </nav>
      </section>
    </>
  );
}
