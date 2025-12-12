// 기분별로 사용할 고정 데이터 모음
export const MOOD_META = {
  happy: { label: '기쁨', icon: '😊' },
  normal: { label: '보통', icon: '🙂' },
  sad: { label: '우울', icon: '😢' },
  angry: { label: '화남', icon: '😡' },
  tired: { label: '피곤', icon: '😴' },
} as const;

export type MoodId = keyof typeof MOOD_META;

// UI에서 사용하는 기분 선택 옵션 타입
export interface MoodOption {
  id: MoodId;
  label: string;
  icon: string;
}

// MOOD_META를 버튼 렌더링용 배열로 변환
export const moodOptions: MoodOption[] = Object.entries(MOOD_META).map(([id, { label, icon }]) => ({
  id: id as MoodId,
  label,
  icon,
}));
