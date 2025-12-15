'use client';

import { useCallback, useEffect, useState } from 'react';

import {
  getMoodBaseMenus,
  moodOptions,
  type MoodId,
} from '@/domain/WeatherMood/components/Mood/utils/moodRecommend';
import { generateRecommendations } from '@/domain/WeatherMood/components/Mood/utils/recommendEngine';

import styles from './MoodRecommend.module.scss';

const DEFAULT_MOOD: MoodId = 'happy';

export default function MoodRecommend() {
  // 현재 선택된 기분
  const [selectedMood, setSelectedMood] = useState<MoodId>(DEFAULT_MOOD);

  // 추천된 메뉴 목록 (기분이 바뀔 때만 갱신)
  const [recommendedMenus, setRecommendedMenus] = useState<string[]>([]);

  // 기분 선택 시 상태 변경
  const handleMoodChange = useCallback((moodId: MoodId) => {
    setSelectedMood(moodId);
  }, []);

  // 기분이 바뀔 때만 추천 메뉴 다시 생성
  useEffect(() => {
    const baseMenus = getMoodBaseMenus(selectedMood);
    const result = generateRecommendations(baseMenus);

    setRecommendedMenus(result);
  }, [selectedMood]);

  return (
    <div className={styles['mood-recommend']}>
      {/* 기분 선택 버튼 */}
      <div className={styles['mood-recommend__list']}>
        {moodOptions.map(option => {
          const isActive = option.id === selectedMood;

          return (
            <button
              key={option.id}
              className={`
                ${styles['mood-recommend__button']}
                ${isActive ? styles['mood-recommend__button--active'] : ''}
              `}
              onClick={() => handleMoodChange(option.id)}
            >
              <span className={styles['mood-recommend__icon']}>{option.icon}</span>
              <span className={styles['mood-recommend__label']}>{option.label}</span>
            </button>
          );
        })}
      </div>

      {/* 추천 메뉴 영역 */}
      <div className={styles['mood-recommend__recommend']}>
        <h4>지금 당신에게 맞는 맛</h4>

        <div className={styles['mood-recommend__cards']}>
          {recommendedMenus.map(menu => (
            <div key={menu} className={styles['mood-recommend__card']}>
              {menu}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
