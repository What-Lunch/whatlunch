'use client';

import { useState } from 'react';

import WeatherRecommend from '@/domain/WeatherMood/components/Weather/WeatherRecommend';
import MoodRecommend from '@/domain/WeatherMood/components/Mood/MoodRecommend';

import type { TabKey } from '@/domain/WeatherMood/types';

import styles from '@/domain/WeatherMood/WeatherMood.module.scss';

// 탭 구성 정보
const TAB_META = {
  weather: {
    label: '날씨에 따른',
  },
  mood: {
    label: '기분에 따른',
  },
} as const;

export default function WeatherMood() {
  const [activeTab, setActiveTab] = useState<TabKey>('weather');

  return (
    <div className={styles['weather-mood']}>
      {/* 탭 버튼 영역 */}
      <div className={styles['weather-mood__tabs']} role="tablist" aria-label="유형 선택">
        {Object.entries(TAB_META).map(([key, { label }]) => {
          const tabId = key as TabKey;
          const isActive = activeTab === tabId;
          const panelId = `${tabId}-panel`;

          return (
            <button
              key={tabId}
              role="tab"
              aria-selected={isActive}
              aria-controls={panelId}
              tabIndex={isActive ? 0 : -1}
              className={[
                styles['weather-mood__tab'],
                isActive && styles['weather-mood__tab--active'],
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => setActiveTab(tabId)}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* 탭 별 컨텐츠 */}
      <div className={styles['weather-mood__content']}>
        <div
          id="weather-panel"
          role="tabpanel"
          aria-labelledby="weather"
          hidden={activeTab !== 'weather'}
        >
          <WeatherRecommend />
        </div>

        <div id="mood-panel" role="tabpanel" aria-labelledby="mood" hidden={activeTab !== 'mood'}>
          <MoodRecommend />
        </div>
      </div>
    </div>
  );
}
