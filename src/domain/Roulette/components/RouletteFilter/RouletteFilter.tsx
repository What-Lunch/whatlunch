'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';

import Button from '@/shared/components/Button';
import { Category, Context } from '@/types/enum';

import { useRouletteFilter } from '../../hooks/useRouletteFilter';
import { useFilterOptions } from '../../hooks/useFilterOptions';

import styles from './RouletteFilter.module.scss';

interface RouletteFilterProps {
  onChange: (menus: Menu.GetMenuRes[]) => void;
  onFiltersChange?: (
    filters: { category?: Category[]; context?: Context[] },
    mode: 'category' | 'context',
    selectedFoodTypes: Category | null,
    selectedSituation: Context | null
  ) => void;
  disabled?: boolean;
  syncedFilterState?: {
    mode: 'category' | 'context';
    selectedFoodTypes: Category | null;
    selectedSituation: Context | null;
  } | null;
  isVisible?: boolean;
}

export default function RouletteFilter({
  onChange,
  onFiltersChange,
  disabled = false,
  syncedFilterState = null,
  isVisible = true,
}: RouletteFilterProps) {
  const {
    state: { mode, selectedFoodTypes, selectedSituation, menus },
    actions: { changeMode, toggleFoodType, toggleSituation },
  } = useRouletteFilter(syncedFilterState);

  const { foodOptions, situationOptions } = useFilterOptions(selectedFoodTypes, selectedSituation);

  const params = useParams();
  const roomCode = (params.roomId as string) || 'solo';
  const isSoloMode = roomCode === 'solo';

  // ============ 메뉴 변경 감지 ============
  useEffect(() => {
    if (!menus || menus.length === 0) return;
    if (isSoloMode || localStorage.getItem(`role_${roomCode}`) === 'host') {
      onChange(menus);
    }
  }, [menus, onChange, isSoloMode, roomCode]);

  // ============ 필터 변경 감지 ============
  useEffect(() => {
    if (isSoloMode) return;

    onFiltersChange?.(
      {
        category: selectedFoodTypes ? [selectedFoodTypes] : undefined,
        context: selectedSituation ? [selectedSituation] : undefined,
      },
      mode,
      selectedFoodTypes,
      selectedSituation
    );
  }, [selectedFoodTypes, selectedSituation, mode, isSoloMode, onFiltersChange]);

  const modeClass = (isActive: boolean) =>
    `${styles['filter__mode__tab']} ${isActive ? styles['filter__mode__tab--active'] : ''}`;

  return (
    <div className={styles['filter']} style={{ display: isVisible ? 'block' : 'none' }}>
      <div className={styles['filter__mode']}>
        <button
          type="button"
          disabled={disabled}
          className={modeClass(mode === 'category')}
          onClick={() => changeMode('category')}
        >
          음식 종류
        </button>

        <button
          type="button"
          disabled={disabled}
          className={modeClass(mode === 'context')}
          onClick={() => changeMode('context')}
        >
          상황별
        </button>
      </div>

      <div className={styles['filter__options']}>
        {mode === 'category' &&
          foodOptions.map(opt => (
            <Button
              key={opt.value}
              disabled={disabled}
              variant="primary"
              mode={opt.isActive ? 'fill' : 'outline'}
              padding="8px 18px"
              fontSize="14px"
              className={styles['filter__options__item']}
              onClick={() => toggleFoodType(opt.value as Category)}
            >
              {opt.icon}
              {opt.label}
            </Button>
          ))}

        {mode === 'context' &&
          situationOptions.map(opt => (
            <Button
              key={opt.value}
              disabled={disabled}
              variant="primary"
              mode={opt.isActive ? 'fill' : 'outline'}
              padding="8px 18px"
              fontSize="14px"
              className={styles['filter__options__item']}
              onClick={() => toggleSituation(opt.value as Context)}
            >
              {opt.icon}
              {opt.label}
            </Button>
          ))}
      </div>
    </div>
  );
}
