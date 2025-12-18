import type { WeatherCondition } from './weather';

// 화면에서 바로 사용하기 위해 정리한 날씨 데이터 타입
export interface WeatherViewModel {
  // 지역 이름
  name: string;
  temp: number;

  // 체감 온도
  feelsLike: number;

  // 습도
  humidity: number;

  condition: WeatherCondition; // weather 배열의 첫 번째 값을 정리한 날씨 상태
  clouds: number;

  // 미세먼지 농도
  pm10: number;
  pm25: number;

  aqi: 1 | 2 | 3 | 4 | 5;
}
