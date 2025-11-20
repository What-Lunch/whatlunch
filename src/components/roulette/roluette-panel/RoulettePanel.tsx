'use client';

import { useState } from 'react';
import styles from './RoulettePanel.module.scss';
import ResultModal from '../Result-modal/ResultModal';
import Roulette from '../Roulette-ui/Roulette';

export default function RoulettePanel() {
  const [items, setItems] = useState(['부대찌개', '닭개장', '동태찌개', '감자탕']);
  const [newItem, setNewItem] = useState('');
  const [result, setResult] = useState<string | null>(null);

  /** 메뉴 추가 */
  const addItem = (e?: React.FormEvent) => {
    e?.preventDefault();
    const value = newItem.trim();
    if (!value) return;

    // 중복 방지
    if (items.includes(value)) {
      alert('이미 존재하는 메뉴입니다.');
      return;
    }

    setItems([...items, value]);
    setNewItem('');
  };

  /** 메뉴 삭제 */
  const removeItem = (item: string) => {
    setItems(items.filter(v => v !== item));
  };

  return (
    <div className={styles['wrapper']}>
      <h1>오늘 뭐 먹지?</h1>

      {/* 룰렛 */}
      <Roulette items={items} onResult={value => setResult(value)} />

      {/* 입력 패널 */}
      <form className={styles['panel']} onSubmit={addItem}>
        <input
          className={styles['panel__input']}
          value={newItem}
          onChange={e => setNewItem(e.target.value)}
          placeholder="메뉴 입력"
        />

        <button className={styles['panel__button']} type="submit">
          추가
        </button>

        <button className={styles['panel__button']} type="button" onClick={() => setItems([])}>
          초기화
        </button>
      </form>

      {/* 항목 목록 */}
      <ul className={styles['list']}>
        {items.map(item => (
          <li key={item} className={styles['list__item']}>
            <span>{item}</span>

            <button className={styles['list__delete-btn']} onClick={() => removeItem(item)}>
              삭제
            </button>
          </li>
        ))}
      </ul>

      {/* 결과 모달 */}
      {result && <ResultModal menu={result} onClose={() => setResult(null)} />}
    </div>
  );
}
