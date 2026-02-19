import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '점메추 룰렛 | 오늘 뭐먹지 점심 메뉴 추천',
  description:
    '점메추 룰렛으로 오늘 점심 메뉴를 빠르게 결정하세요. 오늘 뭐먹지 고민을 해결하는 점심 메뉴 추천 서비스입니다.',
  alternates: {
    canonical: 'https://whatlunch.vercel.app/점메추-룰렛',
  },
  openGraph: {
    title: '점메추 룰렛 | 오늘 뭐먹지 점심 메뉴 추천',
    description:
      '점메추 룰렛으로 오늘 점심 메뉴를 빠르게 결정하세요. 오늘 뭐먹지 고민을 해결하는 점심 메뉴 추천 서비스입니다.',
    url: 'https://whatlunch.vercel.app/점메추-룰렛',
    type: 'website',
  },
};

export default function JeomechuRoulettePage() {
  return (
    <article style={{ maxWidth: 720, margin: '0 auto', padding: '32px 16px 48px' }}>
      <h1>점메추 룰렛으로 오늘 뭐먹지 해결</h1>

      <p>
        점메추 룰렛은 매일 반복되는 &quot;오늘 뭐먹지?&quot; 고민을 단 3초 만에 해결해주는 점심 메뉴
        추천 서비스입니다. 한식, 중식, 일식, 양식, 분식 등 다양한 카테고리에서 랜덤으로 메뉴를
        추천받을 수 있어, 선택 장애를 겪는 직장인과 학생 모두에게 유용합니다.
      </p>

      <h2>언제 점메추 룰렛을 사용하나요?</h2>
      <p>
        점심시간이 다가오는데 뭘 먹을지 도저히 결정이 안 될 때, 동료들과 메뉴 선택으로 시간을
        낭비하고 싶지 않을 때, 혹은 새로운 메뉴에 도전하고 싶을 때 점메추 룰렛을 돌려보세요. 룰렛 한
        번이면 오늘의 점심이 결정됩니다. 매일 같은 메뉴만 먹는 지루함에서 벗어나 다양한 음식을
        경험할 수 있습니다.
      </p>

      <h2>점메추 룰렛의 장점</h2>
      <ul>
        <li>빠른 메뉴 결정 — 3초면 충분합니다</li>
        <li>다양한 카테고리별 추천으로 새로운 메뉴 발견</li>
        <li>날씨와 기분에 맞는 맞춤 추천 지원</li>
        <li>직장인, 학생, 혼밥러 모두를 위한 서비스</li>
      </ul>

      <p>
        점메추 룰렛은 what lunch 서비스의 핵심 기능으로, 단순한 랜덤 추천을 넘어 사용자의 취향과
        상황에 맞는 똑똑한 점심 메뉴 추천을 제공합니다. 지금 바로 룰렛을 돌려 오늘의 메뉴를
        결정해보세요!
      </p>

      <nav style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 32 }}>
        <Link href="/">홈으로</Link>
        <Link href="/오늘-뭐먹지">오늘 뭐먹지</Link>
        <Link href="/점심-메뉴-추천">점심 메뉴 추천</Link>
        <Link href="/혼밥-메뉴-추천">혼밥 메뉴 추천</Link>
      </nav>
    </article>
  );
}
