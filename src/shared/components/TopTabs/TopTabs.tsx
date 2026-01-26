'use client';

import { useEffect, useId, useState } from 'react';

import { useTopTabs } from './hooks/useTopTabs';
import type { TopTabsProps, TopTabItem } from './types';

import styles from './TopTabs.module.scss';

function TopTabs({ items, value, onChange, renderPanel, className, lazyMount }: TopTabsProps) {
  const controller = useTopTabs({ items, value, onChange });
  const { activeValue, focusIndex, registerButtonRef, setActive, onKeyDownTab } = controller;

  const tabsId = useId();

  // 한 번이라도 마운트된 탭 값 기록
  const [mountedValues, setMountedValues] = useState<Record<string, boolean>>({});

  // mountedValues 업데이트
  useEffect(() => {
    if (!lazyMount) return;

    setMountedValues(prev => (prev[activeValue] ? prev : { ...prev, [activeValue]: true }));
  }, [activeValue, lazyMount]);

  if (items.length === 0) return null;

  return (
    <div className={[styles['top-tabs'], className].filter(Boolean).join(' ')}>
      <div className={styles['top-tabs__list']} role="tablist">
        {items.map((item, index) => {
          const isSelected = item.value === activeValue;
          const isTabbable = index === focusIndex;

          const tabId = `${tabsId}-tab-${item.value}`;
          const panelId = `${tabsId}-panel-${item.value}`;

          return (
            <button
              key={item.value}
              ref={el => registerButtonRef(index, el)}
              id={tabId}
              type="button"
              role="tab"
              aria-selected={isSelected}
              aria-controls={panelId}
              tabIndex={isTabbable ? 0 : -1}
              className={[
                styles['top-tabs__tab'],
                isSelected ? styles['top-tabs__tab--active'] : '',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => setActive(item.value)}
              onKeyDown={event => onKeyDownTab(event, index)}
            >
              {item.icon ? (
                <span className={styles['top-tabs__icon']} aria-hidden="true">
                  {item.icon}
                </span>
              ) : null}
              <span className={styles['top-tabs__label']}>{item.label}</span>
            </button>
          );
        })}
      </div>

      {items.map(item => {
        const isSelected = item.value === activeValue;
        if (lazyMount && !mountedValues[item.value] && !isSelected) return null;

        const tabId = `${tabsId}-tab-${item.value}`;
        const panelId = `${tabsId}-panel-${item.value}`;

        return (
          <div
            key={item.value}
            id={panelId}
            role="tabpanel"
            aria-labelledby={tabId}
            hidden={!isSelected}
            className={[
              styles['top-tabs__panel'],
              !isSelected ? styles['top-tabs__panel--hidden'] : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {renderPanel(item.value)}
          </div>
        );
      })}
    </div>
  );
}

export default TopTabs;
export type { TopTabItem };
