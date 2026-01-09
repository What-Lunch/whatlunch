'use client';

import { useState } from 'react';
import Image from 'next/image';

import { useAuthStore } from '../store/auth.store';

import Button from '@/shared/components/Button';
import BaseInput from '@/shared/components/Input/BaseInput';
import PasswordInput from '@/shared/components/Input/PasswordInput';
import Modal from '@/shared/components/Modal';

import { login, getMe } from '@/app/api/auth/auth.api';

import { LoginModalProps } from '../types';

import Google from '../../../../public/icons/google.png';

import styles from '../AuthModal.module.scss';

/**
 * TODO
 * 1. 백엔드 구현 필요 + 이에 맞는 validation 로직 구현
 * 2. 리다이렉트 구현 필요
 * 3. onSubmit 함수 구현 필요
 * 4. useState 대신 ref 사용 고려 -> input 컴포넌트들 수정 필요 (현재 input입력시 전체 렌더링 되는 이슈 존재)
 */

export default function LoginModal({ onClose, onSignupOpen }: LoginModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const setUser = useAuthStore(state => state.setUser);
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      alert('이메일과 비밀번호를 입력해주세요');
      return;
    }

    try {
      setLoading(true);

      // 로그인 (토큰 저장)
      await login({ email, password });

      // 유저 정보 조회
      const me = await getMe();

      // 전역 auth 상태 세팅
      setUser({
        email: me.email,
        nickname: me.nickname,
      });

      onClose();
    } catch (err) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert('로그인에 실패했습니다');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} innerClassName={styles['modal']} title="로그인">
      <form className={styles['auth']} onSubmit={onSubmit}>
        <div className={styles['auth__body']}>
          <div className={styles['auth__body-group']}>
            <span className={styles['auth__body-group__label']}>이메일</span>
            <BaseInput
              value={email}
              type="email"
              placeholder="이메일을 입력하세요"
              onChange={e => setEmail(e.target.value)}
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
