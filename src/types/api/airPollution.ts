// OpenWeather 대기질 API 타입
export interface AirPollutionData {
  list: {
    main: { aqi: 1 | 2 | 3 | 4 | 5 };
    components: {
      pm2_5: number;
      pm10: number;
      o3: number;
      no2: number;
      so2: number;
      co: number;
    };
  }[];
}
