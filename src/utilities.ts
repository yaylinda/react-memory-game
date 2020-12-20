import { produce } from "immer";
import { LevelData } from "./types"

export const initializeLevelData = (): LevelData => {
  return {
    numCols: 3,
    correctSequence: [],
    grid: [
      { id: 0, color: '#DE3163' },
      { id: 1, color: '#FF7F50' },
      { id: 2, color: '#FFBF00' },
      { id: 3, color: '#CCCCFF' },
      { id: 4, color: '#282c34' },
      { id: 5, color: '#DFFF00' },
      { id: 6, color: '#6495ED' },
      { id: 7, color: '#40E0D0' },
      { id: 8, color: '#9FE2BF' },
    ],
  }
}

export const generateNextLevelData = (levelData: LevelData, nextLevel: number): LevelData => {
  return produce(levelData, (draft) => {
    if (draft.correctSequence.length < nextLevel) {
      draft.correctSequence.push(Math.floor(Math.random() * (levelData.grid.length - 1)));
    }
  });
}