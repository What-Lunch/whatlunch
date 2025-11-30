'use client';

import { useEffect } from 'react';
import Image from 'next/image';

import Button from '@/components/common/Button';

import styles from './ResultModal.module.scss';

interface Props {
  menu: string;
  onClose: () => void;
}

const DEFAULT_IMAGE = '/foods/noimg.png';

export default function ResultModal({ menu, onClose }: Props) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  const share = async () => {
    if (!navigator.share) {
      alert('공유 기능을 지원하지 않는 브라우저입니다.');
      return;
    }

    try {
      await navigator.share({
        title: '오늘의 메뉴',
        text: `오늘의 메뉴는 ${menu}입니다!`,
      });
    } catch {
      // ignore
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.modal}
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <Image
          src={DEFAULT_IMAGE}
          alt={menu}
          width={300}
          height={200}
          className={styles['modal__image']}
        />

        <p className={styles['modal__name']}>{menu}</p>

        <div className={styles['modal__buttons']}>
          <Button variant="primary" size="md" onClick={share}>
            공유하기
          </Button>

          <Button variant="neutral" size="md">
            지도 보기
          </Button>

          <Button variant="danger" size="md" onClick={onClose}>
            닫기
          </Button>
        </div>
      </div>
    </div>
  );
}
