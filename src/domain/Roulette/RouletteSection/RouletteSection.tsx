'use client';

import { useState, memo } from 'react';
import { Shuffle } from 'lucide-react';

import Button from '@/shared/components/Button';
import { ResultModal } from '../ResultModal';
import { Roulette } from '../RouletteUi';
import { RouletteFilter } from '../../../domain/Roulette/RouletteFilter';

import { RouletteSectionProps } from './type';

import styles from './RouletteSection.module.scss';

export const RouletteSection = memo(function RouletteSection({
  isSpinning,
  onSpinStart,
  onSpinResult,
}: RouletteSectionProps) {
  const [menus, setMenus] = useState<string[]>([]);
  const [result, setResult] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className={styles.wrapper}>
      <p className={styles.today}>오늘의 메뉴 {result ? <span>{result}</span> : <span>?</span>}</p>

      <div className={styles.rouletteWrapper}>
        <Button
          variant="neutral"
          mode="fill"
          padding="0"
          fontSize="0"
          disabled={isSpinning || menus.length < 2}
          onClick={() => setMenus(prev => [...prev].sort(() => Math.random() - 0.5))}
          className={styles.shuffleBtn}
        >
          <Shuffle size={20} />
        </Button>

        <Roulette
          items={menus}
          onStart={onSpinStart}
          onResult={menu => {
            setResult(menu);
            setModalOpen(true);
            onSpinResult(menu);
          }}
        />
      </div>

      <div className={styles.resultBtnWrapper}>
        <Button
          variant="neutral"
          mode="fill"
          disabled={!result || isSpinning}
          onClick={() => setModalOpen(true)}
        >
          결과 보기
        </Button>
      </div>

      <RouletteFilter onChange={setMenus} disabled={isSpinning} />

      {modalOpen && result && <ResultModal menu={result} onClose={() => setModalOpen(false)} />}
    </div>
  );
});
