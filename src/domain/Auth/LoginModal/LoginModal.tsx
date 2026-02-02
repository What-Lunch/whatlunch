'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image'; // [추가] 이미지 사용을 위해 추가

import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { GoogleLogin } from '@react-oauth/google';

import Button from '@/shared/components/Button';
import BaseInput from '@/shared/components/Input/BaseInput';
import PasswordInput from '@/shared/components/Input/PasswordInput';
import Modal from '@/shared/components/Modal';

import { authServiceClient } from '@/app/services/backend/auth.api';
import { LoginModalProps } from '../types';
import { useAuthStore } from '../store/auth.store';
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

  const router = useRouter();
  // [추가] 구글 로그인 버튼 제어를 위한 Ref

  const googleLoginButtonRef = useRef<HTMLDivElement>(null);

  const { setUser } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: (data: Auth.LoginReq) => authServiceClient.postLogin(data),
    onSuccess: res => {
      setUser(res.user);

      toast.success('로그인에 성공했습니다.');
      router.refresh();
      onClose();
    },
    onError: (error: unknown) => {
      toast.error(getLoginErrorMessage(error));
    },
  });

  const googleLoginMutation = useMutation({
    mutationFn: (data: { idToken: string }) => authServiceClient.loginWithGoogle(data),
    onSuccess: res => {
      setUser(res.user);
      onClose();
    },
    onError: () => {
      toast.error('구글 로그인에 실패했습니다.');
    },
  });

  const isLoading = loginMutation.isPending;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!emailRef.current?.value || !password) {
      toast.warn('이메일과 비밀번호를 입력해주세요.');
      return;
    }

    loginMutation.mutate({
      email: emailRef.current.value,
      password,
    });
  };

  return (
    <Modal isOpen={true} onClose={onClose} innerClassName={styles['modal']}>
      <form className={styles['auth']} onSubmit={onSubmit}>
        <h2 className={styles['auth__title']}>로그인</h2>
        <div className={styles['auth__body']}>
          <div className={styles['auth__body-group']}>
            <span className={styles['auth__body-group__label']}>이메일</span>
            <BaseInput type="email" placeholder="이메일을 입력하세요" ref={emailRef} />
          </div>

          <div className={styles['auth__body-group']}>
            <span className={styles['auth__body-group__label']}>비밀번호</span>
            <PasswordInput
              value={password}
              placeholder="비밀번호를 입력하세요"
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <div className={styles['auth__social']}>
            <span className={styles['auth__social__or']}>OR</span>
            <div className={styles['auth__social__oauth']}>
              <button
                type="button"
                className={styles['auth__social__oauth--google']}
                onClick={() => {
                  setTimeout(() => {
                    const btn = googleLoginButtonRef.current?.querySelector('div[role="button"]');
                    if (btn && typeof (btn as HTMLElement).click === 'function') {
                      (btn as HTMLElement).click();
                    } else {
                      toast.error('구글 버튼을 찾을 수 없습니다. 새로고침 후 다시 시도해주세요.');
                    }
                  }, 0);
                }}
              >
                <Image src={Google} alt="Google Logo" width={20} height={20} />
                <span>Google 계정으로 시작하기</span>
              </button>

              <div ref={googleLoginButtonRef} style={{ display: 'none' }}>
                <GoogleLogin
                  onSuccess={credentialResponse => {
                    if (credentialResponse.credential) {
                      googleLoginMutation.mutate({ idToken: credentialResponse.credential });
                    } else {
                      toast.error('구글 로그인에 실패했습니다.');
                    }
                  }}
                  onError={() => {
                    toast.error('구글 로그인에 실패했습니다.');
                  }}
                  width="200"
                  useOneTap={false}
                  auto_select={false}
                />
              </div>
            </div>
          </div>

          <div className={styles['auth__actions']}>
            <div className={styles['auth__actions__text-group']}>
              <span className={styles['auth__actions__boolean']}>회원이 아니신가요? </span>
              <button
                type="button"
                className={styles['auth__actions__link']}
                onClick={onSignupOpen}
              >
                회원가입하기
              </button>
            </div>
          </div>

          <div className={styles['auth__actions__buttons']}>
            <Button
              type="submit"
              variant="orange"
              className={styles['auth__actions__buttons__button']}
              disabled={isLoading}
            >
              {isLoading ? '로그인 중...' : '로그인'}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
