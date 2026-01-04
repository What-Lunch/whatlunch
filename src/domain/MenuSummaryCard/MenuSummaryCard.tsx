import type { LucideIcon } from 'lucide-react';
import { TrendingUp, Layers, Clock, CookingPot, Users } from 'lucide-react';

import { MENU_SUMMARY_MOCK } from './mock';
import styles from './MenuSummaryCard.module.scss';

type MenuSummaryItemId = 'category' | 'mealTier' | 'time' | 'style'; // 아이콘 매핑용

const ITEM_ICON_MAP: Record<MenuSummaryItemId, LucideIcon> = {
  category: Layers,
  mealTier: CookingPot,
  time: Clock,
  style: Users,
};

export default function MenuSummaryCard() {
  const { title, items } = MENU_SUMMARY_MOCK;

  return (
    <section className={styles['menu-summary']} aria-label={title}>
      <header className={styles['menu-summary__header']}>
        <div className={styles['menu-summary__header-inner']}>
          <h2 className={styles['menu-summary__title']}>{title}</h2>
          <TrendingUp size={24} aria-hidden />
        </div>
      </header>

      <ul className={styles['menu-summary__list']}>
        {items.map(item => {
          const Icon = ITEM_ICON_MAP[item.id]; // item.id는 mock(satisfies)에서 MenuSummaryItemId로 보장됨

          const modifier = styles[`menu-summary__item--${item.id}`];
          // 퍼센트는 UI 깨짐 방지를 위해 0~100 범위로 보정
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
                <Icon size={16} aria-hidden />
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
                    aria-hidden
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
