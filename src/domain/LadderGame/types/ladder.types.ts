// LadderLink : 사다리 내의 '가로줄' 위치 정보
// col → col + 1 로만 연결 가능하며, 교차는 허용되지 않음
export type LadderLink = {
  row: number; // 가로줄이 위치한 세로 단계 index (0 ~ rows-1)
  col: number; // 가로줄 시작 세로줄 index (0 ~ cols-2)
};

// Ladder : 완성된 사다리의 전체 논리 구조
export type Ladder = {
  cols: number;        // 세로줄 개수 (입력값 개수와 동일)
  rows: number;        // 사다리 전체 높이 (논리적 단계 수, UI에서는 stretch)
  links: LadderLink[]; // 모든 가로줄 리스트
};

// LadderOptions : 사다리 생성 시 필요한 입력 옵션
// rows는 내부 고정값(defaultRows) 사용 → UI에서 조작하지 않음
export type LadderOptions = {
  cols: number;               // 참가자 수 또는 메뉴 수 (2~10)
  rows?: number;              // optional: 기본 rows 적용
  linkProbability?: number;   // 0~1: 가로줄 생성 확률 (내부 고정값 사용)
};

// PathStep : 경로 추적/애니메이션을 위한 1단계 이동 정보
export type PathStep = {
  row: number; // 현재 위치한 row index
  col: number; // 현재 위치한 col index
};

// 최종 매칭 결과 1개
export type LadderResultItem = {
  startIndex: number; // 출발 col index
  endIndex: number;   // 최종 도착 col index
};

// LadderResult : 모든 참가자에 대한 매칭 결과 리스트
export type LadderResult = LadderResultItem[];
