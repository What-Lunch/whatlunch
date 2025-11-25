import styles from './Header.module.scss';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import Button from '@/components/common/Button';
import WhatLunchLogo from '../../../../public/icons/what-lunch-logo.svg';
/**
 * 로그인 및 회원가입 모달로 관리d
 * 헤더를 학교 홈페이지처럼 하고 싶다고 했는데 아직 메뉴가 없어 하기가 어렵네요
 * 버튼 컴포넌트가 머지되면 로그인, 회원가입도 버튼 컴포넌트로 바꿀게요
 */
export function Header() {
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
        <Button variant="primary">로그인</Button>
        <Button variant="primary">회원가입</Button>
      </div>
    </header>
  );
}

export default React.memo(Header);
