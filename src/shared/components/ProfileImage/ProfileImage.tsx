'use client';

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
}

const DEFAULT_PROFILE_IMAGE = '/icons/default_profile.png';

export default function ProfileImage({
  src,
  variant = 'plain',
  alt = '프로필 이미지',
  className,
  priority = false,
}: ProfileImageProps) {
  const imageSrc = src || DEFAULT_PROFILE_IMAGE;

  return (
    <div className={clsx(styles['profile-image'], styles[`profile-image--${variant}`], className)}>
      <Image
        src={imageSrc}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100px, 120px"
        className={styles['profile-image__img']}
        priority={priority}
      />
    </div>
  );
}
