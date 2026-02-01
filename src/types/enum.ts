export enum Category {
  ALL = '전체',
  BEST = '베스트',
  KOREAN = '한식',
  CHINESE = '중식',
  JAPANESE = '일식',
  WESTERN = '양식',
  SNACK = '분식',
}

// 상황별 메뉴
export enum Context {
  LUNCH = '점심',
  SOLO = '혼밥',
  CELEBRATION = '기념일',
  DATE = '데이트',
  LIGHT = '가볍게',
  LATE_NIGHT = '야식',
  STRESS = '스트레스',
}

export enum UserRole {
  HOST = 'host',
  GUEST = 'guest',
}

export enum RoomStatus {
  ACTIVE = 'ACTIVE',
  CLOSED = 'CLOSED',
  ARCHIVED = 'ARCHIVED',
}
