export const MOOD_KEYS = ['happy', 'normal', 'sad', 'angry', 'tired'] as const;

// 기분 ID 타입 자동 추출
export type MoodId = (typeof MOOD_KEYS)[number];

// 기분 메타데이터 아이템 타입
export interface MoodMetaItem {
  label: string;
  icon: string;
  menus: readonly string[]; // UI/추천 로직에서 불변 데이터로 사용
}

// label, icon : UI 표시용
export const MOOD_META = {
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
} as const satisfies Record<MoodId, MoodMetaItem>;

// UI에서 바로 사용하는 기분 옵션 타입
export interface MoodOption {
  id: MoodId;
  label: string;
  icon: string;
}

// UI 선택용 기분 옵션 배열
export const moodOptions: MoodOption[] = MOOD_KEYS.map(id => ({
  id,
  label: MOOD_META[id].label,
  icon: MOOD_META[id].icon,
}));

// 기분별 기본 메뉴 목록 반환
export function getMoodBaseMenus(mood: MoodId): string[] {
  return [...MOOD_META[mood].menus];
}
