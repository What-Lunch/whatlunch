import { redirect } from 'next/navigation';
import { authServiceServer } from '@/app/services/backend/auth.api';
import { favoritesServiceServer } from '@/app/services/backend/favorites.api';

import MyPageHeader from '@/domain/Mypage/MyPageHeader';
import RecentMenuDecisionCard from '@/domain/Mypage/RecentMenuDecisionCard';
import FavoriteMenuCard from '@/domain/Mypage/FavoriteMenuCard';
import MenuSummaryCard from '@/domain/Mypage/MenuSummaryCard';
import AccountSetting from '@/domain/Mypage/AccountSetting';
import styles from './page.module.scss';

/**
 * @description 이 페이지는 서버 컴포넌트입니다. 클라이언트 컴포넌트로 변경하지 마세요.
 */
export default async function Page() {
  try {
    const user = await authServiceServer.getMe();
    const favoriteMenus = await favoritesServiceServer.getMyFavorites();

    return (
      <div className={styles['mypage']}>
        <MyPageHeader user={user} />

        <main className={styles['mypage__content']}>
          <div className={styles['mypage__top']}>
            <RecentMenuDecisionCard />
            <FavoriteMenuCard favoriteMenus={favoriteMenus} />
          </div>

          <div className={styles['mypage__bottom']}>
            <MenuSummaryCard />
            <AccountSetting />
          </div>
        </main>
      </div>
    );
  } catch {
    redirect('/');
  }
}
