'use client';

import { Pencil } from 'lucide-react';
import Image from 'next/image';
import clsx from 'clsx';

import styles from './ProfileImage.module.scss';

export type ProfileImageVariant = 'plain' | 'editable';

export interface ProfileImageProps {
  src: string | null;
  variant?: ProfileImageVariant;
  alt?: string;
  className?: string;
  priority?: boolean;
  onEditClick?: () => void;
}

const DEFAULT_PROFILE_IMAGE = '/icons/default_profile.png';

export default function ProfileImage({
  src,
  variant = 'plain',
  alt = '프로필 이미지',
  className,
  priority = false,
  onEditClick,
}: ProfileImageProps) {
  const imageSrc = src || DEFAULT_PROFILE_IMAGE;
  const isEditable = variant === 'editable';

  return (
    <div className={clsx(styles['profile-image'], styles[`profile-image--${variant}`], className)}>
      <Image
        src={imageSrc}
        alt={alt}
        fill
        unoptimized
        sizes="(max-width: 768px) 100px, 120px"
        className={styles['profile-image__img']}
        priority={priority}
      />

      {isEditable && (
        <button
          type="button"
          className={styles['profile-image__edit']}
          aria-label="프로필 이미지 수정"
          onClick={onEditClick}
        >
          <Pencil size={16} />
        </button>
      )}
    </div>
  );
}
