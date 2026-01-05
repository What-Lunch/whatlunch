import type { LucideIcon } from 'lucide-react';
import { ClipboardList, TrendingUp, Layers, Clock, CookingPot, Users } from 'lucide-react';

import { MENU_SUMMARY_MOCK } from './mock';
import type { MenuSummaryItemType } from './types';

import styles from './MenuSummaryCard.module.scss';

const ITEM_ICON_MAP: Record<MenuSummaryItemType, LucideIcon> = {
  category: Layers,
  mealTier: CookingPot,
  time: Clock,
  style: Users,
};

export default function MenuSummaryCard() {
  const { items } = MENU_SUMMARY_MOCK;
  const isEmpty = items.length === 0;

  return (
    <section className={styles['menu-summary']} aria-label="최근 메뉴 성향 요약">
      <header className={styles['menu-summary__header']}>
        <div className={styles['menu-summary__header-inner']}>
          <h2 className={styles['menu-summary__title']}>최근 메뉴 성향 요약</h2>
          <TrendingUp className={styles['menu-summary__header-icon']} aria-hidden="true" />
        </div>
      </header>

      {isEmpty ? (
        <div className={styles['menu-summary__empty']} aria-live="polite">
          <ClipboardList className={styles['menu-summary__empty-icon']} aria-hidden="true" />
          <p className={styles['menu-summary__empty-title']}>최근 메뉴 기록이 아직 없어요</p>
          <p className={styles['menu-summary__empty-desc']}>
            메뉴를 한 번 선택하면, 나만의 메뉴 성향 분석이 시작돼요.
          </p>
        </div>
      ) : (
        <ul className={styles['menu-summary__list']}>
          {items.map(item => {
            const Icon = ITEM_ICON_MAP[item.type];
            const modifier = styles[`menu-summary__item--${item.type}`];

            const percent =
              typeof item.percentage === 'number'
                ? Math.max(0, Math.min(100, item.percentage))
                : undefined;
            return (
              <li
                key={item.type}
                className={[styles['menu-summary__item'], modifier].filter(Boolean).join(' ')}
              >
                <div className={styles['menu-summary__item-header']}>
                  <Icon className={styles['menu-summary__item-icon']} aria-hidden="true" />
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
      )}
    </section>
  );
}
