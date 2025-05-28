import React, { useRef, useState, useEffect, useMemo } from 'react'
import pieceSymbolToImage from '../utils/pieceImage';
import { piecePoints } from '../utils/piecePoints';

function MyTimer({
    myTimerRef,
    timerDuration,
    color,
    chessBoard
}) {
    const [timeLeft, setTimeLeft] = useState(timerDuration);
    const intervalRef = useRef();

    const playTimer = () => {
        if (!intervalRef.current) {
            intervalRef.current = setInterval(() => {
                setTimeLeft( (prevTime) => Math.max(prevTime - 1, 0));
            }, 1000);
        }
    }

    const pauseTimer = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }

    useEffect(() => {
        if (timeLeft === 0) {
            pauseTimer();
            chessBoard.timeOut(color);
        }
    }, [timeLeft])

    useEffect(() => {
        myTimerRef.current = {
            playTimer, 
            pauseTimer
        }
    }, [myTimerRef]);

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    
    const newCapturedPieces = useMemo(() => {
        return chessBoard.piecesOffBoard
          .filter(piece => piece.color !== color)
          .sort((a, b) => piecePoints[a.symbolRepresentation] - piecePoints[b.symbolRepresentation])
          .map((piece, index) => (
            <img
              key={piece.pieceId + piece.symbolRepresentation}
              src={pieceSymbolToImage[piece.symbolRepresentation]}
              className={`inline-block h-8 -ml-[10px] first:ml-[0] z-[${index}]`}
            />
          ));
    }, [chessBoard.piecesOffBoard.length, color]);

    const pointsDifference = useMemo(() => {
        let whitePoints = 0;
        let blackPoints = 0;

        chessBoard.piecesOffBoard.forEach((piece) => {
            if (piece.color === 'black') whitePoints += piecePoints[piece.symbolRepresentation];
            else blackPoints += piecePoints[piece.symbolRepresentation];
        });

        return (color === 'white') ? whitePoints-blackPoints : blackPoints-whitePoints;
    }, [chessBoard.piecesOffBoard.length, color]);
    
    
  return (
    <div className='bg-gray-700 text-white flex flex-row gap-2'>
        <div className='bg-gray-950 p-3'>
            { `${(minutes < 10) ? '0': ''}${minutes}` } : { `${(seconds < 10) ? '0': ''}${seconds}` }
        </div>
        <div className='flex flex-row items-center'>
            { newCapturedPieces }
            { (pointsDifference > 0) ? '+' + pointsDifference: '' }
        </div>
    </div>
  )
}

export default MyTimer