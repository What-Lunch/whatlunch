'use client';

import { Heart } from 'lucide-react';
import styles from './FavoriteToggle.module.scss';

interface FavoriteToggleProps {
  isActive: boolean;
  onToggle?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  size?: number;
  readOnly?: boolean;
  ariaLabel?: string;
}

export default function FavoriteToggle({
  isActive,
  onToggle,
  size = 18,
  readOnly = false,
  ariaLabel,
}: FavoriteToggleProps) {
  // 읽기 전용 모드
  if (readOnly) {
    return (
      <div className={styles['favorite-display']}>
        <Heart
          size={size}
          fill={isActive ? '#ef4444' : 'none'}
          stroke={isActive ? '#ef4444' : '#9ca3af'}
        />
      </div>
    );
  }

  // 인터랙션 모드 (버튼)
  return (
    <button
      type="button"
      aria-pressed={isActive}
      aria-label={ariaLabel ?? (isActive ? '찜 해제' : '찜하기')}
      onClick={onToggle}
      className={styles['favorite-btn']}
    >
      <Heart
        size={size}
        fill={isActive ? '#ef4444' : 'none'}
        stroke={isActive ? '#ef4444' : '#9ca3af'}
      />
    </button>
  );
}
