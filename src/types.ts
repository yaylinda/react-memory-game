export type Dot = {
  id: number,
  color: string,
};

export type LevelData = {
  numCols: number,
  correctSequence: number[],
  grid: Dot[],
};

export type GameStage = "PENDING" | "GENERATE_LEVEL" | "SHOW_PREVIEW" | "ACCEPT_INPUT" | "GAME_OVER";