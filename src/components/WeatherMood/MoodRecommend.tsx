'use client';

import { useState, useCallback, useMemo } from 'react';
import styles from './MoodRecommend.module.scss';

import type { MoodId } from '@/types/mood';
import { moods, recommendMenu } from '@/utils/recommend/mood';

const DEFAULT_MOOD: MoodId = 'happy';

export default function MoodRecommend() {
  const [selectedMood, setSelectedMood] = useState<MoodId>(DEFAULT_MOOD);

  const handleMoodChange = useCallback(
    (moodId: MoodId) => {
      if (moodId !== selectedMood) {
        setSelectedMood(moodId);
      }
    },
    [selectedMood]
  );

  const menus = useMemo(() => {
    return recommendMenu[selectedMood] ?? [];
  }, [selectedMood]);

  return (
    <div className={styles['container']}>
      <div className={styles['moodList']}>
        {moods.map(mood => {
          const isActive = mood.id === selectedMood;

          return (
            <button
              key={mood.id}
              className={[styles['moodBtn'], isActive && styles['active']]
                .filter(Boolean)
                .join(' ')}
              onClick={() => handleMoodChange(mood.id)}
            >
              <span className={styles['icon']}>{mood.icon}</span>
              <span className={styles['label']}>{mood.label}</span>
            </button>
          );
        })}
      </div>

      <div className={styles['recommend']}>
        <h4>지금 당신에게 맞는 맛</h4>

        <div className={styles['list']}>
          {menus.map(menuItem => (
            <div key={menuItem} className={styles['card']}>
              {menuItem}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
