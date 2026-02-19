import type { Metadata } from 'next';
import Link from 'next/link';

const BASE_URL = 'https://whatlunch.vercel.app';

export const metadata: Metadata = {
  title: '오늘 뭐먹지? | 점심 메뉴 추천 룰렛 서비스',
  description:
    '오늘 뭐먹지 고민될 때 룰렛으로 빠르게 점심 메뉴를 결정하세요. 직장인, 학생 모두를 위한 점심 메뉴 추천 서비스입니다.',
  alternates: {
    canonical: `${BASE_URL}/today-what-to-eat`,
  },
  openGraph: {
    title: '오늘 뭐먹지? | 점심 메뉴 추천 룰렛 서비스',
    description:
      '오늘 뭐먹지 고민될 때 룰렛으로 빠르게 점심 메뉴를 결정하세요. 직장인, 학생 모두를 위한 점심 메뉴 추천 서비스입니다.',
    url: `${BASE_URL}/today-what-to-eat`,
    type: 'website',
  },
};

export default function TodayWhatToEatPage() {
  return (
    <article style={{ maxWidth: 720, margin: '0 auto', padding: '32px 16px 48px' }}>
      <h1>오늘 뭐먹지? 더 이상 고민하지 마세요</h1>

      <p>
        &quot;오늘 뭐먹지?&quot;는 대한민국 직장인과 학생이 매일 점심시간마다 하는 가장 흔한
        고민입니다. 메뉴를 고르는 데 걸리는 평균 시간은 무려 15분이라는 조사 결과도 있습니다. 이
        소중한 시간을 아끼고 싶다면, 점메추 룰렛으로 빠르게 메뉴를 결정해보세요.
      </p>

      <h2>오늘 뭐먹지 고민, 이렇게 해결하세요</h2>
      <p>
        what lunch 서비스는 다양한 방법으로 오늘의 점심 메뉴를 추천합니다. 룰렛을 돌려 빠르게 결정할
        수도 있고, 날씨와 기분에 따른 맞춤 추천을 받을 수도 있습니다. 한식, 중식, 일식, 양식 등
        카테고리별 필터를 통해 원하는 종류의 음식 중에서 추천을 받을 수도 있어 더욱 만족스러운
        선택이 가능합니다.
      </p>

      <h2>이런 상황에서 활용하세요</h2>
      <ul>
        <li>점심시간 직전, 동료와 메뉴 합의가 안 될 때</li>
        <li>매일 같은 메뉴에 질렸을 때</li>
        <li>새로운 음식에 도전하고 싶을 때</li>
        <li>혼밥할 메뉴를 빠르게 정하고 싶을 때</li>
      </ul>

      <p>
        더 이상 &quot;오늘 뭐먹지&quot; 고민으로 시간을 낭비하지 마세요. 점메추 룰렛 한 번이면
        오늘의 점심이 바로 결정됩니다. 지금 바로 체험해보세요!
      </p>

      <nav style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 32 }}>
        <Link href="/">홈으로</Link>
        <Link href="/lunch-roulette">점메추 룰렛</Link>
        <Link href="/lunch-menu-recommendation">점심 메뉴 추천</Link>
        <Link href="/solo-lunch-recommendation">혼밥 메뉴 추천</Link>
      </nav>
    </article>
  );
}
