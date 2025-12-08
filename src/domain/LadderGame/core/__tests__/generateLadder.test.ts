import { generateLadder } from "../generateLadder";
import { validateOptions } from "../validate";
import { LadderOptions } from "../../types/ladder.types";

describe("generateLadder", () => {
  const defaultRows = 20;

  // 1. 기본 구조 및 타입 검증
  it("올바른 구조의 Ladder 객체를 반환해야 한다", () => {
    const options: LadderOptions = { cols: 4, rows: defaultRows, linkProbability: 0.3 };
    validateOptions(options);

    const ladder = generateLadder(options);

    expect(ladder.cols).toBe(4);
    expect(ladder.rows).toBe(defaultRows);
    expect(Array.isArray(ladder.links)).toBe(true);
  });

  // 2. 데이터 범위 유효성 검증
  it("link의 row와 col 범위가 유효해야 한다", () => {
    const ladder = generateLadder({ cols: 5, rows: defaultRows });

    for (const link of ladder.links) {
      // row: 0 <= row < rows
      expect(link.row).toBeGreaterThanOrEqual(0);
      expect(link.row).toBeLessThan(defaultRows);
      // col: 0 <= col <= cols - 2
      expect(link.col).toBeGreaterThanOrEqual(0);
      expect(link.col).toBeLessThan(4); 
    }
  });

  // 3. 확률 기반 생성 및 기본값 검증
  it("linkProbability가 0일 때 가로줄이 하나도 생성되지 않아야 한다", () => {
    const ladder = generateLadder({ cols: 5, rows: 10, linkProbability: 0 });
    expect(ladder.links.length).toBe(0);
  });

  it("rows 옵션을 생략하면 기본값 15단계가 적용되어야 한다", () => {
    const ladder = generateLadder({ cols: 4 });
    expect(ladder.rows).toBe(15);
  });

  // 4. 예외 방어 검증
  it("잘못된 입력(cols < 2)이 들어오면 에러를 던져야 한다", () => {
    const invalidOptions = { cols: 1, rows: 10 } as unknown as LadderOptions;
    
    expect(() => validateOptions(invalidOptions)).toThrow();
    expect(() => generateLadder(invalidOptions)).toThrow();
  });

  // 5. 핵심 규칙(가로줄 교차 금지) 검증
  it("가로줄 교차가 없어야 한다(연속된 col 금지 규칙 준수)", () => {
    const ladder = generateLadder({ cols: 5, rows: defaultRows, linkProbability: 1 });

    const groupedByRow = new Map<number, number[]>();
    ladder.links.forEach((l) => {
      if (!groupedByRow.has(l.row)) groupedByRow.set(l.row, []);
      groupedByRow.get(l.row)!.push(l.col);
    });

    groupedByRow.forEach((columnIndices) => {
      const sorted = columnIndices.sort((a, b) => a - b);
      for (let i = 0; i < sorted.length - 1; i++) {
        expect(sorted[i + 1] - sorted[i]).toBeGreaterThan(1);
      }
    });
  });

  // 6. 무작위성 속에서도 규칙을 항상 준수하는지 대량 테스트 (스트레스 테스트)
  it("100번 반복 생성 시에도 가로줄 교차 규칙을 항상 준수해야 한다", () => {
    for (let i = 0; i < 100; i++) {
      const ladder = generateLadder({ cols: 10, rows: 20, linkProbability: 0.5 });
      
      const rowMap = new Map<number, number[]>();
      ladder.links.forEach(l => {
        if (!rowMap.has(l.row)) rowMap.set(l.row, []);
        rowMap.get(l.row)!.push(l.col);
      });

      rowMap.forEach(colsInRow => {
        const sorted = colsInRow.sort((a, b) => a - b);
        for (let j = 0; j < sorted.length - 1; j++) {
          expect(sorted[j + 1] - sorted[j]).toBeGreaterThan(1);
        }
      });
    }
  });
});