import React, { useCallback, useEffect, useState } from 'react';
import { chunk } from 'lodash';
import classNames from 'classnames';
import { GameStage, LevelData } from './types';
import { generateNextLevelData, initializeLevelData } from './utilities';
import './App.css';
import { produce } from 'immer';

function App() {
  const [currentLevel, setCurrentLevel] = useState<number>(1);
  const [levelData, setLevelData] = useState<LevelData>(initializeLevelData());
  const [gameStage, setGameStage] = useState<GameStage>("GENERATE_LEVEL");

  // SHOW_PREVIEW - keep track of which dots to blink
  const [dotBlinkIndex, setDotBlinkIndex] = useState<number>(-1);
  const [dotBlinkId, setDotBlinkId] = useState<number>(-1);

  // ACCEPT_INPUT - keep track of dot inputs
  const [inputDotNumber, setInputDotNumber] = useState<number>(0);

  useEffect(() => {
    console.log(`useEffect - []`);
    setUpLevelData();
  }, []);

  useEffect(() => {
    if (gameStage !== "SHOW_PREVIEW") {
      console.log(`useEffect - [gameStage, dotBlinkIndex] - NOT SHOW_PREVIEW, doing nothing`);
      return;
    }

    if (dotBlinkIndex < levelData.correctSequence.length) {
      console.log(`useEffect - [gameStage, dotBlinkIndex] - doing stuff`);
      setTimeout(() => {
        const newDotBlinkIndex = dotBlinkIndex + 1;
        setDotBlinkIndex(newDotBlinkIndex);
        setDotBlinkId(levelData.correctSequence[newDotBlinkIndex]);
      }, 500);
    } else {
      console.log(`useEffect - [gameStage, dotBlinkIndex] - moving to ACCEPT_INPUT`);
      setDotBlinkIndex(-1);
      setDotBlinkId(-1);
      setGameStage("ACCEPT_INPUT");
    }
  }, [gameStage, dotBlinkIndex]);

  const setUpLevelData = useCallback(() => {
    const currentLevelData = generateNextLevelData(levelData, currentLevel);

    console.log(`setUpLevelData - currentLevel: ${currentLevel}, currentLevelData: ${JSON.stringify(currentLevelData)}`);

    setLevelData(currentLevelData);
    setGameStage("SHOW_PREVIEW");
  }, [currentLevel, levelData]);

  const setUpNextLevel = useCallback(() => {
    const nextLevel = currentLevel + 1;
    const nextLevelData = generateNextLevelData(levelData, nextLevel);

    console.log(`setUpNextLevel - nextLevel: ${nextLevel}, nextLevelData: ${JSON.stringify(nextLevelData)}`);

    setCurrentLevel(nextLevel);
    setLevelData(nextLevelData);
    setGameStage("SHOW_PREVIEW");
    setInputDotNumber(0);
  }, [currentLevel, levelData]);

  const handleDotClick = useCallback((dotId: number) => {
    if (gameStage !== "ACCEPT_INPUT") {
      console.log(`handleDotClick - NOT ACCEPT_INPUT, doing nothing`);
    }

    const isLastDot = inputDotNumber === levelData.correctSequence.length - 1;
    const isInputDotCorrect = dotId === levelData.correctSequence[inputDotNumber];

    console.log(`handleDotClick - dotId: ${dotId}, inputDotNumber: ${inputDotNumber}, isLastDot: ${isLastDot}, isInputDotCorrect: ${isInputDotCorrect}`);

    if (isLastDot && isInputDotCorrect) {
      setUpNextLevel();
    } else if (!isLastDot && isInputDotCorrect) {
      setInputDotNumber(inputDotNumber + 1);
    } else if (!isInputDotCorrect) {
      endGame();
    }

  }, [levelData, gameStage, inputDotNumber]);

  const endGame = () => {
    setCurrentLevel(1);
    setLevelData(produce(levelData, (draft) => {
      draft.correctSequence = [];
    }));
    setGameStage("GAME_OVER");
    setDotBlinkIndex(-1);
    setDotBlinkId(-1);
    setInputDotNumber(0);
  };

  const renderDotsGrid = () => {

    if (!levelData) {
      return null;
    }

    const chunked = chunk(levelData.grid, levelData.numCols);

    return (
      <div className="dots-grid-container">
        {
          chunked.map((row, rowIndex) => (
            <div className="dots-grid-row" key={rowIndex}>
              {
                row.map((dot, colIndex) => (
                  <div className="dots-grid-cell" key={`${rowIndex}_${colIndex}`}>
                    <div
                      className={classNames("dot", { "dot--once": dot.id === dotBlinkId })}
                      style={{ backgroundColor: dot.color }}
                      onClick={() => handleDotClick(dot.id)}
                    >
                    </div>
                  </div>
                ))
              }
            </div>
          ))
        }
      </div>
    );
  }

  return (
    <div className="App">
      <div className="level-text">Level {currentLevel}</div>
      {renderDotsGrid()}
    </div>
  );
}

export default App;
