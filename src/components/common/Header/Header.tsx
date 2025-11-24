import styles from './Header.module.scss';
import Image from 'next/image';
import Link from 'next/link';

import WhatLunchLogo from '../../../../public/icons/what-lunch-logo.svg';
/**
 * 로그인 및 회원가입 모달로 관리
 * 헤더를 학교 홈페이지처럼 하고 싶다고 했는데 아직 메뉴가 없어 하기가 어렵네요
 */
export default function Header() {
  return (
    <header className={styles['header']}>
      <section className={styles['header__menu']}>
        <Link href="/">
          <span>룰렛 돌리기</span>
        </Link>

        <Link href="/faq">
          <span>고객센터</span>
        </Link>
      </section>

      <section>
        <Link href="/" className={styles['header__logo']}>
          <Image src={WhatLunchLogo} alt="What Lunch Logo" width={60} height={60} />
          <span>What Lunch</span>
        </Link>
      </section>

      {/* 버튼 컴포넌트가 아직 머지되지 않아 일단 이렇게 둘게요 */}
      <section className={styles['header__auth']}>
        <span>로그인</span>
        <span>회원가입</span>
      </section>
    </header>
  );
}
