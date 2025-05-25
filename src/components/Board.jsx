import React, { useEffect, useState } from 'react'
import Square from './Square';

import pieceSymbolToImage from '../utils/pieceImage.js';

import { ChessBoard } from '../utils/chess.js';

function Board() {
    // const [chessBoard, setChessBoard] = useState(new ChessBoard());
    const [chessBoard, setChessBoard] = useState(null);
    const [turn, setTurn] = useState('white');
    // const [gridCells, setGridCells] = useState(chessBoard.getReducedGridRepresentation());
    const [gridCells, setGridCells] = useState([]);
    
    // chessBoard.setGridCellsSetter(setGridCells);
    // chessBoard.setTurnSetter(setTurn);
    // chessBoard.setTurnVariable(turn);
    
    const [pieceBoard, setPieceBoard] = useState([]);

    useEffect(() => {
        const newBoard = new ChessBoard();
        newBoard.setGridCellsSetter(setGridCells);
        newBoard.setTurnSetter(setTurn);
        newBoard.setTurnVariable(turn);

        setChessBoard(newBoard);
        setGridCells(newBoard.getReducedGridRepresentation());
    }, []);
    
    useEffect(() => {
        setPieceBoard(formPieceBoard(gridCells, pieceSymbolToImage));
    }, [gridCells])

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

    // const pieceBoard = formPieceBoard(gridCells, pieceSymbolToImage);

    return (
        <div className='w-full h-full aspect-square grid grid-cols-8 grid-rows-8'>
            { pieceBoard }
        </div>
  )
}

export default Board