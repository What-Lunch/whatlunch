export type LadderLink = {
  row: number;
  col: number;
};

export type Ladder = {
  cols: number;
  rows: number;
  links: LadderLink[];
};

export type LadderOptions = {
  cols: number;
  rows?: number;
  linkProbability?: number;
};

export type PathStep = {
  row: number;
  col: number;
};

export type LadderResultItem = {
  startIndex: number;
  endIndex: number;
};

export type LadderResult = LadderResultItem[];
