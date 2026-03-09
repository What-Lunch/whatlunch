import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { authServiceServer } from '@/services/backend/auth.api';
import { favoritesServiceServer } from '@/services/backend/favorites.api';
import { getMyFoodDotsServer } from '@/services/backend/users.api';

import MyPageHeader from '@/features/Mypage/MyPageHeader';
import FoodDotSelectionCard from '@/features/Mypage/FoodDotSelectionCard/FoodDotSelectionCard';
import FavoriteMenuCard from '@/features/Mypage/FavoriteMenuCard';
import MenuSummaryCard from '@/features/Mypage/MenuSummaryCard';
import AccountSetting from '@/features/Mypage/AccountSetting';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

import styles from './page.module.scss';

export const metadata: Metadata = {
  title: '마이페이지',
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

/**
 * @description 이 페이지는 서버 컴포넌트입니다. 클라이언트 컴포넌트로 변경하지 마세요.
 */
export default async function Page() {
  const queryClient = new QueryClient();

  const user = await authServiceServer.getMe();

  // middleware가 이미 보호하므로 null 처리만
  if (user) {
    queryClient.setQueryData(['me'], user);
  }

  await Promise.allSettled([
    queryClient.prefetchQuery({
      queryKey: ['favorites'],
      queryFn: () => favoritesServiceServer.getMyFavorites(),
    }),
    queryClient.prefetchQuery({
      queryKey: ['foodDots'],
      queryFn: () => getMyFoodDotsServer(),
    }),
    queryClient.prefetchQuery({
      queryKey: ['preference'],
      queryFn: () => favoritesServiceServer.getMyPreference(),
    }),
  ]);

  return (
    <div className={styles['mypage']}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <MyPageHeader />
        <main className={styles['mypage__content']}>
          <div className={styles['mypage__top']}>
            <FoodDotSelectionCard />
            <FavoriteMenuCard />
          </div>

          <div className={styles['mypage__bottom']}>
            <MenuSummaryCard />
            <AccountSetting />
          </div>
        </main>
      </HydrationBoundary>
    </div>
  );
}
