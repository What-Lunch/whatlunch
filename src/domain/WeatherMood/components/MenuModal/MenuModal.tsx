'use client';

import Image from 'next/image';
import { X } from 'lucide-react';

import { getFoodImageByMenu } from '@/app/utils/getFoodImageByMenu';
import { MENU_DESCRIPTION_MAP } from './menuDescriptionMap';
import { MenuModalProps } from './types';

import styles from './MenuModal.module.scss';

export default function MenuModal({ menu, category, onClose }: MenuModalProps) {
  const imageSrc = getFoodImageByMenu(menu, category);
  const description = MENU_DESCRIPTION_MAP[menu] ?? '오늘 컨디션에 잘 어울리는 메뉴예요';

  return (
    <div className={styles['menu-modal']}>
      <button
        type="button"
        className={styles['menu-modal__overlay']}
        onClick={onClose}
        aria-label="메뉴 모달 닫기"
      />

      <div className={styles['menu-modal__container']} role="dialog" aria-modal="true">
        <button
          type="button"
          className={styles['menu-modal__close']}
          onClick={onClose}
          aria-label="닫기"
        >
          <X size={20} />
        </button>

        <div className={styles['menu-modal__image-wrap']}>
          <Image
            src={imageSrc}
            alt={menu}
            fill
            priority
            sizes="(max-width: 480px) 90vw, 360px"
            className={styles['menu-modal__image']}
          />

          <div className={styles['menu-modal__image-title']}>{menu}</div>
        </div>

        <p className={styles['menu-modal__description']}>{description}</p>
      </div>
    </div>
  );
}
