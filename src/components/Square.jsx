import React from 'react'
import pieces from '../utils/chessPieceRepresentation';

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
    </div>
  )
}

export default Square