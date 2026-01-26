'use client';

import Image from 'next/image';
import { Wind, Droplet } from 'lucide-react';

import { useWeather } from '@/domain/WeatherMood/hooks/useWeather';
import { useWeatherRecommend } from '@/domain/WeatherMood/hooks/useWeatherRecommend';
import { getShortDescription } from '@/domain/WeatherMood/components/Weather/utils/shortWeather';

import styles from './WeatherRecommend.module.scss';

// 대기질 등급을 사용자에게 보여줄 텍스트로 변환
function getAqiLabel(aqi: number) {
  switch (aqi) {
    case 1:
      return '좋음';
    case 2:
      return '보통';
    case 3:
      return '한때 나쁨';
    case 4:
      return '나쁨';
    case 5:
      return '매우 나쁨';
    default:
      return '정보 없음';
  }
}

export default function WeatherRecommend() {
  const { weather, air, error, loading } = useWeather();
  const currentWeather = weather?.weather?.[0] ?? null;
  const mainWeather = currentWeather?.main ?? null;
  const feelsLike = weather ? Math.round(weather.main.feels_like) : null;

  const { menus, loading: recommendLoading } = useWeatherRecommend(mainWeather, feelsLike);

  if (loading || recommendLoading) {
    return <p className={styles['weather-recommend__text']}>날씨 불러오는 중...</p>;
  }

  if (error) {
    return <p className={styles['weather-recommend__text']}>{error}</p>;
  }

  if (!weather || !currentWeather || !menus) {
    return null;
  }

  const description = getShortDescription(currentWeather.description ?? '');
  const iconCode = currentWeather.icon ?? '';
  const temperature = Math.round(weather.main.temp);
  const humidity = Math.round(weather.main.humidity);

  // 공기질 정보
  const airInfo = air?.list?.[0];
  const aqi = airInfo?.main?.aqi ?? 1;

  return (
    <div className={styles['weather-recommend']}>
      {/* 날씨 카드 */}
      <div className={styles['weather-recommend__card']}>
        <div className={styles['weather-recommend__icon-wrap']}>
          <Image
            src={`https://openweathermap.org/img/wn/${iconCode}@2x.png`}
            alt={description}
            width={72}
            height={72}
            className={styles['weather-recommend__icon']}
          />
          <span className={styles['weather-recommend__temp']}>{temperature}°</span>
        </div>

        <div className={styles['weather-recommend__content']}>
          <p className={styles['weather-recommend__summary']}>
            {weather.name} / {description}{' '}
            <span className={`${styles['weather-recommend__aqi']} ${styles[`aqi-${aqi}`]}`}>
              (공기 상태: {getAqiLabel(aqi)})
            </span>
          </p>

          <p className={styles['weather-recommend__meta']}>
            <span className={styles['weather-recommend__meta-item']}>
              <Wind className={styles['weather-recommend__meta-icon']} aria-hidden="true" />
              체감온도 {feelsLike}°
            </span>

            <span className={styles['weather-recommend__meta-item']}>
              <Droplet className={styles['weather-recommend__meta-icon']} aria-hidden="true" />
              습도 {humidity}%
            </span>
          </p>
        </div>
      </div>

      <h4 className={styles['weather-recommend__title']}>오늘은 이거지!</h4>

      <div className={styles['weather-recommend__list']}>
        {menus.map(menu => (
          <div key={menu} className={styles['weather-recommend__item']}>
            {menu}
          </div>
        ))}
      </div>
    </div>
  );
}
