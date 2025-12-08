import { Ladder, LadderLink, LadderOptions } from "../types/ladder.types";

export function validateOptions(options: LadderOptions): void {
  const { cols, rows, linkProbability } = options;

  if (typeof cols !== "number" || !Number.isInteger(cols) || cols < 2) {
    throw new Error("Validation Error: 'cols' (참가자 수)는 최소 2 이상인 정수여야 합니다.");
  }

  if (rows !== undefined && (typeof rows !== "number" || !Number.isInteger(rows) || rows < 1)) {
    throw new Error("Validation Error: 'rows' (단계 수)는 최소 1 이상인 정수여야 합니다.");
  }

  if (
    linkProbability !== undefined &&
    (typeof linkProbability !== "number" || linkProbability < 0 || linkProbability > 1)
  ) {
    throw new Error("Validation Error: 'linkProbability'는 0.0과 1.0 사이의 값이어야 합니다.");
  }
}


export function validateLadder(ladder: Ladder): void {
  const { cols, rows, links } = ladder;

  if (cols < 2) throw new Error("Validation Error: 사다리 항목(cols) 부족 (2개 미만)");
  if (rows < 1) throw new Error("Validation Error: 사다리 높이(rows) 부족 (1개 미만)");
  if (!Array.isArray(links)) throw new Error("Validation Error: 사다리 연결 정보(links)는 배열 형태여야 합니다.");

  links.forEach((link, index) => {
    if (link.row < 0 || link.row >= rows) {
      throw new Error(`Link Error: Index ${index}의 row(${link.row})가 범위를 벗어났습니다.`);
    }
    if (link.col < 0 || link.col > cols - 2) {
      throw new Error(`Link Error: Index ${index}의 col(${link.col})이 범위를 벗어났습니다.`);
    }
  });

  validateNoConsecutiveLinks(links);
}

function validateNoConsecutiveLinks(links: LadderLink[]): void {
  const linksGroupedByRow: Record<number, number[]> = {};

  for (const { row, col } of links) {
    if (!linksGroupedByRow[row]) {
      linksGroupedByRow[row] = [];
    }
    linksGroupedByRow[row].push(col);
  }

  Object.entries(linksGroupedByRow).forEach(([row, columnIndices]) => {
    const sortedIndices = columnIndices.sort((a, b) => a - b);

    for (let i = 0; i < sortedIndices.length - 1; i++) {
      if (sortedIndices[i + 1] - sortedIndices[i] === 1) {
        throw new Error(`Validation Error: ${row}번 행의 ${sortedIndices[i]}번과 ${sortedIndices[i + 1]}번 열에 연속된 연결선(links)이 존재합니다.`);
      }
    }
  });
}