import { calculatePath } from "../calculatePath";
import { Ladder } from "../../types/ladder.types";

describe("calculatePath 경로 탐색 유닛 테스트", () => {
  // 1. 기본 직선 이동 테스트
  it("가로줄이 없는 경우, 시작 컬럼과 도착 컬럼이 동일해야 한다", () => {
    const ladder: Ladder = {
      cols: 4,
      rows: 10,
      links: []
    };

    const steps = calculatePath(ladder, 2);
    const lastStep = steps[steps.length - 1];

    expect(lastStep.col).toBe(2);
  });

  // 2. 단일 방향 이동 테스트
  it("오른쪽으로 연결된 가로줄을 만나면 col이 1 증가해야 한다", () => {
    const ladder: Ladder = {
      cols: 4,
      rows: 5,
      links: [{ row: 0, col: 2 }]
    };

    const steps = calculatePath(ladder, 2);
    const last = steps[steps.length - 1];

    expect(last.col).toBe(3);
  });

  it("왼쪽으로 연결된 가로줄을 만나면 col이 1 감소해야 한다", () => {
    const ladder: Ladder = {
      cols: 4,
      rows: 5,
      links: [{ row: 0, col: 1 }]
    };

    const steps = calculatePath(ladder, 2);
    const last = steps[steps.length - 1];

    expect(last.col).toBe(1);
  });

  // 3. 복합 및 연속 이동 테스트
  it("여러 개의 가로줄이 있는 복합 경로에서도 정확한 최종 col을 반환해야 한다", () => {
    const ladder: Ladder = {
      cols: 4,
      rows: 5,
      links: [
        { row: 0, col: 1 },
        { row: 1, col: 2 },
      ]
    };

    const steps = calculatePath(ladder, 1);
    const last = steps[steps.length - 1];

    expect(last.col).toBe(3);
  });

  // 4. 경로 기록(PathStep) 무결성 테스트
  it("전체 경로(steps) 배열에 수직 하강과 수평 이동 좌표가 모두 정확히 기록되어야 한다", () => {
    const ladder: Ladder = {
      cols: 3,
      rows: 2,
      links: [{ row: 0, col: 0 }]
    };

    const steps = calculatePath(ladder, 0);
    
    // 기대 스텝: 시작(0,0) -> 꺾임(0,1) -> 하강(1,1) -> 바닥(2,1)
    expect(steps.length).toBe(4);
    expect(steps[1]).toEqual({ row: 0, col: 1 });
    expect(steps[3]).toEqual({ row: 2, col: 1 });
  });

  // 5. 경계값 및 예외 상황 테스트
  it("사다리 맨 끝(마지막 컬럼)에서 왼쪽으로 이동하는 로직이 정확해야 한다", () => {
    const ladder: Ladder = {
      cols: 3,
      rows: 5,
      links: [{ row: 0, col: 1 }]
    };

    const steps = calculatePath(ladder, 2);
    const last = steps[steps.length - 1];

    expect(last.col).toBe(1);
  });

  it("현재 경로와 상관없는 위치에 있는 가로줄은 무시하고 직진해야 한다", () => {
    const ladder: Ladder = {
      cols: 4,
      rows: 5,
      links: [{ row: 0, col: 2 }]
    };

    const steps = calculatePath(ladder, 0);
    const last = steps[steps.length - 1];

    expect(last.col).toBe(0);
  });
});