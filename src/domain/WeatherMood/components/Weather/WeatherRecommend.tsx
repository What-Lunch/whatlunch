'use client';

import Image from 'next/image';

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
  // 날씨 및 공기질 데이터 조회
  const { weather, air, error, loading } = useWeather();

  // 현재 날씨 정보 중 첫 번째 데이터만 사용
  const currentWeather = weather?.weather?.[0] ?? null;

  // 추천에 필요한 날씨 타입
  const mainWeather = currentWeather?.main ?? null;
  const feelsLike = weather ? Math.round(weather.main.feels_like) : null;

  const { menus, loading: recommendLoading } = useWeatherRecommend(mainWeather, feelsLike);

  // 로딩 상태 처리
  if (loading || recommendLoading) {
    return <p className={styles['weather-recommend__text']}>날씨 불러오는 중...</p>;
  }

  // 에러 상태 처리
  if (error) {
    return <p className={styles['weather-recommend__text']}>{error}</p>;
  }

  if (!weather || !currentWeather || !menus) {
    return null;
  }

  // 표시용 데이터 가공
  const description = getShortDescription(currentWeather.description ?? '');
  const iconCode = currentWeather.icon ?? '';

  const temperature = Math.round(weather.main.temp);
  const humidity = Math.round(weather.main.humidity);

  // 공기질 정보
  const airInfo = air?.list?.[0];
  const aqi = airInfo?.main?.aqi ?? 1;

  return (
    <div className={styles['weather-recommend']}>
      {/* 날씨 카드 영역 */}
      <div className={styles['weather-recommend__card']}>
        <div className={styles['weather-recommend__icon-wrap']}>
          <Image
            src={`https://openweathermap.org/img/wn/${iconCode}@2x.png`}
            alt={description}
            width={90}
            height={90}
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

          <p className={styles['weather-recommend__humidity']}>
            체감온도 {feelsLike}° / 습도 {humidity}%
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
