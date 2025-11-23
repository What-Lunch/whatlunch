'use client';

import { useState } from 'react';
import styles from './WeatherMood.module.scss';

import WeatherRecommend from './WeatherRecommend';
import MoodRecommend from './MoodRecommend';
import type { RecommendTab } from '@/types/recommend';

const DEFAULT_TAB: RecommendTab = 'weather';

const TAB_LIST = [
  { id: 'weather', label: '날씨에 따른' },
  { id: 'mood', label: '기분에 따른' },
] as const;

export default function WeatherMood() {
  const [activeTab, setActiveTab] = useState<RecommendTab>(DEFAULT_TAB);

  const handleTabChange = (tabId: RecommendTab) => setActiveTab(tabId);

  const tabContent = {
    weather: <WeatherRecommend />,
    mood: <MoodRecommend />,
  } as const;

  return (
    <div className={styles['wrapper']}>
      <div className={styles['tabs']}>
        {TAB_LIST.map(tabItem => (
          <button
            key={tabItem.id}
            className={[styles['tab'], activeTab === tabItem.id && styles['active']]
              .filter(Boolean)
              .join(' ')}
            onClick={() => handleTabChange(tabItem.id)}
          >
            {tabItem.label}
          </button>
        ))}
      </div>

      <div className={styles['content']}>{tabContent[activeTab]}</div>
    </div>
  );
}
