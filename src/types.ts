export type Dot = {
  id: number,
  color: string,
};

export type LevelData = {
  level: number,
  numCols: number,
  correctSequence: number[],
  grid: Dot[],
};

export type GameStage = "GENERATE_LEVEL" | "SHOW_PREVIEW" | "ACCEPT_INPUT";