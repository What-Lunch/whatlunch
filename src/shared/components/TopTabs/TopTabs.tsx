'use client';

import { useTopTabs } from './hooks/useTopTabs';
import type { TopTabsProps } from './types';

import styles from './TopTabs.module.scss';

function TopTabs({ items, value, onChange, renderPanel, className }: TopTabsProps) {
  const controller = useTopTabs({ items, value, onChange });
  const { activeValue, focusIndex, registerButtonRef, setActive, onKeyDownTab } = controller;

  if (items.length === 0) return null;

  return (
    <div className={[styles['top-tabs'], className].filter(Boolean).join(' ')}>
      <div className={styles['top-tabs__list']}>
        {items.map((item, index) => {
          const isSelected = item.value === activeValue;
          const isTabbable = index === focusIndex;

          return (
            <button
              key={item.value}
              ref={el => registerButtonRef(index, el)}
              type="button"
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

        return (
          <div
            key={item.value}
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
