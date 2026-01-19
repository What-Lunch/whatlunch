'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/router';

import Button from '@/shared/components/Button';
import BaseInput from '@/shared/components/Input/BaseInput';
import PasswordInput from '@/shared/components/Input/PasswordInput';
import Modal from '@/shared/components/Modal';

import { authService } from '@/app/services/backend/auth.api';
import { useAuthStore } from '@/domain/Auth/store/auth.store';
import { SignupModalProps } from '../types';

import Google from '../../../../public/icons/google.png';

import styles from '../AuthModal.module.scss';

export default function SignupModal({ onClose, onLoginOpen }: SignupModalProps) {
  const emailRef = useRef<HTMLInputElement>(null);
  const nicknameRef = useRef<HTMLInputElement>(null);

  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  // 전역 auth 상태 초기화용
  const clearUser = useAuthStore(state => state.clearUser);

  const signupMutation = useMutation({
    mutationFn: (data: Auth.RegisterReq) => authService.postSignup(data),
    onSuccess: () => {
      // 이전 로그인 상태 제거
      clearUser();
      alert('회원가입이 완료되었습니다');
      onLoginOpen();
      router.push('/');
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('회원가입에 실패했습니다');
      }
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailRef.current?.value || !nicknameRef.current?.value || !password || !passwordConfirm) {
      alert('모든 항목을 입력해주세요');
      return;
    }
    if (password !== passwordConfirm) {
      alert('비밀번호가 일치하지 않습니다');
      return;
    }
    try {
      setLoading(true);
      await signupMutation.mutateAsync({
        email: emailRef.current.value,
        password: password,
        passwordConfirm: passwordConfirm,
        nickname: nicknameRef.current.value,
      });
    } catch (err) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert('회원가입에 실패했습니다');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} innerClassName={styles['modal']} title="회원가입">
      <form className={styles['auth']} onSubmit={onSubmit}>
        <div className={styles['auth__body']}>
          <div className={styles['auth__body-group']}>
            <span className={styles['auth__body-group__label']}>닉네임</span>
            <BaseInput
              ref={nicknameRef}
              type="text"
              placeholder="닉네임을 입력하세요"
              disabled={loading}
            />
          </div>

          <div className={styles['auth__body-group']}>
            <span className={styles['auth__body-group__label']}>이메일</span>
            <BaseInput
              ref={emailRef}
              type="email"
              placeholder="이메일을 입력하세요"
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

          <div className={styles['auth__body-group']}>
            <span className={styles['auth__body-group__label']}>비밀번호 확인</span>
            <PasswordInput
              value={passwordConfirm}
              placeholder="비밀번호를 다시 입력하세요"
              onChange={e => setPasswordConfirm(e.target.value)}
              disabled={loading}
            />
          </div>
        </div>

        <div className={styles['auth__social']}>
          <span className={styles['auth__social__or']}>OR</span>
          <div className={styles['auth__social__oauth']}>
            <span>간편 회원가입하기</span>
            <button type="button" className={styles['auth__social__oauth__button']}>
              <Image src={Google} alt="Google 로그인" width={24} height={24} />
            </button>
          </div>
        </div>

        <div className={styles['auth__actions']}>
          <div>
            <span className={styles['auth__actions__boolean']}>이미 회원이신가요? </span>
            <button
              type="button"
              className={styles['auth__actions__signup']}
              onClick={onLoginOpen}
              disabled={loading}
            >
              로그인하기
            </button>
          </div>

          <div className={styles['auth__actions__buttons']}>
            <Button
              type="button"
              variant="blue"
              mode="outline"
              className={styles['auth__actions__buttons__button']}
              onClick={onClose}
              disabled={loading}
            >
              취소
            </Button>

            <Button
              type="submit"
              variant="blue"
              className={styles['auth__actions__buttons__button']}
              disabled={loading}
            >
              {loading ? '처리 중...' : '회원가입'}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
