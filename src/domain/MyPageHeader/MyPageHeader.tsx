'use client';

import { useRef, useState } from 'react';

import { Star, Timer, Users, Utensils } from 'lucide-react';

import type { MyPageBadge, UserProfile } from './types';

import styles from './MyPageHeader.module.scss';

const DEFAULT_USER: UserProfile = {
  id: 'temp-user',
  nickname: '코딩',
  profileImageUrl: '/icons/default_profile.png',
};

const BADGES: readonly MyPageBadge[] = [
  { id: 'decisions', tone: 'blue', Icon: Utensils, text: '결정 12회' },
  { id: 'top-menu', tone: 'green', Icon: Star, text: '가장 많이 나온 메뉴: 치킨' },
  { id: 'rooms', tone: 'purple', Icon: Users, text: '참여한 방 5개' },
  { id: 'avg-time', tone: 'orange', Icon: Timer, text: '평균 결정 시간 6초' },
] as const;

const MyPageHeader = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [user, setUser] = useState<UserProfile>(DEFAULT_USER);

  const handleClickProfile = () => {
    fileInputRef.current?.click();
  };

  const handleChangeFile: React.ChangeEventHandler<HTMLInputElement> = e => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;

    const previewUrl = URL.createObjectURL(file);

    setUser(prev => {
      if (prev.profileImageUrl.startsWith('blob:')) {
        URL.revokeObjectURL(prev.profileImageUrl);
      }
      return { ...prev, profileImageUrl: previewUrl };
    });

    e.target.value = '';
  };

  return (
    <header className={styles['profile-header']}>
      <button
        type="button"
        className={styles['profile-header__avatar']}
        onClick={handleClickProfile}
        aria-label="프로필 사진 변경"
      >
        <img
          className={styles['profile-header__avatar-image']}
          src={user.profileImageUrl}
          alt="프로필 이미지"
        />
        <span className={styles['profile-header__edit-icon']} aria-hidden="true">
          <img
            src="/icons/pencil.png"
            alt="프로필 편집 아이콘"
            className={styles['profile-header__edit-icon-image']}
          />
        </span>
      </button>

      <div className={styles['profile-header__body']}>
        <h1 className={styles['profile-header__title']}>{user.nickname}님의 마이페이지</h1>
        <p className={styles['profile-header__subtitle']}>오늘 기록이 여기에 정리돼요</p>

        <div className={styles['profile-header__stats']}>
          {BADGES.map(({ id, tone, Icon, text }) => (
            <span
              key={id}
              className={`${styles['profile-header__stat']} ${styles[`profile-header__stat--${tone}`]}`}
            >
              <Icon className={styles['profile-header__stat-icon']} />
              {text}
            </span>
          ))}
        </div>
      </div>

      <input
        ref={fileInputRef}
        className={styles['profile-header__file-input']}
        type="file"
        accept="image/*"
        onChange={handleChangeFile}
      />
    </header>
  );
};

export default MyPageHeader;
