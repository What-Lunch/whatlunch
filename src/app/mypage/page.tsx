import MyPageHeader from '@/domain/MyPageHeader/MyPageHeader';
import RecentMenuDecisionCard from '@/domain/RecentMenuDecisionCard/RecentMenuDecisionCard';
import FavoriteMenuCard from '@/domain/FavoriteMenuCard/FavoriteMenuCard';

import styles from './page.module.scss';

export default function MyPage() {
  return (
    <div className={styles['mypage']}>
      <header className={styles['mypage__header']}>
        <MyPageHeader />
      </header>

      <main className={styles['mypage__content']}>
        <div className={styles['mypage__top']}>
          <RecentMenuDecisionCard />
          <FavoriteMenuCard />
          <section className={styles['mypage__top__preference']}>3</section>
        </div>

        <div className={styles['mypage__bottom']}>
          <section className={styles['mypage__bottom__profile']}>4</section>
          <section className={styles['mypage__bottom__faq']}>5</section>
        </div>
      </main>
    </div>
  );
}
