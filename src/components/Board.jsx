import React, { useEffect, useState, useMemo, useRef } from 'react'
import Square from './Square';

import pieceSymbolToImage from '../utils/pieceImage.js';

import { ChessBoard } from '../utils/chess.js';
import MyTimer from './MyTimer.jsx';

function Board({
    timeFormat=5,
    setTimeFormat 
}) {
    const [chessBoard, setChessBoard] = useState(null);
    const [turn, setTurn] = useState('white');
    
    const [gridCells, setGridCells] = useState([]);
    
    const [pieceBoard, setPieceBoard] = useState([]);
    
    const myTimerRefWhite = useRef(null);
    const myTimerRefBlack = useRef(null);

    const [gameOverMessage, setGameOverMessage] = useState('');
    const [showMessage, setShowMessage] = useState(false);

    useEffect(() => {
        const newBoard = new ChessBoard();
        newBoard.setGridCellsSetter(setGridCells);
        newBoard.setTurnSetter(setTurn);
        newBoard.setTurnVariable(turn);

        newBoard.setGameOverSetter(setShowMessage);
        newBoard.setGameOverMessageSetter(setGameOverMessage);

        setChessBoard(newBoard);
        setGridCells(newBoard.getReducedGridRepresentation());
    }, []);

    //* timer setup
    useEffect(() => {
        if (chessBoard) {
            chessBoard.setTimers(myTimerRefWhite.current, myTimerRefBlack.current);
            myTimerRefWhite.current.playTimer();
        }
    }, [chessBoard, myTimerRefWhite.current, myTimerRefBlack.current]);
    
    useEffect(() => {
        setPieceBoard(formPieceBoard(gridCells, pieceSymbolToImage));
    }, [gridCells]);

    const formPieceBoard = (gridCells, pieceSymbolToImage) => {
        if (!gridCells.length) return null;

        let pieceBoard = [];
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                pieceBoard.push(gridCells[i][j])
            }
        }

        pieceBoard = pieceBoard.map( (value, index) => (<Square 
                                                            key={index} 
                                                            number={index}
                                                            piece={value}
                                                            chessBoard={chessBoard}
                                                            turn={turn}
                                                            pieceImageSrc={pieceSymbolToImage[value]} />));
        return pieceBoard;
    }



    return (
      <>
        {chessBoard ? (
          <div className="flex flex-col gap relative">
            {showMessage && (
              <div className="absolute inset-0 z-50 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center text-center px-4">
                <div className="text-white text-6xl font-extrabold animate-pulse drop-shadow-lg">
                  ♛ Game Over ♛
                </div>
                <div className="mt-4 text-3xl font-semibold text-amber-400 drop-shadow">
                  {gameOverMessage}
                </div>
                <button
                  onClick={() => setTimeFormat(0)}
                  className="mt-6 px-6 py-2 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-full shadow-lg hover:scale-105 transition-transform duration-300"
                >
                  Play Again
                </button>
              </div>
            )}
            
            <MyTimer
              myTimerRef={myTimerRefBlack}
              timerDuration={timeFormat}
              color={"black"}
              chessBoard={chessBoard}
            />
            <div className="w-full h-full aspect-square grid grid-cols-8 grid-rows-8">
              {pieceBoard}
            </div>
            <MyTimer
              myTimerRef={myTimerRefWhite}
              timerDuration={timeFormat}
              color={"white"}
              chessBoard={chessBoard}
            />
          </div>
        ) : (
          "..."
        )}
      </>
    );
}

export default Board