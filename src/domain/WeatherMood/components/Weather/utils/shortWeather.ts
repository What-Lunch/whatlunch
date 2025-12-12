import type { WeatherMain } from '@/types/api/weather';

// 날씨 설명을 짧은 한글로 바꾸기 위한 규칙 형태
interface WeatherPattern {
  keyword: string; // 설명 글에 이 단어가 들어 있으면
  label: string; // 화면에 이 글자로 보여줌
}

// WeatherMain 값을 화면에 보여줄 짧은 텍스트로 변환
export const shortWeatherByMain: Partial<Record<WeatherMain, string>> = {
  Clear: '맑음',
  Clouds: '흐림',
  Rain: '비',
  Drizzle: '비',
  Thunderstorm: '천둥번개',
  Snow: '눈',
  Mist: '안개',
  Haze: '안개',
  Fog: '안개',
  Smoke: '연기',
  Dust: '먼지',
  Sand: '모래',
  Ash: '재',
  Squall: '돌풍',
};

// 날씨 설명 문장에 포함된 단어를 기준으로 짧은 표현으로 바꾸는 목록
export const WEATHER_DESCRIPTION_PATTERNS: WeatherPattern[] = [
  // 구름 관련 표현
  { keyword: '튼구름', label: '구름 많음' },
  { keyword: '튼 구름', label: '구름 많음' },
  { keyword: '약간의 구름', label: '구름 조금' },
  { keyword: '구름', label: '구름' },

  // 비 관련 표현
  { keyword: '약한 비', label: '약한 비' },
  { keyword: '가랑비', label: '약한 비' },
  { keyword: '강한 비', label: '폭우' },
  { keyword: '비', label: '비' },

  // 눈 관련 표현
  { keyword: '약한 눈', label: '약한 눈' },
  { keyword: '강한 눈', label: '강한 눈' },
  { keyword: '눈', label: '눈' },

  // 대기 상태 관련 표현
  { keyword: '안개', label: '안개' },
  { keyword: '박무', label: '안개' },
  { keyword: '연기', label: '연기' },
  { keyword: '연무', label: '연무' },
];

// 날씨 설명 문장을 받아서 화면에 보여줄 짧은 문구로 변환
export function getShortDescription(desc: string): string {
  const clean = desc.trim();

  for (const pattern of WEATHER_DESCRIPTION_PATTERNS) {
    // 설명 글에 특정 단어가 포함되어 있으면
    if (clean.includes(pattern.keyword)) {
      return pattern.label;
    }
  }

  return clean; // 해당되는 규칙이 없으면 원본 그대로 사용
}
