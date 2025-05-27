import React, { useEffect, useState, useMemo, useRef } from 'react'
import Square from './Square';

import pieceSymbolToImage from '../utils/pieceImage.js';

import { ChessBoard } from '../utils/chess.js';
import MyTimer from './MyTimer.jsx';

function Board({
    timeFormat=5 
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
            { (chessBoard) ?  
            ( <div className='flex flex-col gap relative'> 
                <div className={`absolute top-0 left-0 h-full w-full bg-gradient from-black via-gray-800 to-gray-700 bg-black z-10 ${(showMessage)? '' : 'hidden'} opacity-75 flex flex-col items-center justify-center`} >
                    <div className='text-5xl text-white'> Game Over </div>
                    <div className='text-3xl text-white'> { gameOverMessage } </div>
                </div>
                <MyTimer
                myTimerRef={myTimerRefBlack} 
                timerDuration={timeFormat} 
                color={'black'} 
                chessBoard={chessBoard} />
                <div className='w-full h-full aspect-square grid grid-cols-8 grid-rows-8'>
                    { pieceBoard }
                </div>
                <MyTimer
                    myTimerRef={myTimerRefWhite}
                    timerDuration={timeFormat}
                    color={'white'}
                    chessBoard={chessBoard} /> 
            </div> ) : '...' }
        </>
  )
}

export default Board