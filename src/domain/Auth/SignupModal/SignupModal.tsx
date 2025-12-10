'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Eye, EyeOff, XIcon } from 'lucide-react';

import Button from '@/shared/components/Button';
import FormInput from '@/shared/components/Input/FormInput';
import { handleModalClose, useEscClose } from '@/shared/hooks/modalClose';
import { SignupModalProps } from '../types';

import Google from '../../../../public/icons/google.svg';

import styles from '../AuthModal.module.scss';
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
  const [passwordType, setPasswordType] = useState<'password' | 'text'>('password');
  const [passwordConfirmType, setPasswordConfirmType] = useState<'password' | 'text'>('password');

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const { handleOverlayClick } = handleModalClose(onClose);
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
        <form onSubmit={onSubmit} className={styles['login']}>
          <div className={styles['login-group']}>
            <span className={styles['login-group__label']}>이메일</span>
            <FormInput
              value={email}
              type="email"
              placeholder="이메일을 입력하세요"
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div className={styles['login-group']}>
            <span className={styles['login-group__label']}>닉네임</span>
            <FormInput
              value={nickname}
              type="text"
              placeholder="닉네임을 입력하세요"
              onChange={e => setNickname(e.target.value)}
            />
          </div>
          <div className={styles['login-group']}>
            <span className={styles['login-group__label']}>비밀번호</span>
            <FormInput
              value={password}
              type={passwordType}
              placeholder="비밀번호를 입력하세요"
              onChange={e => setPassword(e.target.value)}
              iconPosition="right"
              icon={
                passwordType === 'password' ? (
                  <EyeOff className={styles['icon']} onClick={() => setPasswordType('text')} />
                ) : (
                  <Eye className={styles['icon']} onClick={() => setPasswordType('password')} />
                )
              }
            />
          </div>
          <div className={styles['login-group']}>
            <span className={styles['login-group__label']}>비밀번호 확인</span>
            <FormInput
              value={passwordConfirm}
              type={passwordConfirmType}
              placeholder="비밀번호를 입력하세요"
              onChange={e => setPasswordConfirm(e.target.value)}
              iconPosition="right"
              icon={
                passwordConfirmType === 'password' ? (
                  <EyeOff
                    className={styles['icon']}
                    onClick={() => setPasswordConfirmType('text')}
                  />
                ) : (
                  <Eye
                    className={styles['icon']}
                    onClick={() => setPasswordConfirmType('password')}
                  />
                )
              }
            />
          </div>

          <div className={styles['login__buttons']}>
            <Button type="submit" className={styles['login__buttons__button']}>
              회원가입
            </Button>
            <div>
              <span className={styles['login__buttons__boolean']}>회원이이신가요? </span>
              <button className={styles['login__buttons__signup']} onClick={onLoginOpen}>
                로그인하기
              </button>
            </div>
          </div>
        </form>
        <div className={styles['social']}>
          <span className={styles['social__or']}>OR</span>
          <div className={styles['social__login']}>
            <span>간편 회원가입하기</span>
            <button role="button" className={styles['social__login--google']}>
              <Image src={Google} alt="Google Logo" width={20} height={20} />
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}
