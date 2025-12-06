import Image from 'next/image';
import Link from 'next/link';
import styles from './Header.module.scss';
import HeaderProps from './types';

import Button from '@/shared/components/Button';

import WhatLunchLogo from '../../../../../../public/icons/what-lunch-logo.svg';

export function Header({ onLogin, onSignup }: HeaderProps) {
  return (
    <div className={styles['header']}>
      <nav className={styles['header__menu']}>
        <Link href="/">
          <span>룰렛 돌리기</span>
        </Link>

        <Link href="/faq">
          <span>고객센터</span>
        </Link>
      </nav>

      <nav>
        <Link href="/" className={styles['header__logo']}>
          <Image src={WhatLunchLogo} alt="What Lunch Logo" width={60} height={60} />
          <span>What Lunch</span>
        </Link>
      </nav>

      <div className={styles['header__auth']}>
        <Button variant="primary" onClick={onLogin}>
          로그인
        </Button>
        <Button variant="primary" onClick={onSignup}>
          회원가입
        </Button>
      </div>
    </div>
  );
}

export default Header;
