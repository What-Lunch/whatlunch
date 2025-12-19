'use client';

import { useMemo, useState } from 'react';

import TopTabs from '@/shared/components/TopTabs';

import type { TopTabItem } from '@/shared/components/TopTabs';

type Tab2Value = 'weather' | 'mood';
type Tab3Value = 'roulette' | 'ladder' | 'map';

export default function TopTabsDevPage() {
  const items2 = useMemo(() => {
    return [
      { value: 'weather', label: '날씨' },
      { value: 'mood', label: '기분' },
    ] satisfies readonly TopTabItem[];
  }, []);

  const items3 = useMemo(() => {
    return [
      { value: 'roulette', label: '룰렛' },
      { value: 'ladder', label: '사다리' },
      { value: 'map', label: '지도' },
    ] satisfies readonly TopTabItem[];
  }, []);

  const [active2, setActive2] = useState<Tab2Value>('weather');
  const [active3, setActive3] = useState<Tab3Value>('roulette');

  return (
    <div style={{ padding: 24, maxWidth: 720, margin: '0 auto' }}>
      <h1 style={{ marginBottom: 12 }}>TopTabs 기능 테스트</h1>

      <section style={{ marginBottom: 24 }}>
        <h2 style={{ margin: 0, marginBottom: 8 }}>2개 탭: 날씨 / 기분</h2>
        <div style={{ marginBottom: 8 }}>
          <strong>현재 active:</strong> {active2}
        </div>

        <TopTabs
          items={items2}
          value={active2}
          onChange={next => setActive2(next as Tab2Value)}
          renderPanel={v => {
            if (v === 'weather') return <Panel title="(2개) 날씨 패널" />;
            return <Panel title="(2개) 기분 패널" />;
          }}
        />
      </section>

      <section>
        <h2 style={{ margin: 0, marginBottom: 8 }}>3개 탭: 룰렛 / 사다리 / 지도</h2>
        <div style={{ marginBottom: 8 }}>
          <strong>현재 active:</strong> {active3}
        </div>

        <TopTabs
          items={items3}
          value={active3}
          onChange={next => setActive3(next as Tab3Value)}
          renderPanel={v => {
            if (v === 'roulette') return <Panel title="(3개) 룰렛 패널" />;
            if (v === 'ladder') return <Panel title="(3개) 사다리 패널" />;
            return <Panel title="(3개) 지도 패널" />;
          }}
        />
      </section>

      <div style={{ marginTop: 16, fontSize: 14, lineHeight: 1.6 }}>
        <div>클릭으로 탭 전환</div>
        <div>탭에 포커스 후 ←/→ 로 포커스 이동</div>
        <div>2개/3개 탭 레이아웃(부모 100% 균등) 확인</div>
        <div>value 변경 시 패널 동기화 확인</div>
      </div>
    </div>
  );
}

function Panel({ title }: { title: string }) {
  return (
    <div style={{ padding: 16, border: '1px solid #ddd', borderRadius: 8 }}>
      <h3 style={{ margin: 0, marginBottom: 8 }}>{title}</h3>
      <p style={{ margin: 0 }}>여기 내용이 바뀌면 패널 렌더링 정상입니다. 테스트용으로 문장</p>
    </div>
  );
}
