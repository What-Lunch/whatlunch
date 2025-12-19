'use client';

import styles from './Header.module.scss';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import Button from '@/shared/components/Button';
import WhatLunchLogo from '../../../../../public/icons/what-lunch-logo.svg';
import LoginModal from '@/domain/Auth/LoginModal';
import SignupModal from '@/domain/Auth/SignupModal';
import { useState } from 'react';

export function Header() {
  const [modalType, setModalType] = useState<'login' | 'signup' | null>(null);
  return (
    <header className={styles['header']}>
      <div className={styles['header__menu']}>
        <Link href="/">
          <span>룰렛 돌리기</span>
        </Link>

        <Link href="/faq">
          <span>고객센터</span>
        </Link>
      </div>

      <div>
        <Link href="/" className={styles['header__logo']}>
          <Image src={WhatLunchLogo} alt="What Lunch Logo" width={60} height={60} />
          <span>What Lunch</span>
        </Link>
      </div>

      <div className={styles['header__auth']}>
        <Button variant="primary" onClick={() => setModalType('login')}>
          로그인
        </Button>
        <Button variant="primary" onClick={() => setModalType('signup')}>
          회원가입
        </Button>
      </div>

      {modalType === 'login' && (
        <LoginModal
          onClose={() => setModalType(null)}
          onSignupOpen={() => setModalType('signup')}
        />
      )}
      {modalType === 'signup' && (
        <SignupModal onClose={() => setModalType(null)} onLoginOpen={() => setModalType('login')} />
      )}
    </header>
  );
}

export default React.memo(Header);
