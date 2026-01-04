// API 데이터를 가공해 화면에 보여주기 위한 메뉴 성향 요약 데이터
type MenuSummaryItem = {
  id: 'category' | 'mealTier' | 'time' | 'style'; // 화면에서 쓰는 고정 항목 키
  title: string; // 항목 제목(화면 표시용)
  value: string; // API 데이터를 가공해 만든 화면용 문장
  percentage?: number; // API에서 받은 비율 값(%)
};

type MenuSummaryData = {
  title: string; // 카드 제목
  headerIcon: 'trending'; // 카드 헤더 아이콘
  items: MenuSummaryItem[]; // API 데이터를 가공해 만든 요약 항목들
};

export const MENU_SUMMARY_MOCK = {
  title: '최근 메뉴 성향 요약',
  headerIcon: 'trending',
  items: [
    { id: 'category', title: '가장 많이 선택한 카테고리', value: '한식 (42%)', percentage: 42 },
    { id: 'mealTier', title: '평균 식사 기준', value: '보통 한 끼 식사를 가장 자주 선택해요.' },
    { id: 'time', title: '선호하는 시간대', value: '주로 저녁 시간대(18:00~20:00)에 식사해요.' },
    { id: 'style', title: '식사 스타일', value: '혼밥 위주의 식사 패턴이에요.' },
  ],
} satisfies MenuSummaryData;
