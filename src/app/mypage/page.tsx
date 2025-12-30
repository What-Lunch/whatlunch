import MyPageHeader from '@/domain/MyPageHeader/MyPageHeader';
import RecentMenuDecisionCard from '@/domain/MyPageHeader/components/RecentMenuDecisionCard';

import styles from './page.module.scss';

export default function MyPage() {
  return (
    <div className={styles['container']}>
      <section className={styles['myprofile']}>
        <MyPageHeader />
      </section>

      <div className={styles['mymenu']}>
        <div className={styles['mymenu__top']}>
          <section className={styles['mymenu__top__meal']}>
            <RecentMenuDecisionCard />
          </section>

          <section className={styles['mymenu__top__favorite']}>2</section>
          <section className={styles['mymenu__top__preference']}>3</section>
        </div>

        <div className={styles['mymenu__bottom']}>
          <section className={styles['mymenu__bottom__profile']}>4</section>
          <section className={styles['mymenu__bottom__faq']}>5</section>
        </div>
      </div>
    </div>
  );
}
