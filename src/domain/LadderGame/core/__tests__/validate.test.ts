import { validateOptions, validateLadder } from "../validate";
import { Ladder } from "../../types/ladder.types";

describe("validateOptions 테스트", () => {
  // 1. 최소 인원 미달인 경우 검증
  it("cols가 2 미만이면 에러", () => {
    expect(() => validateOptions({ cols: 1 })).toThrow();
  });

  // 2. 가로줄 생성 확률 범위 이탈 검증
  it("linkProbability가 0~1 범위를 벗어나면 에러", () => {
    expect(() => validateOptions({ cols: 4, linkProbability: -0.2 })).toThrow();
    expect(() => validateOptions({ cols: 4, linkProbability: 1.5 })).toThrow();
  });

  // 3. 사다리 단계 수(rows) 유효성 검증
  it("rows가 음수거나 0이면 에러", () => {
    expect(() => validateOptions({ cols: 4, rows: 0 })).toThrow();
    expect(() => validateOptions({ cols: 4, rows: -3 })).toThrow();
  });

  // 4. 정상 입력값 통과 검증
  it("올바른 옵션이면 에러 없음", () => {
    expect(() => validateOptions({ cols: 4, rows: 20, linkProbability: 0.3 })).not.toThrow();
  });
});

describe("validateLadder 구조 무결성 테스트", () => {
  const baseLadder: Ladder = {
    cols: 4,
    rows: 10,
    links: []
  };

  // 1. 기본 구조(기둥, 높이) 부족 시 검증
  it("사다리 기본 구조(cols, rows)가 기준 미달이면 에러", () => {
    expect(() => validateLadder({ ...baseLadder, cols: 1 })).toThrow();
    expect(() => validateLadder({ ...baseLadder, rows: 0 })).toThrow();
  });

  // 2. 가로줄(links) 인덱스 범위 이탈 검증 (row)
  it("가로줄의 row 인덱스가 범위를 벗어나면 에러 (row >= rows)", () => {
    const invalidLadder = {
      ...baseLadder,
      links: [{ row: 10, col: 0 }]
    };
    expect(() => validateLadder(invalidLadder)).toThrow();
  });

  // 3. 가로줄(links) 인덱스 범위 이탈 검증 (col)
  it("가로줄의 col 인덱스가 범위를 벗어나면 에러 (col > cols - 2)", () => {
    const invalidLadder = {
      ...baseLadder,
      links: [{ row: 0, col: 3 }]
    };
    expect(() => validateLadder(invalidLadder)).toThrow();
  });

  // 4. 동일 행 연속 가로줄(세 갈래 길) 금지 규칙 검증
  it("같은 행(row)에 연속된 가로줄(col, col+1)이 존재하면 에러", () => {
    const badLinks = {
      ...baseLadder,
      links: [
        { row: 1, col: 0 },
        { row: 1, col: 1 }
      ]
    };
    expect(() => validateLadder(badLinks)).toThrow();
  });

  // 5. 서로 다른 행의 인접 가로줄 허용 여부 검증
  it("다른 행(row)에 있는 인접 가로줄은 허용되어야 함", () => {
    const validLinks = {
      ...baseLadder,
      links: [
        { row: 1, col: 0 },
        { row: 2, col: 1 }
      ]
    };
    expect(() => validateLadder(validLinks)).not.toThrow();
  });
});