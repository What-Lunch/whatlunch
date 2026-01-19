'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Menu, X } from 'lucide-react';

import Button from '@/shared/components/Button';
import LoginModal from '@/domain/Auth/LoginModal';
import SignupModal from '@/domain/Auth/SignupModal';

import { useAuthStore } from '@/domain/Auth/store/auth.store';
import { authService } from '@/app/services/backend/auth.api';

import WhatLunchLogo from '../../../../../public/icons/what-lunch-logo.svg';

import styles from './Header.module.scss';

// 닉네임에서 첫 글자 추출
const getInitial = (nickname?: string) => {
  if (!nickname) return '?';

  const trimmed = nickname.trim();
  if (!trimmed) return '?';

  return Array.from(trimmed)[0];
};

export function Header() {
  const [modalType, setModalType] = useState<'login' | 'signup' | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, clearUser } = useAuthStore();

  // TODO: 에러 TOAST 처리
  const {
    data: me,
    isLoading: isAuthLoading,
    // isError,
    // error,
  } = useQuery({
    queryKey: ['me'],
    queryFn: () => authService.getMe(),
    enabled: !user,
    staleTime: Infinity,
  });

  // 공통 로그아웃 핸들러
  const handleLogout = (afterLogout?: () => void) => {
    const ok = confirm('로그아웃하시겠어요?');
    if (!ok) return;

    authService.postLogout();
    clearUser(); // 전역 auth 상태 초기화

    afterLogout?.();
  };

  return (
    <header className={styles['header']}>
      <div className={styles['header__menu']}>
        <Link href="/">
          <span>홈</span>
        </Link>
        {isAuthLoading
          ? null
          : me && (
              <Link href="/mypage">
                <span>마이페이지</span>
              </Link>
            )}

        <Link href="/faq">
          <span>고객센터</span>
        </Link>
      </div>

      <Link href="/" className={styles['header__logo']}>
        <Image src={WhatLunchLogo} alt="What Lunch Logo" width={60} height={60} />
        <span>What Lunch</span>
      </Link>

      <div className={styles['header__auth']}>
        {isAuthLoading ? null : me ? (
          <>
            <div className={styles['header__user']}>
              <div className={styles['header__user-avatar']}>{getInitial(me.nickname)}</div>
              <span className={styles['header__user-nickname']}>{me.nickname || '사용자'}님</span>
            </div>

            <Button variant="primary" onClick={() => handleLogout()}>
              로그아웃
            </Button>
          </>
        ) : (
          <>
            <Button variant="primary" onClick={() => setModalType('login')}>
              로그인
            </Button>
            <Button variant="primary" onClick={() => setModalType('signup')}>
              회원가입
            </Button>
          </>
        )}
      </div>

      {/* 햄버거 버튼 */}
      {!isMobileMenuOpen && (
        <button
          className={styles['header__hamburger']}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="메뉴 열기"
        >
          <Menu size={26} />
        </button>
      )}

      {/* 모바일 메뉴 */}
      {isMobileMenuOpen && (
        <>
          <div
            className={styles['header__mobile-overlay']}
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          <div className={styles['header__mobile-menu']}>
            <div className={styles['header__mobile-menu-header']}>
              <span className={styles['header__mobile-menu-title']}>메뉴</span>
              <button
                className={styles['header__mobile-menu-close']}
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="메뉴 닫기"
              >
                <X size={28} />
              </button>
            </div>

            <ul className={styles['header__mobile-menu-list']}>
              <li>
                <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
                  홈
                </Link>
              </li>
              <li>
                <Link href="/mypage" onClick={() => setIsMobileMenuOpen(false)}>
                  마이페이지
                </Link>
              </li>
              <li>
                <Link href="/faq" onClick={() => setIsMobileMenuOpen(false)}>
                  고객센터
                </Link>
              </li>

              {/* 로그인 상태 */}
              {!isAuthLoading && me && (
                <li>
                  <button
                    onClick={() =>
                      handleLogout(() => {
                        setIsMobileMenuOpen(false);
                      })
                    }
                  >
                    로그아웃
                  </button>
                </li>
              )}

              {/* 비로그인 상태 */}
              {!isAuthLoading && !me && (
                <>
                  <li>
                    <button
                      onClick={() => {
                        setModalType('login');
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      로그인
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        setModalType('signup');
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      회원가입
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>
        </>
      )}

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
