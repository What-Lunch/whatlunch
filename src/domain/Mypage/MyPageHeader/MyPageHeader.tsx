'use client';

import { useRef, useState, useEffect, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Pencil, Star, Timer, Users, Utensils, RotateCcw, Image as ImageIcon } from 'lucide-react';
import { toast } from 'react-toastify';

import { ProfileImage } from '@/shared/components/ProfileImage';
import Badge, { BadgeProps } from '@/shared/components/Badge';
import { useProfileImageUpload } from '@/domain/Auth/hooks/useProfileImageUpload';

import styles from './MyPageHeader.module.scss';

const DEFAULT_USER_FALLBACK = {
  id: 'temp-user',
  nickname: '게스트',
  profileImage: '/icons/default_profile.png',
};

const DEFAULT_PROFILE_IMAGE_PATH = '/icons/default_profile.png';

const BADGES: readonly BadgeProps[] = [
  { id: 'decisions', variant: 'blue', Icon: Utensils, text: '결정 12회' },
  { id: 'top-menu', variant: 'green', Icon: Star, text: '가장 많이 나온 메뉴: 치킨' },
  { id: 'rooms', variant: 'purple', Icon: Users, text: '참여한 방 5개' },
  { id: 'avg-time', variant: 'orange', Icon: Timer, text: '평균 결정 시간 6초' },
] as const;

const MyPageHeader = ({ user }: { user: Auth.MeRes | null }) => {
  const { uploadProfileImage, removeProfileImage, isUploading } = useProfileImageUpload();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);
  const firstMenuItemRef = useRef<HTMLButtonElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const displayUser = user || DEFAULT_USER_FALLBACK;
  const isDefaultImage =
    !displayUser.profileImage || displayUser.profileImage === DEFAULT_PROFILE_IMAGE_PATH;

  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace('/');
    }
  }, [user, router]);

  useEffect(() => {
    if (!isMenuOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  useEffect(() => {
    if (!isMenuOpen) return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isMenuOpen]);

  useEffect(() => {
    if (isMenuOpen) {
      firstMenuItemRef.current?.focus();
    }
  }, [isMenuOpen]);

  const openFilePicker = () => {
    if (isUploading) return;
    fileInputRef.current?.click();
    setIsMenuOpen(false);
  };

  const handleResetImage = async () => {
    if (isUploading) return;

    try {
      await removeProfileImage();
      toast.success('기본 이미지로 변경되었습니다.');
    } catch {
      toast.error('이미지 변경에 실패했습니다.');
    } finally {
      setIsMenuOpen(false);
    }
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (isUploading) return;
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('이미지 파일만 업로드할 수 있습니다.');
      return;
    }

    try {
      await uploadProfileImage(file);
      toast.success('프로필 이미지가 변경되었습니다.');
    } catch {
      toast.error('이미지 변경 실패. 잠시 후 다시 시도해주세요.');
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  if (!user) return null;

  return (
    <section className={styles['profile-header']} aria-labelledby="profile-header-title">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={isUploading}
        hidden
      />

      <div className={styles['profile-header__avatar']} ref={avatarRef}>
        <ProfileImage src={displayUser.profileImage} variant="editable" priority />

        <button
          type="button"
          className={styles['profile-header__avatar-edit-button']}
          aria-label="프로필 이미지 편집"
          disabled={isUploading}
          onClick={e => {
            e.stopPropagation();
            setIsMenuOpen(prev => !prev);
          }}
        >
          <Pencil size={14} />
        </button>

        {isMenuOpen && !isUploading && (
          <div className={styles['profile-header__avatar-menu']} role="menu">
            <button ref={firstMenuItemRef} type="button" role="menuitem" onClick={openFilePicker}>
              <ImageIcon size={14} />
              이미지 변경
            </button>

            {!isDefaultImage && (
              <button
                type="button"
                role="menuitem"
                className={styles['profile-header__avatar-menu--danger']}
                onClick={handleResetImage}
              >
                <RotateCcw size={14} />
                기본 이미지로 변경
              </button>
            )}
          </div>
        )}
      </div>

      <div className={styles['profile-header__body']}>
        <h1 className={styles['profile-header__title']} id="profile-header-title">
          {displayUser.nickname}님의 마이페이지
        </h1>
        <p className={styles['profile-header__subtitle']}>오늘 기록이 여기에 정리돼요</p>

        <div className={styles['profile-header__stats']}>
          {BADGES.map(({ id, variant, Icon, text }) => (
            <Badge key={id} id={id} variant={variant} Icon={Icon} text={text} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default MyPageHeader;
