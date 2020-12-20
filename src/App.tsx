import React, { useEffect, useState } from 'react';
import {chunk} from 'lodash';
import './App.css';
import { GameStage, LevelData } from './types';
import { generateLevelData } from './utilities';

function App() {
  const [currentLevel, setCurrentLevel] = useState<number>(1);
  const [levelData, setLevelData] = useState<LevelData>();
  const [stage, setStage] = useState<GameStage>();

  useEffect(() => {
    setLevelData(generateLevelData(currentLevel));
  }, []);

  const handleDotClick = (dotId: number) => {
    console.log(`handleDotClick - dotId: ${dotId}`);
  }

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
                      className="dot" 
                      style={{ backgroundColor: dot.color}} 
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
