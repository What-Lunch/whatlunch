'use client';

import Image from 'next/image';
import { useState } from 'react';
import styles from '../AuthModal.module.scss';
import { XIcon } from 'lucide-react';

import Button from '@/shared/components/Button';
import BaseInput from '@/shared/components/Input/BaseInput';
import PasswordInput from '@/shared/components/Input/PasswordInput';
import { useModalClose, useEscClose } from '@/shared/hooks/useEscClose';
import Google from '../../../../public/icons/google.png';

import { SignupModalProps } from '../types';

/**
 * TODO
 * 1. 백엔드 구현 필요 + 이에 맞는 validation 로직 구현
 * 2. 리다이렉트 구현 필요
 * 3. onSubmit 함수 구현 필요
 */

export default function SignupModal({ onClose, onLoginOpen }: SignupModalProps) {
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const { handleOverlayClick } = useModalClose(onClose);
  useEscClose(onClose);

  return (
    <section
      className={styles['overlay']}
      role="dialog"
      aria-modal="true"
      aria-labelledby="signup-modal-title"
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
        <h2 className={styles['modal__title']} id="signup-modal-title">
          회원가입
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
            <span className={styles['login-group__label']}>닉네임</span>
            <BaseInput
              value={nickname}
              type="text"
              placeholder="닉네임을 입력하세요"
              onChange={e => setNickname(e.target.value)}
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
          <div className={styles['login-group']}>
            <span className={styles['login-group__label']}>비밀번호 확인</span>
            <PasswordInput
              value={passwordConfirm}
              placeholder="비밀번호를 입력하세요"
              onChange={e => setPasswordConfirm(e.target.value)}
            />
          </div>

          <div className={styles['login__buttons']}>
            <Button type="submit" className={styles['login__buttons__button']}>
              회원가입
            </Button>
            <div>
              <span className={styles['login__buttons__boolean']}>회원이신가요? </span>
              <button
                type="button"
                className={styles['login__buttons__signup']}
                onClick={onLoginOpen}
              >
                로그인하기
              </button>
            </div>
          </div>
        </div>
        <div className={styles['social']}>
          <span className={styles['social__or']}>OR</span>
          <div className={styles['social__login']}>
            <span>간편 회원가입하기</span>
            <button
              type="button"
              role="button"
              className={styles['social__login--google']}
              aria-label="Google로 회원가입"
            >
              <Image src={Google} alt="Google Logo" width={20} height={20} />
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}
