'use client';

import React, { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { toast } from 'react-toastify';

import Button from '@/shared/components/Button';
import LoginModal from '@/domain/Auth/LoginModal';
import SignupModal from '@/domain/Auth/SignupModal';
import { ProfileImage } from '@/shared/components/ProfileImage';

import { useAuthStore } from '@/domain/Auth/store/auth.store';
import { authService } from '@/app/services/backend/auth.api';

import WhatLunchLogo from '../../../../../public/icons/what-lunch-logo.svg';

import styles from './Header.module.scss';

export function Header() {
  const router = useRouter();
  const [modalType, setModalType] = useState<'login' | 'signup' | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { user, clearUser, isAuthLoading } = useAuthStore();

  const handleLogout = useCallback(async () => {
    try {
      await authService.postLogout();
      clearUser();
      toast.success('로그아웃 되었습니다.');
      router.replace('/');
    } catch (error) {
      console.error('로그아웃 실패:', error);
      toast.error('로그아웃에 실패했습니다.');
    }
  }, [clearUser, router]);

  return (
    <header className={styles['header']}>
      <div className={styles['header__menu']}>
        <Link href="/">
          <span>홈</span>
        </Link>

        {user && (
          <Link href="/mypage">
            <span>마이페이지</span>
          </Link>
        )}
      </div>

      <Link href="/" className={styles['header__logo']}>
        <Image src={WhatLunchLogo} alt="What Lunch Logo" width={60} height={60} priority />
        <span>What Lunch</span>
      </Link>

      <div className={styles['header__auth']}>
        <div style={{ width: '80px', height: '40px' }} />
        {user ? (
          <>
            <div className={styles['header__user']}>
              <div className={styles['header__user-avatar']}>
                <ProfileImage src={user.profileImage ?? '/icons/default_profile.png'} priority />
              </div>
              <span className={styles['header__user-nickname']}>{user.nickname || '사용자'}님</span>
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

      {!isMobileMenuOpen && (
        <button
          type="button"
          className={styles['header__hamburger']}
          onClick={() => setIsMobileMenuOpen(true)}
          aria-label="메뉴 열기"
        >
          <Menu size={26} />
        </button>
      )}

      {isMobileMenuOpen && (
        <>
          <div
            className={styles['header__mobile-overlay']}
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className={styles['header__mobile-menu']}>
            <div className={styles['header__mobile-menu-header']}>
              <span className={styles['header__mobile-menu-title']}>메뉴</span>
              <button
                type="button"
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
              {user && (
                <li>
                  <Link href="/mypage" onClick={() => setIsMobileMenuOpen(false)}>
                    마이페이지
                  </Link>
                </li>
              )}

              {isAuthLoading ? (
                <li>잠시만 기다려주세요...</li>
              ) : user ? (
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    로그아웃
                  </button>
                </li>
              ) : (
                <>
                  <li>
                    <button
                      type="button"
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
                      type="button"
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
