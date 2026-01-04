import type { LucideIcon } from 'lucide-react';
import { TrendingUp, Layers, Clock, CookingPot, Users } from 'lucide-react';

import { MENU_SUMMARY_MOCK } from './mock';
import type { MenuSummaryItemId } from './types';

import styles from './MenuSummaryCard.module.scss';

const ITEM_ICON_MAP: Record<MenuSummaryItemId, LucideIcon> = {
  category: Layers,
  mealTier: CookingPot,
  time: Clock,
  style: Users,
};

export default function MenuSummaryCard() {
  const { items } = MENU_SUMMARY_MOCK;

  return (
    <section className={styles['menu-summary']} aria-label="최근 메뉴 성향 요약">
      <header className={styles['menu-summary__header']}>
        <div className={styles['menu-summary__header-inner']}>
          <h2 className={styles['menu-summary__title']}>최근 메뉴 성향 요약</h2>
          <TrendingUp size={24} aria-hidden="true" />
        </div>
      </header>

      <ul className={styles['menu-summary__list']}>
        {items.map(item => {
          const Icon = ITEM_ICON_MAP[item.id];
          const modifier = styles[`menu-summary__item--${item.id}`];

          const percent =
            typeof item.percentage === 'number'
              ? Math.max(0, Math.min(100, item.percentage))
              : undefined;

          return (
            <li
              key={item.id}
              className={[styles['menu-summary__item'], modifier].filter(Boolean).join(' ')}
            >
              <div className={styles['menu-summary__item-header']}>
                <Icon size={16} aria-hidden="true" />
                <span>{item.title}</span>
              </div>

              <p className={styles['menu-summary__value']}>{item.value}</p>

              {percent !== undefined && (
                <div
                  className={styles['menu-summary__bar']}
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={percent}
                >
                  <div
                    className={styles['menu-summary__bar-fill']}
                    style={{ width: `${percent}%` }}
                    aria-hidden="true"
                  />
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
