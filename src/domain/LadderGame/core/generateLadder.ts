import { Ladder, LadderLink, LadderOptions } from "../types/ladder.types";
import { shuffle } from "./shuffle";
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
        isColumnOccupied[startColIndex] || 
        isColumnOccupied[startColIndex + 1] || 
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