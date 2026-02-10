'use client';

import { useEffect, useState, useId } from 'react';
import { createPortal } from 'react-dom';
import { XIcon } from 'lucide-react';

import { useModalClose, useEscClose } from '@/shared/hooks/useEscClose';
import { ModalProps } from './types';

import styles from './Modal.module.scss';

export default function Modal({
  isOpen,
  onClose,
  title,
  description,
  contentClassName,
  innerClassName,
  children,
}: ModalProps) {
  const [mounted, setMounted] = useState(false);

  const titleId = useId();
  const descId = useId();

  const { handleOverlayClick } = useModalClose(onClose);
  useEscClose(isOpen ? onClose : undefined);

  useEffect(() => {
    if (!isOpen) return;

    const scrollY = window.scrollY;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';

    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      const top = document.body.style.top;

      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';

      const restoredY = top ? Math.abs(parseInt(top, 10)) : scrollY;
      window.scrollTo(0, restoredY);
    };
  }, [isOpen]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isOpen || typeof window === 'undefined') return null;

  return createPortal(
    <section
      className={`${styles['overlay']}${contentClassName ? ` ${contentClassName}` : ''}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
      aria-describedby={description ? 'modal-description' : undefined}
      onClick={handleOverlayClick}
    >
      <div className={`${styles['modal']}${innerClassName ? ` ${innerClassName}` : ''}`}>
        <div className={styles['modal__top']}>
          <button
            type="button"
            aria-label="닫기"
            onClick={onClose}
            className={styles['modal__header__close']}
          >
            <XIcon aria-hidden="true" size={20} />
          </button>
        </div>

        {title && (
          <h2 id={titleId} className={styles['modal__header__title']}>
            {title}
          </h2>
        )}

        {description && (
          <p id={descId} className={styles['modal__description']}>
            {description}
          </p>
        )}

        <div className={styles['modal__content']}>{children}</div>
      </div>
    </section>,
    document.body
  );
}
