import type { MoodOption, MoodId } from '@/domain/WeatherMood/mood';

export const moods: MoodOption[] = [
  { id: 'happy', label: '기쁨', icon: '😊' },
  { id: 'normal', label: '보통', icon: '🙂' },
  { id: 'sad', label: '우울', icon: '😢' },
  { id: 'angry', label: '화남', icon: '😡' },
  { id: 'tired', label: '피곤', icon: '😴' },
];

export const recommendMenu: Record<MoodId, string[]> = {
  happy: ['초밥', '파스타', '아이스크림', '샐러드', '스테이크', '와플'],
  normal: ['김밥', '라멘', '돈까스', '칼국수', '볶음밥', '피자'],
  sad: ['초코케이크', '따뜻한 라떼', '마라탕', '쿠키', '바닐라 아이스크림', '치킨 수프'],
  angry: ['매운 떡볶이', '치즈볼', '핫도그', '마라샹궈', '불닭볶음면', '치킨윙'],
  tired: ['버블티', '아메리카노', '샌드위치', '요거트', '견과류', '바나나 스무디'],
};
