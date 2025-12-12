// 기분별로 사용할 고정 데이터 모음
const MOOD_META = {
  happy: { label: '기쁨', icon: '😊' },
  normal: { label: '보통', icon: '🙂' },
  sad: { label: '우울', icon: '😢' },
  angry: { label: '화남', icon: '😡' },
  tired: { label: '피곤', icon: '😴' },
} as const;

// 메타 키로부터 기분 ID 타입 추출
type MoodId = keyof typeof MOOD_META;

// UI용 옵션 타입
export type MoodOption = {
  id: MoodId;
} & Pick<(typeof MOOD_META)[MoodId], 'label' | 'icon'>;

const moodKeys = Object.keys(MOOD_META) as MoodId[];

// 메타를 UI에서 바로 쓰는 배열로 변환
export const moodOptions: MoodOption[] = moodKeys.map(id => ({
  id,
  ...MOOD_META[id],
}));
