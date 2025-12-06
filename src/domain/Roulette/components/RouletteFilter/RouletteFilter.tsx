'use client';

import Button from '@/shared/components/Button';

import { RouletteFilterProps } from './type';

import { useRouletteFilter } from '../../hooks/useRouletteFilter';

import styles from './RouletteFilter.module.scss';

export default function RouletteFilter({ onChange, disabled = false }: RouletteFilterProps) {
  const { mode, setMode, foodOptions, situationOptions, toggleFoodType, toggleSituation } =
    useRouletteFilter(onChange);

  return (
    <div className={styles.filter}>
      <div className={styles['filter__mode']}>
        <button
          type="button"
          disabled={disabled}
          className={`${styles['mode__tab']} ${mode === 'food' ? styles['mode__tab--active'] : ''}`}
          onClick={() => setMode('food')}
        >
          음식 종류
        </button>

        <button
          type="button"
          disabled={disabled}
          className={`${styles['mode__tab']} ${
            mode === 'situation' ? styles['mode__tab--active'] : ''
          }`}
          onClick={() => setMode('situation')}
        >
          상황별
        </button>
      </div>

      <div className={styles['filter__options']}>
        {mode === 'food' &&
          foodOptions.map(opt => (
            <Button
              key={opt.value}
              disabled={disabled}
              variant="primary"
              mode={opt.isActive ? 'fill' : 'outline'}
              padding="8px 18px"
              fontSize="14px"
              className={styles.pill}
              onClick={() => toggleFoodType(opt.value)}
            >
              <span className={styles.icon}>{opt.icon}</span>
              {opt.label}
            </Button>
          ))}

        {mode === 'situation' &&
          situationOptions.map(opt => (
            <Button
              key={opt.value}
              disabled={disabled}
              variant="primary"
              mode={opt.isActive ? 'fill' : 'outline'}
              padding="8px 18px"
              fontSize="14px"
              className={styles.pill}
              onClick={() => toggleSituation(opt.value)}
            >
              <span className={styles.icon}>{opt.icon}</span>
              {opt.label}
            </Button>
          ))}
      </div>
    </div>
  );
}
