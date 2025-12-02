'use client';

import { useState } from 'react';

import Roulette from '../RouletteUi/RouletteUi';
import ResultModal from '../ResultModal/ResultModal';

import styles from './RoulettePanel.module.scss';

export default function RoulettePanel() {
  const [items, setItems] = useState<string[]>([]);
  const [newItem, setNewItem] = useState('');
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    setNewItem(value);

    // 중복 여부만 체크
    setIsDuplicate(items.includes(value));
  };

  const addItem = (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!newItem) return;
    if (isDuplicate) return;

    setItems(prev => [...prev, newItem]);
    setNewItem('');
    setIsDuplicate(false);
  };

  const removeItem = (item: string) => {
    setItems(prev => prev.filter(v => v !== item));

    setIsDuplicate(newItem.trim() !== '' && items.includes(newItem.trim()));
  };

  return (
    <div className={styles.wrapper}>
      <h1>오늘 뭐 먹지?</h1>

      <Roulette items={items} onResult={value => setResult(value)} />

      <form className={styles.panel} onSubmit={addItem}>
        <input
          className={`${styles['panel__input']} ${
            isDuplicate ? styles['panel__input--error'] : ''
          }`}
          value={newItem}
          onChange={handleChange}
          placeholder="메뉴 입력"
        />

        <button className={styles['panel__button']} type="submit">
          추가
        </button>

        <button
          className={styles['panel__button']}
          type="button"
          onClick={() => {
            setItems([]);
            setIsDuplicate(false);
          }}
        >
          초기화
        </button>
      </form>

      <ul className={styles.list}>
        {items.map(item => (
          <li key={item} className={styles['list__item']}>
            <span>{item}</span>
            <button className={styles['list__delete-btn']} onClick={() => removeItem(item)}>
              삭제
            </button>
          </li>
        ))}
      </ul>

      {result && <ResultModal menu={result} onClose={() => setResult(null)} />}
    </div>
  );
}
