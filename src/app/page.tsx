import styles from './page.module.scss';
import Clock from '@/components/Clock/Clock';
import { WeatherMood } from '@/components/WeatherMood';

export default function HomePage() {
  return (
    <div className={styles['container']}>
      <div className={styles['container__left']}>
        <section className={styles['container__left__slice']}>오늘 인기있는 음식</section>
        <div className={styles['container__left__main']}>
          <section className={styles['container__left__main__roulette']}>룰렛</section>
          <section className={styles['container__left__main__option']}>찬성 반대</section>
          <section className={styles['container__left__main__map']}>지도</section>
        </div>
      </div>

      <div className={styles['container__right']}>
        <section className={styles['container__right__clock']}>
          <Clock />
        </section>
        <section className={styles['container__right__weather']}>
          <WeatherMood />
        </section>
        <section className={styles['container__right__chat']}>채팅창</section>
      </div>
    </div>
  );
}
