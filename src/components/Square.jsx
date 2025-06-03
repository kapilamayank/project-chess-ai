import React, { useState, useEffect } from 'react'
import pieces from '../utils/chessPieceRepresentation';
import pieceSymbolToImage from '../utils/pieceImage';

function Square({
  number,
  piece,
  chessBoard,
  turn,
  pieceImageSrc
}) {
    const row = Math.floor(number / 8);
    const col = Math.floor(number % 8);

    const cellColor = (row & 1) ? 'odd:bg-[#8B4513] even:bg-[#C8A165]' : 'even:bg-[#8B4513] odd:bg-[#C8A165]';

    const promotionSquare = (row === 0 || row === 7);
    const [showPromotion, setShowPromotion] = useState(false);

    const handleDragStart = (e) => {
      const data = {
        fromSquare: number,
        pieceSymbol: piece,
        pieceImageSrc: pieceImageSrc 
      };

      e.dataTransfer.setData("application/json", JSON.stringify(data));
    }

    const handleDragOver = (e) => {
      e.preventDefault();
    }

    const handleDrop = (e) => {
      const data = { toSquare: number, ...JSON.parse(e.dataTransfer.getData("application/json")) };

      // console.log(data);
      chessBoard.makeMove(data);
    }

    //! here
    useEffect(() => {
      chessBoard.setSquare(number, { promotionSquare, setShowPromotion });
    }, []);

    const promoteTo = (symbolRepresentation) => {
      chessBoard.makePromotion(number, symbolRepresentation);
      setShowPromotion(false);

      chessBoard.updateBoard();
      chessBoard.calculateFilteredMovesForAll();

      let gameCondition = chessBoard.getGameCondition(chessBoard.turn);
      if (gameCondition !== "normal") this.gameOver(gameCondition);
    }

  return (
    <div 
      className={`${cellColor} relative flex items-center justify-center`} 
      onDragOver={handleDragOver} 
      onDrop={handleDrop}>
      { (pieceImageSrc) ? <img 
                              className='block h-[85%] w-[85%]' 
                              src={pieceImageSrc} 
                              draggable={`${ (pieces.whitePieces.includes(piece) && turn === 'white' || 
                                              pieces.blackPieces.includes(piece) && turn === 'black')? 'true':'false'}`} 
                              onDragStart={handleDragStart} /> : null }
      <span className='absolute top-0.5 left-0.5 text-xs font-bold'>{ (col == 0) ? `${8-row}` : '' }</span>
      <span className='absolute bottom-0.5 right-0.5 text-xs font-bold'> { (row == 7) ? String.fromCharCode('a'.charCodeAt(0)+col): ''}</span>

      <div className={`${(promotionSquare && showPromotion) ? '' : 'hidden' } absolute top-0 left-0 -translate-x-1/2 -translate-y-[100%] z-[100] bg-blue-400 border-1 border-white flex flex-row w-[200px]`}>
                                { (row === 0) ? 
                                      <>
                                        <img
                                          className='w-[50px] h-[50px] border-1 border-white hover:bg-blue-500' 
                                          src={pieceSymbolToImage['Q']}
                                          onClick={() => promoteTo('Q')} />
                                        <img
                                          className='w-[50px] h-[50px] border-1 border-white hover:bg-blue-500' 
                                          src={pieceSymbolToImage['R']}
                                          onClick={() => promoteTo('R')} /> 
                                        <img
                                          className='w-[50px] h-[50px] border-1 border-white hover:bg-blue-500' 
                                          src={pieceSymbolToImage['B']}
                                          onClick={() => promoteTo('B')} /> 
                                        <img 
                                          className='w-[50px] h-[50px] border-1 border-white hover:bg-blue-500'
                                          src={pieceSymbolToImage['N']}
                                          onClick={() => promoteTo('N')} /> </>
                                                      : 
                                      <>
                                        <img
                                          className='w-[50px] h-[50px] border-1 border-white hover:bg-blue-500' 
                                          src={pieceSymbolToImage['q']}
                                          onClick={() => promoteTo('q')} />
                                        <img
                                          className='w-[50px] h-[50px] border-1 border-white hover:bg-blue-500' 
                                          src={pieceSymbolToImage['r']}
                                          onClick={() => promoteTo('r')} /> 
                                        <img
                                          className='w-[50px] h-[50px] border-1 border-white hover:bg-blue-500' 
                                          src={pieceSymbolToImage['b']}
                                          onClick={() => promoteTo('b')} /> 
                                        <img
                                          className='w-[50px] h-[50px] border-1 border-white hover:bg-blue-500' 
                                          src={pieceSymbolToImage['n']}
                                          onClick={() => promoteTo('n')} />
                                      </>
                              }
      </div>
    </div>
  )
}

export default Square