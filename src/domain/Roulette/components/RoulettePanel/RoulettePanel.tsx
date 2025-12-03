'use client';

import { useState } from 'react';

import Roulette from '../RouletteUi/RouletteUi';
import ResultModal from '../ResultModal/ResultModal';

import { useRouletteItems } from '../../hooks/useRouletteItem';

import styles from './RoulettePanel.module.scss';

export default function RoulettePanel() {
  const { items, newItem, isDuplicate, handleChange, addItem, removeItem, reset } =
    useRouletteItems();

  const [result, setResult] = useState<string | null>(null);

  return (
    <div className={styles.wrapper}>
      <h1>오늘 뭐 먹지?</h1>

      <Roulette items={items} onResult={value => setResult(value)} />

      <form
        className={styles.panel}
        onSubmit={e => {
          e.preventDefault();
          addItem();
        }}
      >
        <input
          className={`${styles['panel__input']} ${
            isDuplicate ? styles['panel__input--error'] : ''
          }`}
          value={newItem}
          onChange={e => handleChange(e.target.value)}
          placeholder="메뉴 입력"
        />

        <button className={styles['panel__button']} type="submit">
          추가
        </button>

        <button className={styles['panel__button']} type="button" onClick={reset}>
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
