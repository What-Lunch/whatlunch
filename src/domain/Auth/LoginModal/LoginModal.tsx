'use client';

import Image from 'next/image';
import { useState } from 'react';
import { XIcon } from 'lucide-react';

import { useModalClose, useEscClose } from '@/shared/hooks/useEscClose';
import Button from '@/shared/components/Button';
import BaseInput from '@/shared/components/Input/BaseInput';
import { LoginModalProps } from '../types';
import PasswordInput from '@/shared/components/Input/PasswordInput';
import Google from '../../../../public/icons/google.png';

import styles from '../AuthModal.module.scss';

/**
 * TODO
 * 1. 백엔드 구현 필요 + 이에 맞는 validation 로직 구현
 * 2. 리다이렉트 구현 필요
 * 3. onSubmit 함수 구현 필요
 */

export default function LoginModal({ onClose, onSignupOpen }: LoginModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 로그인 로직 구현 필요
  };

  const { handleOverlayClick } = useModalClose(onClose);
  useEscClose(onClose);

  return (
    <section
      className={styles['overlay']}
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-modal-title"
      onClick={handleOverlayClick}
    >
      <form className={styles['modal']} onSubmit={onSubmit}>
        <button
          type="button"
          aria-label="닫기"
          onClick={onClose}
          className={styles['modal__close']}
        >
          <XIcon aria-hidden="true" />
        </button>

        <h2 className={styles['modal__title']} id="login-modal-title">
          로그인
        </h2>
        <div className={styles['login']}>
          <div className={styles['login-group']}>
            <span className={styles['login-group__label']}>이메일</span>
            <BaseInput
              value={email}
              type="email"
              placeholder="이메일을 입력하세요"
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div className={styles['login-group']}>
            <span className={styles['login-group__label']}>비밀번호</span>
            <PasswordInput
              value={password}
              placeholder="비밀번호를 입력하세요"
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <span className={styles['login__forget']}>비밀번호를 잊어버리셨나요?</span>
          <div className={styles['login__buttons']}>
            <Button type="submit" className={styles['login__buttons__button']}>
              로그인
            </Button>

            <div>
              <span className={styles['login__buttons__boolean']}>회원이 아니신가요? </span>
              <button className={styles['login__buttons__signup']} onClick={onSignupOpen}>
                회원가입하기
              </button>
            </div>
          </div>
        </div>
        <div className={styles['social']}>
          <span className={styles['social__or']}>OR</span>
          <div className={styles['social__login']}>
            <span>간편 로그인하기</span>
            <button
              role="button"
              className={styles['social__login--google']}
              aria-label="Google로 로그인"
            >
              <Image src={Google} alt="Google Logo" width={20} height={20} />
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}
