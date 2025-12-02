'use client';

import { useState, useEffect, useRef } from 'react';

import Button from '@/shared/components/Button';

import { pickMenus } from '@/shared/utils/recommend/pickMenus';

import { RouletteFilterProps } from './type';
import { FoodTypeFilter, SituationFilter } from '@/types/filters';

import { FOOD_TYPE_FILTERS, SITUATION_FILTERS } from '@/shared/constants/filters';
import { FOOD_TYPE_ICONS, SITUATION_ICONS } from '@/shared/constants/icons';

import styles from './RouletteFilter.module.scss';

const ALL: FoodTypeFilter = '전체';

export default function RouletteFilter({ onChange, disabled = false }: RouletteFilterProps) {
  const [mode, setMode] = useState<'food' | 'situation'>('food');
  const [selectedFoodTypes, setSelectedFoodTypes] = useState<FoodTypeFilter[]>([ALL]);
  const [selectedSituation, setSelectedSituation] = useState<SituationFilter | null>(null);
  const isFirstRun = useRef(true);

  const toggleFoodType = (type: FoodTypeFilter) => {
    if (disabled) return;

    const isAll = type === ALL;
    const hasAll = selectedFoodTypes.includes(ALL);
    const isSelected = selectedFoodTypes.includes(type);

    if (isAll) return setSelectedFoodTypes([ALL]);
    if (hasAll) return setSelectedFoodTypes([type]);

    if (isSelected) {
      const updated = selectedFoodTypes.filter(t => t !== type);
      return setSelectedFoodTypes(updated.length ? updated : [ALL]);
    }

    setSelectedFoodTypes(prev => [...prev, type]);
  };

  const toggleSituation = (sit: SituationFilter) => {
    if (disabled) return;
    setSelectedSituation(prev => (prev === sit ? null : sit));
  };

  useEffect(() => {
    if (mode === 'food') {
      setSelectedSituation(null);
    } else {
      setSelectedFoodTypes([ALL]);
    }
  }, [mode]);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }

    const menus =
      mode === 'food' ? pickMenus(selectedFoodTypes, null) : pickMenus([ALL], selectedSituation);

    onChange(menus.map(m => m.name));
  }, [selectedFoodTypes, selectedSituation, mode, onChange]);

  return (
    <div className={styles['filter']}>
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
                className={styles['pill']}
                onClick={() => toggleFoodType(type)}
              >
                <span className={styles['icon']}>{FOOD_TYPE_ICONS[type]}</span>
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
                className={styles['pill']}
                onClick={() => toggleSituation(sit)}
              >
                <span className={styles['icon']}>{SITUATION_ICONS[sit]}</span>
                {sit}
              </Button>
            );
          })}
      </div>
    </div>
  );
}
