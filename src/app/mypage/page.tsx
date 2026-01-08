import MyPageHeader from '@/domain/Mypage/MyPageHeader';
import RecentMenuDecisionCard from '@/domain/Mypage/RecentMenuDecisionCard';
import FavoriteMenuCard from '@/domain/Mypage/FavoriteMenuCard';
import MenuSummaryCard from '@/domain/Mypage/MenuSummaryCard';
import AccountSetting from '@/domain/Mypage/AccountSetting';
import MypageFnq from '@/domain/Mypage/MypageFaq';
import styles from './page.module.scss';

export default function MyPage() {
  return (
    <div className={styles['mypage']}>
      <MyPageHeader />

      <main className={styles['mypage__content']}>
        <div className={styles['mypage__top']}>
          <RecentMenuDecisionCard />
          <FavoriteMenuCard />
          <MenuSummaryCard />
        </div>

        <div className={styles['mypage__bottom']}>
          <AccountSetting />
          <MypageFnq />
        </div>
      </main>
    </div>
  );
}
