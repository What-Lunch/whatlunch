'use client';

import Image from 'next/image';
import { useState } from 'react';
import styles from '../AuthModal.module.scss';

import Button from '@/shared/components/Button';
import BaseInput from '@/shared/components/Input/BaseInput';
import PasswordInput from '@/shared/components/Input/PasswordInput';
import Modal from '@/shared/components/Modal';

import Google from '../../../../public/icons/google.png';

import { SignupModalProps } from '../types';

/**
 * TODO
 * 1. 백엔드 구현 필요 + 이에 맞는 validation 로직 구현
 * 2. 리다이렉트 구현 필요
 * 3. onSubmit 함수 구현 필요
 * 4. useState 대신 ref 사용 고려 -> input 컴포넌트들 수정 필요 (현재 input입력시 전체 렌더링 되는 이슈 존재)
 */

export default function SignupModal({ onClose, onLoginOpen }: SignupModalProps) {
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <Modal isOpen={true} onClose={onClose} innerClassName={styles['modal']} title="회원가입">
      <form className={styles['auth']} onSubmit={onSubmit}>
        <div className={styles['auth__body']}>
          <div className={styles['auth__body-group']}>
            <span className={styles['auth__body-group__label']}>닉네임</span>
            <BaseInput
              value={nickname}
              type="text"
              placeholder="닉네임을 입력하세요"
              onChange={e => setNickname(e.target.value)}
            />
          </div>
          <div className={styles['auth__body-group']}>
            <span className={styles['auth__body-group__label']}>이메일</span>
            <BaseInput
              value={email}
              type="email"
              placeholder="이메일을 입력하세요"
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div className={styles['auth__body-group']}>
            <span className={styles['auth__body-group__label']}>비밀번호</span>
            <PasswordInput
              value={password}
              placeholder="비밀번호를 입력하세요"
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <div className={styles['auth__body-group']}>
            <span className={styles['auth__body-group__label']}>비밀번호 확인</span>
            <PasswordInput
              value={passwordConfirm}
              placeholder="비밀번호를 다시 입력하세요"
              onChange={e => setPasswordConfirm(e.target.value)}
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
            <button type="button" className={styles['auth__actions__signup']} onClick={onLoginOpen}>
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
            >
              취소
            </Button>
            <Button
              type="submit"
              variant="blue"
              className={styles['auth__actions__buttons__button']}
            >
              회원가입
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
