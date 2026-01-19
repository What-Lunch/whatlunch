'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { useMutation } from '@tanstack/react-query';

import { useAuthStore } from '../store/auth.store';

import Button from '@/shared/components/Button';
import BaseInput from '@/shared/components/Input/BaseInput';
import PasswordInput from '@/shared/components/Input/PasswordInput';
import Modal from '@/shared/components/Modal';

import { authService } from '@/app/services/backend/auth.api';

import { LoginModalProps } from '../types';

import Google from '../../../../public/icons/google.png';

import styles from '../AuthModal.module.scss';

function getLoginErrorMessage(error: unknown): string {
  if (!(error instanceof Error)) {
    return '로그인에 실패했습니다. 잠시 후 다시 시도해주세요.';
  }

  const message = error.message.toLowerCase();

  if (message.includes('unauthorized') || message.includes('401')) {
    return '이메일 또는 비밀번호가 올바르지 않습니다.';
  }

  if (message.includes('network') || message.includes('fetch')) {
    return '네트워크 연결을 확인해주세요.';
  }

  return '로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
}

export default function LoginModal({ onClose, onSignupOpen }: LoginModalProps) {
  const emailRef = useRef<HTMLInputElement>(null);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const setUser = useAuthStore(state => state.setUser);

  const loginMutation = useMutation({
    mutationFn: (data: Auth.LoginReq) => authService.postLogin(data),
    onSuccess: async () => {
      const me = await authService.getMe();
      setUser({
        email: me.email,
        nickname: me.nickname,
        profileImage: me.profileImage,
      });
      onClose();
    },
    onError: (error: unknown) => {
      alert(getLoginErrorMessage(error));
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailRef.current?.value || !password) {
      alert('이메일과 비밀번호를 입력해주세요');
      return;
    }
    setLoading(true);
    loginMutation.mutate({ email: emailRef.current.value, password });
  };

  return (
    <Modal isOpen={true} onClose={onClose} innerClassName={styles['modal']} title="로그인">
      <form className={styles['auth']} onSubmit={onSubmit}>
        <div className={styles['auth__body']}>
          <div className={styles['auth__body-group']}>
            <span className={styles['auth__body-group__label']}>이메일</span>
            <BaseInput
              type="email"
              placeholder="이메일을 입력하세요"
              ref={emailRef}
              disabled={loading}
            />
          </div>

          <div className={styles['auth__body-group']}>
            <span className={styles['auth__body-group__label']}>비밀번호</span>
            <PasswordInput
              value={password}
              placeholder="비밀번호를 입력하세요"
              onChange={e => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className={styles['auth__social']}>
            <span className={styles['auth__social__or']}>OR</span>
            <div className={styles['auth__social__oauth']}>
              <span>간편 로그인하기</span>
              <button
                type="button"
                role="button"
                className={styles['auth__social__oauth--google']}
                aria-label="Google로 로그인"
                disabled={loading}
              >
                <Image src={Google} alt="Google Logo" width={20} height={20} />
              </button>
            </div>
          </div>

          <div className={styles['auth__actions']}>
            <div>
              <span className={styles['auth__actions__boolean']}>회원이 아니신가요? </span>
              <button
                type="button"
                className={styles['auth__actions__signup']}
                onClick={onSignupOpen}
                disabled={loading}
              >
                회원가입하기
              </button>
            </div>
          </div>

          <Button
            type="submit"
            variant="blue"
            className={styles['auth__actions__buttons__button']}
            disabled={loading}
          >
            {loading ? '로그인 중...' : '로그인'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
