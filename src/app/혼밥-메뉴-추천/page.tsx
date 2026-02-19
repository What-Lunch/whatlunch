import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '혼밥 메뉴 추천 | 혼자 먹기 좋은 점심 메뉴',
  description:
    '혼밥 메뉴 추천으로 혼자서도 맛있는 점심을 즐기세요. 1인분 주문 가능한 메뉴부터 간편식까지, 혼밥러를 위한 점심 메뉴 추천 서비스입니다.',
  alternates: {
    canonical: 'https://whatlunch.vercel.app/혼밥-메뉴-추천',
  },
  openGraph: {
    title: '혼밥 메뉴 추천 | 혼자 먹기 좋은 점심 메뉴',
    description:
      '혼밥 메뉴 추천으로 혼자서도 맛있는 점심을 즐기세요. 1인분 주문 가능한 메뉴부터 간편식까지, 혼밥러를 위한 점심 메뉴 추천 서비스입니다.',
    url: 'https://whatlunch.vercel.app/혼밥-메뉴-추천',
    type: 'website',
  },
};

export default function SoloMealRecommendPage() {
  return (
    <article style={{ maxWidth: 720, margin: '0 auto', padding: '32px 16px 48px' }}>
      <h1>혼밥 메뉴 추천 — 혼자서도 맛있게</h1>

      <p>
        혼밥은 이제 특별한 일이 아닌 일상이 되었습니다. 하지만 혼자 먹을 메뉴를 고르는 건 여전히
        고민입니다. 1인분 주문이 어려운 메뉴, 혼자 먹기 민망한 식당 등 혼밥러만의 고충이 있기
        때문입니다. what lunch의 혼밥 메뉴 추천은 이런 고민을 해결해드립니다.
      </p>

      <h2>혼밥하기 좋은 메뉴는?</h2>
      <p>
        혼밥에 적합한 메뉴는 1인분 주문이 가능하고, 혼자 먹어도 부담 없는 음식입니다. 국밥, 라면,
        덮밥, 김밥, 샌드위치, 파스타, 돈까스, 냉면 등이 대표적인 혼밥 메뉴입니다. 점메추 룰렛에서
        혼밥 카테고리를 선택하면 이런 메뉴 중에서 오늘의 추천을 받을 수 있습니다.
      </p>

      <h2>혼밥 메뉴 추천 서비스의 특징</h2>
      <ul>
        <li>1인분 주문 가능한 메뉴만 엄선</li>
        <li>혼자 먹기 편한 식당 유형 고려</li>
        <li>간편하고 빠르게 먹을 수 있는 메뉴 위주</li>
        <li>가성비 좋은 혼밥 메뉴 추천</li>
      </ul>

      <p>
        오늘 뭐먹지 고민될 때, 특히 혼자 점심을 먹어야 할 때 혼밥 메뉴 추천을 활용해보세요. 룰렛 한
        번이면 혼밥 메뉴도 3초 만에 결정됩니다. 더 이상 혼밥 메뉴 고민에 시간을 쓰지 마세요!
      </p>

      <nav style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 32 }}>
        <Link href="/">홈으로</Link>
        <Link href="/점메추-룰렛">점메추 룰렛</Link>
        <Link href="/오늘-뭐먹지">오늘 뭐먹지</Link>
        <Link href="/점심-메뉴-추천">점심 메뉴 추천</Link>
      </nav>
    </article>
  );
}
