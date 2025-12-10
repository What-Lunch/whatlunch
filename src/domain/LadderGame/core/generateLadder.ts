import { Ladder, LadderLink, LadderOptions } from "../types/ladder.types";
import { shuffle } from "../utils/shuffle";
import { range } from "../utils/range";

export function generateLadder(options: LadderOptions): Ladder {
  const { cols, rows = 15, linkProbability = 0.3 } = options;

  if (cols < 2 || rows < 1) {
    throw new Error("사다리는 최소 2개의 세로줄과 1단계 이상의 높이가 필요합니다.");
  }
  
  const links: LadderLink[] = [];
  const colCandidates = range(0, cols - 2);

  for (let currentRow = 0; currentRow < rows; currentRow++) {
    const shuffledCols = shuffle(colCandidates);
    
    const isColumnOccupied = new Array(cols).fill(false);
    let rowLinkCount = 0;

    const maxLinksInRow = Math.ceil((cols - 1) * linkProbability);

    for (const startColIndex of shuffledCols) {
      if (Math.random() > linkProbability) continue;

      if (rowLinkCount >= maxLinksInRow) break;

      const isBlocked = 
      // 현재 칸에 이미 가로줄이 겹쳐서 생기는 것을 방지
      // C_start 기둥이 이미 사용 중인 경우와 C_start+1 기둥이 이미 사용 중인 경우
      isColumnOccupied[startColIndex] ||
      isColumnOccupied[startColIndex + 1] ||
      // 인접한 칸에 가로줄이 생겨 연속된 가로줄이 되는 것을 방지
      // 왼쪽 칸 (C_start-1 ~ C_start)이 연속되는 경우와 오른쪽 칸 (C_start+1 ~ C_start+2)이 연속되는 경우
      (startColIndex > 0 && isColumnOccupied[startColIndex - 1]) ||
      (startColIndex < cols - 2 && isColumnOccupied[startColIndex + 2]);

      if (!isBlocked) {
        links.push({ row: currentRow, col: startColIndex });
        isColumnOccupied[startColIndex] = true;
        isColumnOccupied[startColIndex + 1] = true;
        rowLinkCount++;
      }
    }
  }

  return { cols, rows, links };
}