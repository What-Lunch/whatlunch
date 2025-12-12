export const MOOD_KEYS = ['happy', 'normal', 'sad', 'angry', 'tired'] as const;

// 타입 자동 추출
export type MoodId = (typeof MOOD_KEYS)[number];

// 메타 데이터 정의
interface MoodMetaItem {
  label: string;
  icon: string;
  menus: readonly string[]; // as const 호환을 위해 readonly 명시
}

export const MOOD_META: Record<MoodId, MoodMetaItem> = {
  happy: {
    label: '기쁨',
    icon: '😊',
    menus: ['초밥', '파스타', '아이스크림', '샐러드', '스테이크', '와플'],
  },
  normal: {
    label: '보통',
    icon: '🙂',
    menus: ['김밥', '라멘', '돈까스', '칼국수', '볶음밥', '피자'],
  },
  sad: {
    label: '우울',
    icon: '😢',
    menus: ['초코케이크', '따뜻한 라떼', '마라탕', '쿠키', '바닐라 아이스크림', '치킨 수프'],
  },
  angry: {
    label: '화남',
    icon: '😡',
    menus: ['매운 떡볶이', '치즈볼', '핫도그', '마라샹궈', '불닭볶음면', '치킨윙'],
  },
  tired: {
    label: '피곤',
    icon: '😴',
    menus: ['버블티', '아메리카노', '샌드위치', '요거트', '견과류', '바나나 스무디'],
  },
};

export interface MoodOption {
  id: MoodId;
  label: string;
  icon: string;
}

// Object.entries 대신 정해진 순서 배열(MOOD_KEYS)을 순회
export const moods: MoodOption[] = MOOD_KEYS.map(id => ({
  id,
  label: MOOD_META[id].label,
  icon: MOOD_META[id].icon,
}));

export function getMoodBaseMenus(mood: MoodId): string[] {
  // Readonly 배열을 가변 배열로 복사해서 반환시킴
  return [...MOOD_META[mood].menus];
}
