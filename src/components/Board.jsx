import React, { useEffect, useState, useMemo, useRef } from 'react'
import Square from './Square';

import pieceSymbolToImage from '../utils/pieceImage.js';

import { ChessBoard } from '../utils/chess.js';
import MyTimer from './MyTimer.jsx';

function Board({
    timeFormat=5*60 
}) {
    const [chessBoard, setChessBoard] = useState(null);
    const [turn, setTurn] = useState('white');
    
    const [gridCells, setGridCells] = useState([]);
    
    const [pieceBoard, setPieceBoard] = useState([]);
    
    const myTimerRefWhite = useRef(null);
    const myTimerRefBlack = useRef(null);

    useEffect(() => {
        const newBoard = new ChessBoard();
        newBoard.setGridCellsSetter(setGridCells);
        newBoard.setTurnSetter(setTurn);
        newBoard.setTurnVariable(turn);

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
            ( <div> 
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