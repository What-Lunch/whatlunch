'use client';
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import MyPageHeader from '@/domain/Mypage/MyPageHeader';
import RecentMenuDecisionCard from '@/domain/Mypage/RecentMenuDecisionCard';
import FavoriteMenuCard from '@/domain/Mypage/FavoriteMenuCard';
import MenuSummaryCard from '@/domain/Mypage/MenuSummaryCard';
import AccountSetting from '@/domain/Mypage/AccountSetting';
import styles from './page.module.scss';

import { authService } from '@/app/services/backend/auth.api';

// TODO: 토스트 로그인 요청 처리
export default function MyPage() {
  const router = useRouter();
  const {
    data: me,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['me'],
    queryFn: authService.getMe,
    retry: false,
  });

  useEffect(() => {
    if (isError) {
      router.replace('/');
    }
  }, [isError, router]);

  if (isLoading || isError || !me) return null;

  return (
    <div className={styles['mypage']}>
      <MyPageHeader />

      <main className={styles['mypage__content']}>
        <div className={styles['mypage__top']}>
          <RecentMenuDecisionCard />
          <FavoriteMenuCard />
        </div>

        <div className={styles['mypage__bottom']}>
          <MenuSummaryCard />
          <AccountSetting />
        </div>
      </main>
    </div>
  );
}
