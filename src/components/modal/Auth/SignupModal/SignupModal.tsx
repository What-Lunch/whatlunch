'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import styles from '../AutnModal.module.scss';
import { Eye, EyeOff, XIcon } from 'lucide-react';

import Button from '@/components/common/Button';
import Input from '@/components/common/input/Input';

import Google from '../../../../../public/icons/google.svg';

import { SignupModalProps } from '../types';

/**
 * TODO
 * 1. 백엔드 구현 필요 + 이에 맞는 validation 로직 구현
 * 2. 리다이렉트 구현 필요
 */

export default function SignupModal({ onClose, onLoginOpen }: SignupModalProps) {
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [passwordType, setPasswordType] = useState<'password' | 'text'>('password');
  const [passwordConfirmType, setPasswordConfirmType] = useState<'password' | 'text'>('password');

  const handlePasswordVisibility = () => {
    setPasswordType(prev => (prev === 'password' ? 'text' : 'password'));
  };
  const handlePasswordConfirmVisibility = () => {
    setPasswordConfirmType(prev => (prev === 'password' ? 'text' : 'password'));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 로그인 로직 구현 필요
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <section className={styles['overlay']} tabIndex={0}>
      <div className={styles['modal']}>
        <div className={styles['modal__close']}>
          <XIcon onClick={onClose} />
        </div>
        <h2>회원가입</h2>
        <form onSubmit={onSubmit} className={styles['login']}>
          <div className={styles['login-group']}>
            <span className={styles['login-group__label']}>이메일</span>
            <Input
              value={email}
              type="email"
              placeholder="이메일을 입력하세요"
              tabIndex={1}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div className={styles['login-group']}>
            <span className={styles['login-group__label']}>닉네임</span>
            <Input
              value={nickname}
              type="text"
              placeholder="닉네임을 입력하세요"
              tabIndex={2}
              onChange={e => setNickname(e.target.value)}
            />
          </div>
          <div className={styles['login-group']}>
            <span className={styles['login-group__label']}>비밀번호</span>
            <Input
              value={password}
              type={passwordType}
              placeholder="비밀번호를 입력하세요"
              tabIndex={3}
              onChange={e => setPassword(e.target.value)}
              iconPosition="right"
              icon={
                passwordType === 'password' ? (
                  <EyeOff className={styles['icon']} onClick={handlePasswordVisibility} />
                ) : (
                  <Eye className={styles['icon']} onClick={handlePasswordVisibility} />
                )
              }
            />
          </div>
          <div className={styles['login-group']}>
            <span className={styles['login-group__label']}>비밀번호 확인</span>
            <Input
              value={passwordConfirm}
              type={passwordConfirmType}
              placeholder="비밀번호를 입력하세요"
              tabIndex={4}
              onChange={e => setPasswordConfirm(e.target.value)}
              iconPosition="right"
              icon={
                passwordConfirmType === 'password' ? (
                  <EyeOff className={styles['icon']} onClick={handlePasswordConfirmVisibility} />
                ) : (
                  <Eye className={styles['icon']} onClick={handlePasswordConfirmVisibility} />
                )
              }
            />
          </div>
          <div></div>
          <div className={styles['login__buttons']}>
            <Button tabIndex={3}>로그인</Button>

            <div>
              <span className={styles['login__buttons__boolean']}>회원이 이신가요? </span>
              <span className={styles['login__buttons__signup']} onClick={onLoginOpen}>
                로그인하기
              </span>
            </div>
          </div>
        </form>
        <div className={styles['social']}>
          <span className={styles['social__or']}>OR</span>
          <div className={styles['social__login']}>
            <span>간편 회원가입하기</span>
            <div className={styles['social__login--google']}>
              <Image src={Google} alt="Google Logo" width={20} height={20} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
