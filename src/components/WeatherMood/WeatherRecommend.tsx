'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import styles from './WeatherRecommend.module.scss';
import { getFinalRecommend } from '@/utils/recommend/weather';

export default function WeatherRecommend() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = useCallback(async (url: string) => {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data: WeatherData = await response.json();
      setWeather(data);
    } catch (err) {
      console.error(err);
      setError('날씨 정보를 불러올 수 없습니다.');
    }
  }, []);

  const fetchWeatherFromCoords = useCallback(
    (pos: GeolocationPosition) => {
      const { latitude, longitude } = pos.coords;
      fetchWeather(`/api/weather?lat=${latitude}&lon=${longitude}`);
    },
    [fetchWeather]
  );

  const fetchDefaultWeather = useCallback(() => {
    fetchWeather('/api/weather');
  }, [fetchWeather]);

  const requestGeolocation = useCallback(() => {
    if (!navigator.geolocation) {
      fetchDefaultWeather();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      pos => fetchWeatherFromCoords(pos),
      () => fetchDefaultWeather(),
      { enableHighAccuracy: true, timeout: 5000 }
    );
  }, [fetchDefaultWeather, fetchWeatherFromCoords]);

  useEffect(() => {
    requestGeolocation();
  }, [requestGeolocation]);

  if (error) {
    return <p className={styles['weatherText']}>{error}</p>;
  }

  if (!weather) {
    return <p className={styles['weatherText']}>날씨 불러오는 중...</p>;
  }

  const { main, name, weather: weatherDetails } = weather;

  const condition = weatherDetails[0].main;
  const iconCode = weatherDetails[0].icon;
  const description = weatherDetails[0].description;
  const temperature = Math.round(main.temp);

  const recommendedMenu = getFinalRecommend(condition, temperature);

  return (
    <div className={styles['container']}>
      <div className={styles['weatherInfo']}>
        <Image
          src={`https://openweathermap.org/img/wn/${iconCode}@2x.png`}
          alt="weather icon"
          width={90}
          height={90}
          className={styles['icon']}
        />

        <p className={styles['weatherText']}>
          {name} / {description} {temperature}°
        </p>
      </div>

      <h4 className={styles['title']}>오늘은 이거지!</h4>

      <div className={styles['list']}>
        {recommendedMenu.map(menu => (
          <div key={menu} className={styles['card']}>
            {menu}
          </div>
        ))}
      </div>
    </div>
  );
}
