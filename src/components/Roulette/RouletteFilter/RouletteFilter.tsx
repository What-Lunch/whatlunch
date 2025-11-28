'use client';

import { useState, useEffect, useRef } from 'react';
import Button from '@/components/common/Button/Button';
import styles from './RouletteFilter.module.scss';

import {
  FOOD_TYPE_FILTERS,
  SITUATION_FILTERS,
  FOOD_TYPE_ICONS,
  SITUATION_ICONS,
  FoodTypeFilter,
  SituationFilter,
  pickMenus,
} from './categories';

interface Props {
  onChange: (menus: string[]) => void;
  disabled?: boolean;
}

const ALL: FoodTypeFilter = '전체';

export default function RouletteFilter({ onChange, disabled = false }: Props) {
  const [mode, setMode] = useState<'food' | 'situation'>('food');
  const [selectedFoodTypes, setSelectedFoodTypes] = useState<FoodTypeFilter[]>([ALL]);
  const [selectedSituation, setSelectedSituation] = useState<SituationFilter>('점심');
  const hasInitialRun = useRef(false);

  /* 음식 토글 */
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

  /* 상황 토글 */
  const toggleSituation = (sit: SituationFilter) => {
    if (disabled) return;
    setSelectedSituation(prev => (prev === sit ? '점심' : sit));
  };

  useEffect(() => {
    if (mode === 'food') {
      setSelectedSituation('점심');
    } else {
      setSelectedFoodTypes([ALL]);
    }
  }, [mode]);

  /* 필터 적용 */
  useEffect(() => {
    if (!hasInitialRun.current) {
      hasInitialRun.current = true;
      return;
    }

    let menus;

    if (mode === 'food') {
      menus = pickMenus(selectedFoodTypes, null);
    } else {
      menus = pickMenus([ALL], selectedSituation);
    }

    onChange(menus.map(m => m.name));
  }, [selectedFoodTypes, selectedSituation, mode, onChange]);

  return (
    <div className={styles.filter}>
      {/* 모드 탭 */}
      <div className={styles['filter__mode']}>
        <div
          className={`${styles['mode__tab']} ${mode === 'food' ? styles['mode__tab--active'] : ''}`}
          onClick={() => !disabled && setMode('food')}
        >
          음식 종류
        </div>

        <div
          className={`${styles['mode__tab']} ${
            mode === 'situation' ? styles['mode__tab--active'] : ''
          }`}
          onClick={() => !disabled && setMode('situation')}
        >
          상황별
        </div>
      </div>

      {/* 필터 버튼 목록 */}
      <div className={styles.filter__options}>
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
                <span style={{ marginRight: 6 }}>{FOOD_TYPE_ICONS[type]}</span>
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
                <span style={{ marginRight: 6 }}>{SITUATION_ICONS[sit]}</span>
                {sit}
              </Button>
            );
          })}
      </div>
    </div>
  );
}
