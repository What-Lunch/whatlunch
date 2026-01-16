'use client';

import { useState } from 'react';
import Image from 'next/image';

import { useEscClose } from '@/shared/hooks/useEscClose';
import { shareContent } from '../../utils/shareContent';

import Modal from '@/shared/components/Modal';
import Button from '@/shared/components/Button';

import { RouletteModalProps } from './types';
import { DEFAULT_IMAGE } from '../../constants';

import styles from './RouletteModal.module.scss';

export default function RouletteModal({ menu, onClose }: RouletteModalProps) {
  // ESC 키로 닫기
  useEscClose(onClose);

  const [isImageError, setIsImageError] = useState(false);

  // 공유 클릭 처리
  // TODO: 공유로직 개선 필요
  const handleShareClick = async () => {
    const result = await shareContent('오늘의 메뉴', `오늘의 메뉴는 ${menu}입니다!`);
    if (result.ok) console.log('공유 성공');
    else if (result.cancelled) console.log('사용자 취소');
    else console.error('공유 실패:', result.error);
  };

  const imageSrc = isImageError ? DEFAULT_IMAGE : `/foods/${menu}.png`;

  return (
    <Modal isOpen={true} onClose={onClose} description={menu}>
      <div className={styles['modal__content']}>
        <Image
          src={imageSrc}
          alt={menu}
          width={300}
          height={200}
          className={styles['modal__image']}
          onError={() => setIsImageError(true)}
        />
        <p className={styles['modal__name']}>{menu}</p>
        <div className={styles['modal__buttons']}>
          <Button variant="primary" size="md" onClick={handleShareClick}>
            공유하기
          </Button>
          <Button
            variant="neutral"
            size="md"
            onClick={() =>
              window.open(`https://map.kakao.com/?q=${encodeURIComponent(menu)}`, '_blank')
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
