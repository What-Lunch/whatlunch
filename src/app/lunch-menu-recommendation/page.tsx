import type { Metadata } from 'next';
import Link from 'next/link';

const BASE_URL = 'https://whatlunch.vercel.app';

export const metadata: Metadata = {
  title: '점심 메뉴 추천 | 오늘 뭐먹지 룰렛으로 결정',
  description:
    '점심 메뉴 추천 서비스로 매일 다른 메뉴를 추천받으세요. 직장인 점심, 학생 점심, 혼밥까지 모든 상황에 맞는 메뉴를 제안합니다.',
  alternates: {
    canonical: `${BASE_URL}/lunch-menu-recommendation`,
  },
  openGraph: {
    title: '점심 메뉴 추천 | 오늘 뭐먹지 룰렛으로 결정',
    description:
      '점심 메뉴 추천 서비스로 매일 다른 메뉴를 추천받으세요. 직장인 점심, 학생 점심, 혼밥까지 모든 상황에 맞는 메뉴를 제안합니다.',
    url: `${BASE_URL}/lunch-menu-recommendation`,
    type: 'website',
  },
};

export default function LunchMenuRecommendPage() {
  return (
    <article style={{ maxWidth: 720, margin: '0 auto', padding: '32px 16px 48px' }}>
      <h1>점심 메뉴 추천 — 매일 새로운 메뉴를 만나보세요</h1>

      <p>
        점심 메뉴 추천은 직장인, 학생, 프리랜서 모두에게 필요한 서비스입니다. 매일 반복되는 메뉴
        선택의 스트레스를 줄이고, 다양한 음식을 경험할 수 있도록 도와줍니다. what lunch의 점심 메뉴
        추천 기능은 카테고리, 날씨, 기분 등 다양한 조건을 고려하여 최적의 메뉴를 제안합니다.
      </p>

      <h2>어떤 점심 메뉴를 추천받을 수 있나요?</h2>
      <p>
        한식(김치찌개, 비빔밥, 불고기), 중식(짜장면, 짬뽕, 탕수육), 일식(초밥, 라멘, 돈까스),
        양식(파스타, 스테이크, 리조또), 분식(떡볶이, 김밥, 라면) 등 수십 가지 카테고리에서 메뉴를
        추천받을 수 있습니다. 점메추 룰렛을 활용하면 더욱 재미있게 메뉴를 선택할 수 있습니다.
      </p>

      <h2>점심 메뉴 추천이 필요한 이유</h2>
      <ul>
        <li>메뉴 선택에 소비하는 시간 절약</li>
        <li>영양 균형 있는 다양한 식사 가능</li>
        <li>새로운 맛집과 메뉴 발견의 기회</li>
        <li>동료, 친구와의 메뉴 갈등 해소</li>
      </ul>

      <p>
        오늘 뭐먹지 고민은 이제 그만! 점심 메뉴 추천 서비스로 매일 점심을 더 즐겁게 만들어보세요.
        룰렛을 돌리거나 카테고리를 선택해 나만의 점심 메뉴를 추천받아보세요.
      </p>

      <nav style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 32 }}>
        <Link href="/">홈으로</Link>
        <Link href="/lunch-roulette">점메추 룰렛</Link>
        <Link href="/today-what-to-eat">오늘 뭐먹지</Link>
        <Link href="/solo-lunch-recommendation">혼밥 메뉴 추천</Link>
      </nav>
    </article>
  );
}
