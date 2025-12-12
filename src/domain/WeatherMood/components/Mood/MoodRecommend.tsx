'use client';

import { useState, useCallback, useEffect } from 'react';

import { moods } from '@/domain/WeatherMood/components/Mood/utils/moodRecommend';
import { getMoodBaseMenus } from '@/domain/WeatherMood/components/Mood/utils/moodRecommend';
import type { MoodId } from '@/domain/WeatherMood/components/Mood/utils/moodRecommend';

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
        {moods.map(mood => {
          const isActive = mood.id === selectedMood;

          return (
            <button
              key={mood.id}
              className={`
                ${styles['mood-recommend__button']}
                ${isActive ? styles['mood-recommend__button--active'] : ''}
              `}
              onClick={() => handleMoodChange(mood.id)}
            >
              <span className={styles['mood-recommend__icon']}>{mood.icon}</span>
              <span className={styles['mood-recommend__label']}>{mood.label}</span>
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
