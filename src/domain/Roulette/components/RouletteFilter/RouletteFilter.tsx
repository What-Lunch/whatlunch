'use client';

import { useEffect } from 'react';

import Button from '@/shared/components/Button';

import { useRouletteFilter } from '../../hooks/useRouletteFilter';
import { useFilterOptions } from '../../hooks/useFilterOptions';

import { RouletteFilterProps } from './types';
import styles from './RouletteFilter.module.scss';

export default function RouletteFilter({ onChange, disabled = false }: RouletteFilterProps) {
  // 룰렛 필터 상태 및 액션 필터링된 menus까지 훅 내부에서 관리
  const {
    state: { mode, selectedFoodTypes, selectedSituation, menus, isLoading },
    actions: { changeMode, toggleFoodType, toggleSituation },
  } = useRouletteFilter();

  // UI 렌더링을 위한 옵션 (label, icon, isActive 포함)
  const { foodOptions, situationOptions } = useFilterOptions(selectedFoodTypes, selectedSituation);

  // 룰렛 컴포넌트에 메뉴 목록 전달
  useEffect(() => {
    if (!menus) return;
    onChange(menus);
  }, [menus, onChange]);

  // 활성/비활성 탭 스타일 생성
  const modeClass = (isActive: boolean) =>
    `${styles['filter__mode__tab']} ${isActive ? styles['filter__mode__tab--active'] : ''}`;

  return (
    <div className={styles['filter']}>
      {isLoading && <div>로딩 중...</div>}
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
              onClick={() => toggleFoodType(opt.value)}
            >
              <span className={styles['filter__options__item__icon']}>{opt.icon}</span>
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
              onClick={() => toggleSituation(opt.value)}
            >
              <span className={styles['filter__options__item__icon']}>{opt.icon}</span>
              {opt.label}
            </Button>
          ))}
      </div>
    </div>
  );
}
