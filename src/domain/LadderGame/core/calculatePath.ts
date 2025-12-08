import { Ladder, LadderResult, PathStep } from "../types/ladder.types";
import { range } from "../utils/range";

export function calculatePath(ladder: Ladder, startCol: number): PathStep[] {
  let currentCol = startCol;
  const steps: PathStep[] = [];

  for (let currentRow = 0; currentRow < ladder.rows; currentRow++) {
    steps.push({ row: currentRow, col: currentCol });

    const horizontalLink = ladder.links.find(
      (link) => 
        link.row === currentRow && 
        (link.col === currentCol || link.col === currentCol - 1)
    );

    if (horizontalLink) {
      if (horizontalLink.col === currentCol) {
        currentCol++;
      } else {
        currentCol--;
      }

      steps.push({ row: currentRow, col: currentCol });
    }
  }
  steps.push({ row: ladder.rows, col: currentCol });
  return steps;
}


export function calculateAllResults(ladder: Ladder): LadderResult {
  const startColumns = range(0, ladder.cols - 1);

  return startColumns.map((startCol) => {
    const steps = calculatePath(ladder, startCol);
    const finalStep = steps[steps.length - 1];
    
    return {
      startIndex: startCol,
      endIndex: finalStep.col
    };
  });
}