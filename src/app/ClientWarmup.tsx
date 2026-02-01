'use client';

import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/domain/Auth/store/auth.store';
import { authService } from '@/app/services/backend/auth.api';

export default function ClientWarmup() {
  const { setUser, clearUser, finishAuthCheck } = useAuthStore();
  const mounted = useRef(false);

  useEffect(() => {
    if (mounted.current) return;
    mounted.current = true;

    const initializeAuth = async () => {
      try {
        const userData = await authService.getMe();
        setUser(userData);
      } catch (error) {
        console.error('사용자 정보 가져오기 실패:', error);
        clearUser();
      } finally {
        finishAuthCheck();
      }
    };

    initializeAuth();
  }, [setUser, clearUser, finishAuthCheck]);

  return null;
}
