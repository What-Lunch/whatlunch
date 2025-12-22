'use client';

import { memo, useCallback, useState } from 'react';
import { Shuffle } from 'lucide-react';

import Button from '@/shared/components/Button';
import RouletteFilter from './components/RouletteFilter';
import RouletteUi from './components/RouletteUi';
import RouletteModal from './components/RouletteModal';

import { shuffleMenus } from '@/domain/Roulette/core/shuffleMenus';

import { RouletteControllerProps } from './type';
import { MenuItem } from './utils/menuItem';

import styles from './Roulette.module.scss';

export const Roulette = memo(function Roulette({
  isSpinning,
  onSpinStart,
  onSpinResult,
  result,
}: RouletteControllerProps) {
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  // 섞기 가능 여부
  const canShuffle = menus.length > 1;

  // 메뉴 리스트 섞기
  const handleShuffle = useCallback(() => {
    if (!canShuffle) return;
    setMenus(prevMenus => shuffleMenus(prevMenus));
  }, [canShuffle]);

  // 룰렛 결과 처리
  const handleResult = useCallback(
    (item: MenuItem) => {
      setModalOpen(true);
      onSpinResult(item.name);
    },
    [onSpinResult]
  );

  // 모달 닫기
  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
  }, []);

  // 결과 모달 열기
  const openResultModal = useCallback(() => {
    if (!result) return;
    setModalOpen(true);
  }, [result]);
  console.log(result);
  return (
    <div className={styles['roulette']}>
      <p className={styles['roulette__today']}>
        오늘의 메뉴 {result ? <span>{result}</span> : <span>?</span>}
      </p>

      <div className={styles['roulette__wheel-wrapper']}>
        <Button
          variant="neutral"
          mode="fill"
          padding="0"
          fontSize="0"
          disabled={isSpinning || !canShuffle}
          onClick={handleShuffle}
          className={styles['roulette__shuffle-btn']}
        >
          <Shuffle size={20} />
        </Button>

        <RouletteUi items={menus} onStart={onSpinStart} onResult={handleResult} />
      </div>

      <div className={styles['roulette__result-btn-wrapper']}>
        <Button
          variant="neutral"
          mode="fill"
          disabled={!result || isSpinning}
          onClick={openResultModal}
        >
          결과 보기
        </Button>
      </div>

      <RouletteFilter onChange={setMenus} disabled={isSpinning} />

      {modalOpen && result && <RouletteModal menu={result} onClose={handleCloseModal} />}
    </div>
  );
});

export default Roulette;
