'use client';

import Image from 'next/image';
import Button from '@/shared/components/Button';

import { ResultModalProps } from './type';
import { useEscClose } from '../../hooks/useEscClose';
import { useShare } from '../../hooks/useShare';

import styles from './ResultModal.module.scss';

const DEFAULT_IMAGE = '/foods/noimg.png';

export default function ResultModal({ menu, onClose }: ResultModalProps) {
  useEscClose(onClose);
  const share = useShare();

  const handleShare = () => {
    share('오늘의 메뉴', `오늘의 메뉴는 ${menu}입니다!`);
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
          className={styles.modal__image}
        />

        <p className={styles.modal__name}>{menu}</p>

        <div className={styles.modal__buttons}>
          <Button variant="primary" size="md" onClick={handleShare}>
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
