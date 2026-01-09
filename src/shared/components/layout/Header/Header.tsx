'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { useAuthStore } from '@/domain/Auth/store/auth.store';
import { getMe } from '@/app/api/auth/auth.api';

import { Menu, X } from 'lucide-react';

import Button from '@/shared/components/Button';
import LoginModal from '@/domain/Auth/LoginModal';
import SignupModal from '@/domain/Auth/SignupModal';

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
  const { user, isAuthLoading, setUser, clearUser, finishAuthCheck } = useAuthStore();

  useEffect(() => {
    let isMounted = true;

    const token = localStorage.getItem('accessToken');

    if (!token) {
      finishAuthCheck();
      return;
    }

    getMe()
      .then(user => {
        if (!isMounted) return;

        setUser({
          email: user.email,
          nickname: user.nickname,
        });
      })
      .catch(() => {
        if (!isMounted) return;

        localStorage.removeItem('accessToken');
        localStorage.removeItem('expiresAt');
        clearUser();
      })
      .finally(() => {
        if (isMounted) {
          finishAuthCheck();
        }
      });

    return () => {
      isMounted = false;
    };
  }, [setUser, clearUser, finishAuthCheck]);

  return (
    <header className={styles['header']}>
      <div className={styles['header__menu']}>
        <Link href="/">
          <span>홈</span>
        </Link>
        <Link href="/mypage">
          <span>마이페이지</span>
        </Link>
        <Link href="/faq">
          <span>고객센터</span>
        </Link>
      </div>

      <Link href="/" className={styles['header__logo']}>
        <Image src={WhatLunchLogo} alt="What Lunch Logo" width={60} height={60} />
        <span>What Lunch</span>
      </Link>

      <div className={styles['header__auth']}>
        {isAuthLoading ? null : user ? (
          <>
            <div className={styles['header__user']}>
              <div className={styles['header__user-avatar']}>{getInitial(user.nickname)}</div>
              <span className={styles['header__user-nickname']}>{user.nickname || '사용자'}님</span>
            </div>

            <Button
              variant="primary"
              onClick={() => {
                const ok = confirm('로그아웃하시겠어요?');
                if (!ok) return;

                localStorage.removeItem('accessToken');
                localStorage.removeItem('expiresAt');
                clearUser();
              }}
            >
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
              {!isAuthLoading && user && (
                <li>
                  <button
                    onClick={() => {
                      const ok = confirm('로그아웃하시겠어요?');
                      if (!ok) return;

                      localStorage.removeItem('accessToken');
                      localStorage.removeItem('expiresAt');
                      clearUser();
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    로그아웃
                  </button>
                </li>
              )}

              {/* 비로그인 상태 */}
              {!isAuthLoading && !user && (
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
