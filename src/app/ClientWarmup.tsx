'use client';

import { useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { useAuthStore } from '@/domain/Auth/store/auth.store';
import { authService } from '@/app/services/backend/auth.api';

export default function ClientWarmup() {
  const { setUser, clearUser, finishAuthCheck } = useAuthStore();
  const mounted = useRef(false);

  useEffect(() => {
    if (mounted.current) return;
    mounted.current = true;

    const initializeAuth = async () => {
      // SSR 환경 보호
      if (typeof window === 'undefined') return;

      try {
        const token = localStorage.getItem('accessToken');

        if (!token) {
          finishAuthCheck(); // 토큰 없으면 비로그인 상태로 확정
          return;
        }

        const userData = await authService.getMe();

        if (userData) {
          setUser(userData);
        } else {
          throw new Error('User data is empty');
        }
      } catch (error) {
        console.error('[ClientWarmUp] 세션 만료 또는 오류:', error);
        toast.info('세션이 만료되었습니다. 다시 로그인해주세요.');
        authService.postLogout(); // 로컬스토리지 청소
        clearUser(); // 스토어 초기화
      } finally {
        finishAuthCheck();
      }
    };

    // 기존 백엔드 Health Check
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    if (baseUrl) {
      fetch(`${baseUrl}/health`, { method: 'GET', cache: 'no-store' }).catch(() => {});
    }

    initializeAuth();
  }, [setUser, clearUser, finishAuthCheck]);

  return null;
}
