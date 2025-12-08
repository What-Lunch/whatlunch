import { Ladder, LadderResult, Point } from "../types/ladder.types";
import { range } from "../utils/range";

/**
 * calculatePath: 특정 시작점에서 목적지까지의 경로와 최종 위치를 계산합니다.
 */
export function calculatePath(ladder: Ladder, startCol: number): { endIndex: number; path: Point[] } {
  let currentCol = startCol;
  const path: Point[] = [];

  for (let row = 0; row < ladder.rows; row++) {
    // 현재 지점 기록 (수직 하강 시작 지점)
    path.push({ x: currentCol, y: row });

    // [성능 개선] filter 대신 find를 사용하여 조건 충족 시 조기 종료
    const horizontalLink = ladder.links.find(
      link => link.row === row && (link.col === currentCol || link.col === currentCol - 1)
    );

    if (horizontalLink) {
      // 가로줄을 만난 경우: 오른쪽 혹은 왼쪽으로 이동
      if (horizontalLink.col === currentCol) {
        currentCol++; // 오른쪽으로
      } else {
        currentCol--; // 왼쪽으로
      }
      // 꺾인 지점 좌표 기록 (애니메이션을 위해)
      path.push({ x: currentCol, y: row });
    }
  }

  // 최종 바닥 좌표 기록
  path.push({ x: currentCol, y: ladder.rows });

  return { endIndex: currentCol, path };
}

/**
 * calculateAllResults: 모든 참가자의 결과를 계산하여 배열 형태로 반환합니다.
 */
export function calculateAllResults(ladder: Ladder): LadderResult {
  // 1. range(0, ladder.cols - 1)를 사용하여 0부터 cols-1까지 순회
  const startColumns = range(0, ladder.cols - 1);

  // 2. Map 대신 LadderResult 타입(배열)으로 결과 구성
  return startColumns.map(startCol => {
    const { endIndex } = calculatePath(ladder, startCol);
    return {
      startIndex: startCol,
      endIndex: endIndex
    };
  });
}