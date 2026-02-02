'use client';

import { useState } from 'react';
import Image from 'next/image';

import { useEscClose } from '@/shared/hooks/useEscClose';
import { shareContent } from '../../utils/shareContent';

import Modal from '@/shared/components/Modal';
import Button from '@/shared/components/Button';

import { RouletteModalProps } from './types';
import { DEFAULT_IMAGE } from '../../constants';
import { getFoodImageByMenu } from '@/app/utils/getFoodImageByMenu';
import { Category } from '@/types/enum';

import styles from './RouletteModal.module.scss';

function isValidFoodCategory(
  category: Category
): category is Exclude<Category, Category.ALL | Category.BEST> {
  return category !== Category.ALL && category !== Category.BEST;
}

export default function RouletteModal({ menu, onClose }: RouletteModalProps) {
  // ESC 키로 닫기
  useEscClose(onClose);

  const [isImageError, setIsImageError] = useState(false);

  // 공유 클릭 처리
  const handleShareClick = async () => {

    if (!menu) return;

    const result = await shareContent('오늘의 메뉴', `오늘은 ${menu.name}로 가볼까요?`);

    if (result.ok) console.log('공유 성공');
    else if (result.cancelled) console.log('사용자 취소');
    else console.error('공유 실패:', result.error);


  const imageSrc =
    !menu || isImageError || !isValidFoodCategory(menu.category)
      ? DEFAULT_IMAGE
      : getFoodImageByMenu(menu.name, menu.category);

  return (
    <Modal isOpen={true} onClose={onClose} description="오늘은 이 메뉴로 가볼까요?">
      <div className={styles['modal__content']}>
        <Image
          src={imageSrc}
          alt={menu ? `${menu.name} 음식 이미지` : '선택된 메뉴 이미지'}
          width={300}
          height={200}
          priority
          className={styles['modal__image']}
          onError={() => setIsImageError(true)}
        />
        <p className={styles['modal__name']}>{menu?.name}</p>
        <div className={styles['modal__buttons']}>
          <Button variant="primary" size="md" onClick={handleShareClick} disabled={!menu}>
            공유하기
          </Button>

          <Button
            variant="neutral"
            size="md"
            disabled={!menu}
            onClick={() =>
              window.open(
                `https://map.kakao.com/?q=${encodeURIComponent(menu?.name ?? '')}`,
                '_blank'
              )
            }
          >
            지도 보기
          </Button>

          <Button variant="danger" size="md" onClick={onClose}>
            닫기
          </Button>
        </div>
      </div>
    </Modal>
  );
}