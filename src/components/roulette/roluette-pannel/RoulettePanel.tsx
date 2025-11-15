'use client';

import { useState } from 'react';
import styles from './RoulettePanel.module.scss';
import ResultModal from '@/components/roulette/result-modal/ResultModal';
import Roulette from '../roulette-ui/Roulette';

export default function RoulettePanel() {
  const [items, setItems] = useState(['부대찌개', '닭개장', '동태찌개', '감자탕']);
  const [newItem, setNewItem] = useState('');

  const [result, setResult] = useState<string | null>(null); // 모달용 상태

  /** 항목 추가 */
  const addItem = () => {
    if (!newItem.trim()) return;
    setItems([...items, newItem.trim()]);
    setNewItem('');
  };

  /** 항목 삭제 */
  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  /** 모두 초기화 */
  const resetItems = () => setItems([]);

  return (
    <div className={styles.wrapper}>
      <h1>오늘 뭐 먹지?</h1>

      {/* 룰렛 */}
      <Roulette
        items={items}
        onResult={value => setResult(value)} // alert → 모달로 변경
      />

      {/* 입력 패널 */}
      <div className={styles.panel}>
        <input value={newItem} onChange={e => setNewItem(e.target.value)} placeholder="메뉴 입력" />
        <button onClick={addItem}>추가</button>
        <button onClick={resetItems}>초기화</button>
      </div>

      {/* 항목 목록 */}
      <ul className={styles.list}>
        {items.map((item, i) => (
          <li key={i}>
            <span>{item}</span>
            <button onClick={() => removeItem(i)}>삭제</button>
          </li>
        ))}
      </ul>

      {/* 결과 모달 */}
      {result && <ResultModal menu={result} onClose={() => setResult(null)} />}
    </div>
  );
}
