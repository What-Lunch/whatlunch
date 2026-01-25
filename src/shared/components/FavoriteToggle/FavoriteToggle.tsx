'use client';

import { Heart } from 'lucide-react';

import styles from './FavoriteToggle.module.scss';

interface FavoriteToggleProps {
  isActive: boolean;
  onToggle?: () => void;
  size?: number;
  readOnly?: boolean;
}

export default function FavoriteToggle({
  isActive,
  onToggle,
  size = 18,
  readOnly = false,
}: FavoriteToggleProps) {
  const heartIcon = (
    <Heart
      size={size}
      fill={isActive ? '#ef4444' : 'none'}
      stroke={isActive ? '#ef4444' : '#9ca3af'}
    />
  );

  // 읽기 전용 모드 (단순 표시, 클릭 X)
  if (readOnly) {
    return <div className={styles['favorite-display']}>{heartIcon}</div>;
  }

  // 인터랙션 모드 (버튼, 클릭 O)
  return (
    <button
      type="button"
      aria-pressed={isActive}
      aria-label={isActive ? '찜 해제' : '찜하기'}
      onClick={onToggle}
      className={styles['favorite-btn']}
    >
      {heartIcon}
    </button>
  );
}
