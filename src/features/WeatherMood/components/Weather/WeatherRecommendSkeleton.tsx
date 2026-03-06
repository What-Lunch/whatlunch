import styles from './WeatherRecommend.module.scss';

export default function WeatherRecommendSkeleton() {
  return (
    <div className={styles['weather-recommend']} aria-hidden>
      <div className={styles['weather-recommend__card']}>
        <div className={styles['weather-recommend__icon-wrap']}>
          <div className={styles['weather-skeleton__icon']} />
          <div className={styles['weather-skeleton__temp']} />
        </div>

        <div className={styles['weather-recommend__content']}>
          <div className={styles['weather-skeleton__text']} />
          <div className={styles['weather-skeleton__text']} />
        </div>
      </div>

      <div className={styles['weather-skeleton__text']} />

      <div className={styles['weather-recommend__list']}>
        {Array.from({ length: 6 }).map((_, idx) => (
          <div key={idx} className={styles['weather-skeleton__menu']} />
        ))}
      </div>
    </div>
  );
}
