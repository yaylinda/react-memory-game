import React, { useCallback, useEffect, useState } from 'react';
import { chunk } from 'lodash';
import classNames from 'classnames';
import { produce } from 'immer';
import { GameStage, LevelData } from './types';
import { generateNextLevelData, initializeLevelData } from './utilities';
import './App.css';

const IN_GAME_STAGES = ["GENERATE_LEVEL", "SHOW_PREVIEW", "ACCEPT_INPUT"];

function App() {
  const [currentLevel, setCurrentLevel] = useState<number>(0);
  const [levelData, setLevelData] = useState<LevelData>(initializeLevelData());
  const [gameStage, setGameStage] = useState<GameStage>("PENDING");

  // SHOW_PREVIEW - keep track of which dots to blink
  const [dotBlinkIndex, setDotBlinkIndex] = useState<number>(-1);
  const [dotBlinkId, setDotBlinkId] = useState<number>(-1);

  // ACCEPT_INPUT - keep track of dot inputs
  const [inputDotNumber, setInputDotNumber] = useState<number>(0);

  useEffect(() => {
    console.log(`useEffect - []`);
  }, []);

  useEffect(() => {
    if (gameStage === "SHOW_PREVIEW") {
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
    }
  }, [gameStage, dotBlinkIndex]);

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
      return;
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

  const startGame = () => {
    setUpNextLevel();
  };

  const endGame = () => {
    setCurrentLevel(1);
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

  const renderPendingState = () => {
    return (
      <div>
        <div className="level-text">Dots Memory Game</div>
        {renderDotsGrid()}
        <div className="button-container">
          <button className="btn btn-5" onClick={() => startGame()}>
            Start Game
          </button>
        </div>
      </div>
    );
  }

  const renderInGameState = () => {
    return (
      <div>
        <div className="level-text">Level {currentLevel}</div>
        {renderDotsGrid()}
      </div>
    );
  }

  const renderEndGameState = () => {
    return (
      <div>
        END
      </div>
    );
  }

  return (
    <div className="App">
      { gameStage === "PENDING" ? renderPendingState() : null }
      { IN_GAME_STAGES.includes(gameStage) ? renderInGameState() : null }
      { gameStage === "GAME_OVER" ? renderEndGameState() : null }
    </div>
  );
}

export default App;
