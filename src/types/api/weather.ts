// OpenWeatherMap에서 제공하는 날씨 상태 코드 모음
export type WeatherMain =
  | 'Clear'
  | 'Clouds'
  | 'Rain'
  | 'Drizzle'
  | 'Thunderstorm'
  | 'Snow'
  | 'Mist'
  | 'Haze'
  | 'Fog'
  | 'Smoke'
  | 'Dust'
  | 'Sand'
  | 'Ash'
  | 'Squall';

// weather 배열 안에 들어있는 개별 날씨 정보
export interface WeatherCondition {
  main: WeatherMain;
  description: string;
  icon: string;
}

// Weather API 원본 응답 타입
export interface WeatherData {
  name: string;

  // 기온 관련 정보
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };

  // 날씨 정보 배열
  weather: WeatherCondition[];

  clouds?: {
    // 구름량
    all?: number;
  };
}
