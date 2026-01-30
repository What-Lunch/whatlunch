import Modal from '@/shared/components/Modal';
import type { FaqModalProps } from './types';
import { useCallback, useRef, useState } from 'react';
import styles from './FaqModal.module.scss';
import { BaseInput } from '@/shared/components/Input';

export default function FaqModal({ isOpen, onClose }: FaqModalProps) {
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setSubmitting(true);
      setTimeout(() => {
        alert('문의가 정상적으로 접수되었습니다!');
        setSubmitting(false);
        nameRef.current!.value = '';
        emailRef.current!.value = '';
        messageRef.current!.value = '';
        onClose();
      }, 800);
    },
    [onClose]
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="문의하기"
      description="궁금한 점이나 불편한 점을 남겨주시면 빠르게 답변드리겠습니다."
      innerClassName={styles['faq-modal']}
    >
      <form className={styles['faq-form']} onSubmit={handleSubmit}>
        <label className={styles['faq-form__label']}>
          이름
          <BaseInput type="text" ref={nameRef} required placeholder="이름을 입력하세요" />
        </label>
        <label className={styles['faq-form__label']}>
          이메일
          <BaseInput type="email" ref={emailRef} required placeholder="이메일을 입력하세요" />
        </label>
        <label className={styles['faq-form__label']}>
          문의 내용
          <textarea
            ref={messageRef}
            className={styles['faq-form__textarea']}
            required
            placeholder="문의하실 내용을 입력하세요"
            rows={5}
          />
        </label>
        <button type="submit" className={styles['faq-form__submit']} disabled={submitting}>
          {submitting ? '제출 중...' : '문의 제출하기'}
        </button>
      </form>
    </Modal>
  );
}
