import { Ladder, LadderResult, Point } from "../types/ladder.types";
import { range } from "../utils/range";

export function calculatePath(ladder: Ladder, startCol: number): { endIndex: number; path: Point[] } {
  let currentCol = startCol;
  const path: Point[] = [];

  for (let row = 0; row < ladder.rows; row++) {
    path.push({ x: currentCol, y: row });

    const horizontalLink = ladder.links.find(
      link => link.row === row && (link.col === currentCol || link.col === currentCol - 1)
    );

    if (horizontalLink) {
      if (horizontalLink.col === currentCol) {
        currentCol++;
      } else {
        currentCol--;
      }
      path.push({ x: currentCol, y: row });
    }
  }

  path.push({ x: currentCol, y: ladder.rows });

  return { endIndex: currentCol, path };
}

export function calculateAllResults(ladder: Ladder): LadderResult {
  const startColumns = range(0, ladder.cols - 1);

  return startColumns.map(startCol => {
    const { endIndex } = calculatePath(ladder, startCol);
    return {
      startIndex: startCol,
      endIndex: endIndex
    };
  });
}