'use client';

import Button from '@/shared/components/Button';

import { RouletteFilterProps } from './type';

import { FOOD_TYPE_FILTERS, SITUATION_FILTERS } from '@/shared/constants/filters';
import { FOOD_TYPE_ICONS, SITUATION_ICONS } from '@/shared/constants/icons';

import { useRouletteFilter } from '../../hooks/useRouletteFilter';

import styles from './RouletteFilter.module.scss';

export default function RouletteFilter({ onChange, disabled = false }: RouletteFilterProps) {
  const { mode, setMode, selectedFoodTypes, toggleFoodType, selectedSituation, toggleSituation } =
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
          FOOD_TYPE_FILTERS.map(type => {
            const isActive = selectedFoodTypes.includes(type);
            return (
              <Button
                key={type}
                disabled={disabled}
                variant="primary"
                mode={isActive ? 'fill' : 'outline'}
                padding="8px 18px"
                fontSize="14px"
                className={styles.pill}
                onClick={() => toggleFoodType(type)}
              >
                <span className={styles.icon}>{FOOD_TYPE_ICONS[type]}</span>
                {type}
              </Button>
            );
          })}

        {mode === 'situation' &&
          SITUATION_FILTERS.map(sit => {
            const isActive = selectedSituation === sit;
            return (
              <Button
                key={sit}
                disabled={disabled}
                variant="primary"
                mode={isActive ? 'fill' : 'outline'}
                padding="8px 18px"
                fontSize="14px"
                className={styles.pill}
                onClick={() => toggleSituation(sit)}
              >
                <span className={styles.icon}>{SITUATION_ICONS[sit]}</span>
                {sit}
              </Button>
            );
          })}
      </div>
    </div>
  );
}
