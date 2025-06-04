import pieces from "./chessPieceRepresentation";
import { playSound } from "./soundManager";

function isSafe(row, col) {
    if (row < 0 || row >= 8 || col < 0 || col >= 8) 
        return false;
    return true;
}

function complementColor(color) {
    if (color === 'white') return 'black';
    else return 'white';
}

function getPieceColor(gridCells, row, col) {
    if (pieces.whitePieces.includes(gridCells[row][col]))
        return "white";
    else
        return "black";
}

function getMovesAlongRank(chessBoard, gridCells, pieceToMove) {
    let movesAlongRank = [];
    const [startRow, startCol] = pieceToMove.position;

    let r = startRow;
    while (r+1 <= 7 && gridCells[r+1][startCol] === '') {
        movesAlongRank.push(chessBoard.convertPositionToSquareNumber([r+1, startCol]));
        r++;
    } 
    if (r+1 <= 7 && getPieceColor(gridCells, r+1, startCol) !== pieceToMove.color) {
        movesAlongRank.push(chessBoard.convertPositionToSquareNumber([r+1, startCol]));
    }

    r = startRow;
    while (r-1 >= 0 && gridCells[r-1][startCol] === '') {
        movesAlongRank.push(chessBoard.convertPositionToSquareNumber([r-1, startCol]));
        r--;
    }
    if (r-1 >= 0 && getPieceColor(gridCells, r-1, startCol) !== pieceToMove.color) {
        movesAlongRank.push(chessBoard.convertPositionToSquareNumber([r-1, startCol]));
    }

    return movesAlongRank;
}

function getMovesAlongFile(chessBoard, gridCells, pieceToMove) {
    let movesAlongFile = [];
    const [startRow, startCol] = pieceToMove.position;

    let c = startCol;
    while (c-1 >= 0 && gridCells[startRow][c-1] === '') {
        movesAlongFile.push(chessBoard.convertPositionToSquareNumber([startRow, c-1]));
        c--;
    }
    if (c-1 >= 0 && getPieceColor(gridCells, startRow, c-1) !== pieceToMove.color) {
        movesAlongFile.push(chessBoard.convertPositionToSquareNumber([startRow, c-1]));
    }

    c = startCol;
    while (c+1 <= 7 && gridCells[startRow][c+1] === '') {
        movesAlongFile.push(chessBoard.convertPositionToSquareNumber([startRow, c+1]));
        c++;
    }
    if (c+1 <= 7 && getPieceColor(gridCells, startRow, c+1) !== pieceToMove.color) {
        movesAlongFile.push(chessBoard.convertPositionToSquareNumber([startRow, c+1]));
    }

    return movesAlongFile;
}

function getMovesAlongLeftDiagnol(chessBoard, gridCells, pieceToMove) {
    let moves = [];
    const [startRow, startCol] = pieceToMove.position;

    let r = startRow, c = startCol;
    while (r+1 <= 7 && c+1 <= 7 && gridCells[r+1][c+1] === '') {
        moves.push(chessBoard.convertPositionToSquareNumber([r+1, c+1]));
        r++; c++;
    }
    if (r+1 <= 7 && c+1 <= 7 && getPieceColor(gridCells, r+1, c+1) !== pieceToMove.color) {
        moves.push(chessBoard.convertPositionToSquareNumber([r+1, c+1]));
    }

    r = startRow; c = startCol;
    while (r-1 >= 0 && c-1 >= 0 && gridCells[r-1][c-1] === '') {
        moves.push(chessBoard.convertPositionToSquareNumber([r-1, c-1]));
        r--; c--;
    }
    if (r-1 >= 0 && c-1 >= 0 && getPieceColor(gridCells, r-1, c-1) !== pieceToMove.color) {
        moves.push(chessBoard.convertPositionToSquareNumber([r-1, c-1]));
        r--; c--;
    }

    return moves;
}

function getMovesAlongRightDiagnol(chessBoard, gridCells, pieceToMove) {
    let moves = [];
    const [startRow, startCol] = pieceToMove.position;

    let r = startRow, c = startCol;
    while (r-1 >= 0 && c+1 <= 7 && gridCells[r-1][c+1] === '') {
        moves.push(chessBoard.convertPositionToSquareNumber([r-1, c+1]));
        r--; c++;
    }
    if (r-1 >= 0 && c+1 <= 7 && getPieceColor(gridCells, r-1, c+1) !== pieceToMove.color) {
        moves.push(chessBoard.convertPositionToSquareNumber([r-1, c+1]));
    }

    r = startRow; c = startCol;
    while (r+1 <= 7 && c-1 >= 0 && gridCells[r+1][c-1] === '') {
        moves.push(chessBoard.convertPositionToSquareNumber([r+1, c-1]));
        r++; c--;
    }
    if (r+1 <= 7 && c-1 >= 0 && getPieceColor(gridCells, r+1, c-1) !== pieceToMove.color) {
        moves.push(chessBoard.convertPositionToSquareNumber([r+1, c-1]));
    }

    return moves;
}

function isMoveLegal(chessBoard, pieceToMove, newSquare) {
    // if (pieceToMove.symbolRepresentation === 'k') console.log(pieceToMove);
    let actualPosition = [...pieceToMove.position];

    pieceToMove.position = chessBoard.convertSquareNumberToPosition(newSquare);

    const [ king ] = chessBoard.piecesOnBoard.filter( (piece) => (piece.symbolRepresentation === 'k' 
                                                                || piece.symbolRepresentation === 'K')
                                                            && (piece.color === pieceToMove.color) );
    let kingSquare = chessBoard.convertPositionToSquareNumber(king.position);

    // console.log(king);

    const enemyPieces = chessBoard.piecesOnBoard.filter( (piece) => piece.color !== pieceToMove.color );
    
    // console.log(enemyPieces);

    let enemyMoves = [];
    for (let i = 0; i < enemyPieces.length; i++) {
        if (chessBoard.convertPositionToSquareNumber(enemyPieces[i].position) === newSquare) {
            // console.log(enemyPieces[i]);
            continue;
        } //! this simulates capturing the piece in this move

        if (enemyPieces[i].symbolRepresentation === 'p' || enemyPieces[i].symbolRepresentation === 'P') {
            enemyPieces[i].calculateAvailableMoves(chessBoard).forEach((move) => enemyMoves.push(move[0]));
        } else {
            enemyPieces[i].calculateAvailableMoves(chessBoard).forEach((move) => enemyMoves.push(move));
        }
    }

    // console.log(enemyMoves);
    pieceToMove.position = actualPosition;

    for (let i = 0; i < enemyMoves.length; i++) {
        if (enemyMoves[i] === kingSquare) return false;
    }

    return true;
}

function getEnemyVision(chessBoard, enemyColor) {
    const enemyVision = [];

    const enemyPieces = chessBoard.piecesOnBoard.filter( (piece) => piece.color === enemyColor );
    for (let i = 0; i < enemyPieces.length; i++) {
        const enemyPiece = enemyPieces[i];

        if (enemyPiece.symbolRepresentation.toUpperCase() === 'P') {
            enemyPiece.calculateAvailableMoves(chessBoard).forEach( (move) => enemyVision.push(move[0]) );
        } else {
            enemyPiece.calculateAvailableMoves(chessBoard).forEach( (move) => enemyVision.push(move) );
        }
    }

    return enemyVision;
}

class Piece {
    constructor(color, position, availableMoves) {
        this.color = color;
        this.position = position;
        this.availableMoves = availableMoves;

        this.pieceId = 8 * this.position[0] + this.position[1];  // needed later, to render list of captured pieces
    }

    calculateFilteredMoves(chessBoard) {
        const filteredMoves = [];
        let availableMoves = this.calculateAvailableMoves(chessBoard);
        for (let i = 0; i < availableMoves.length; i++) {
            if (isMoveLegal(chessBoard, this, availableMoves[i])) {
                filteredMoves.push(availableMoves[i]);
            }
        }
        
        return filteredMoves;
    }

    makeMove(chessBoard, toSquare) {
        if (!this.availableMoves.includes(toSquare)) return false;

        chessBoard.capturePieceIfPossible(toSquare);
        this.position = chessBoard.convertSquareNumberToPosition(toSquare);

        return true;
    }

    calculateAvailableMoves(chessBoard) {}
}

class Pawn extends Piece {
    constructor(color, position, availableMoves=[]) {
        super(color, position, availableMoves);

        this.symbolRepresentation = (this.color == 'white') ? 'P' : 'p';
        
        this.firstMove = true;
        this.enPassantable = false;
    }

    calculateFilteredMoves(chessBoard) {
        const filteredMoves = [];
        let availableMoves = this.calculateAvailableMoves(chessBoard);

        for (let i = 0; i < availableMoves.length; i++) {
            if (isMoveLegal(chessBoard, this, availableMoves[i][0])) {
                filteredMoves.push(availableMoves[i]);
            }
        }
        
        return filteredMoves;
    }

    makeMove(chessBoard, toSquare) {
        const [ matchingMove ] = this.availableMoves.filter( (move) => move[0] === toSquare );

        if (!matchingMove) return false;

        let [toRow, toCol] = chessBoard.convertSquareNumberToPosition(toSquare);

        // making enpassantable
        if (matchingMove[1] === "double") {
            this.enPassantable = true;
        }

        // doing captures
        if (matchingMove[1] === "capture-left" || matchingMove[1] === "capture-right") {
            chessBoard.capturePieceIfPossible(toSquare);
        } else if (matchingMove[1] === "enpassant-left" || matchingMove[1] === "enpassant-right") {
            if (this.color === "white") {
                chessBoard.capturePieceIfPossible(chessBoard.convertPositionToSquareNumber([toRow+1, toCol]));
            } else {
                chessBoard.capturePieceIfPossible(chessBoard.convertPositionToSquareNumber([toRow-1, toCol]));
            }
        }

        this.firstMove = false;
        this.position = [toRow, toCol];

        return true;
    }

    calculateAvailableMovesForBlack(chessBoard) {
        let gridCells = chessBoard.getReducedGridRepresentation();

        const [row, col] = this.position;
        let availableMoves = [];

        // single
        if (isSafe(row+1, col) && gridCells[row+1][col] === '') {
            availableMoves.push([chessBoard.convertPositionToSquareNumber([row+1, col]), "single"]);
        }

        // double
        if (this.firstMove && gridCells[row+1][col] === '' && gridCells[row+2][col] === '') {
            availableMoves.push([chessBoard.convertPositionToSquareNumber([row+2, col]), "double"]);
        }

        // enpassant right
        if (isSafe(row+1, col+1) && gridCells[row][col+1] === 'P') {
            let enemyPawn = chessBoard.findMatchingPiece(chessBoard.convertPositionToSquareNumber([row, col+1]));
            if (enemyPawn.enPassantable) {
                availableMoves.push([chessBoard.convertPositionToSquareNumber([row+1, col+1]), "enpassant-right"]);
            } 
        }
        
        // enpassant left
        if (isSafe(row+1, col-1) && gridCells[row][col-1] === 'P') {
            let enemyPawn = chessBoard.findMatchingPiece(chessBoard.convertPositionToSquareNumber([row, col-1]));
            if (enemyPawn.enPassantable) {
                availableMoves.push([chessBoard.convertPositionToSquareNumber([row+1, col-1]), "enpassant-left"]);
            }
        }

        // diagnol capture left
        if (isSafe(row+1, col-1) && pieces.whitePieces.includes(gridCells[row+1][col-1])) {
            availableMoves.push([chessBoard.convertPositionToSquareNumber([row+1, col-1]), "capture-left"]);
        }

        // diagnol capture right
        if (isSafe(row+1, col+1) && pieces.whitePieces.includes(gridCells[row+1][col+1])) {
            availableMoves.push([chessBoard.convertPositionToSquareNumber([row+1, col+1]), "capture-right"]);
        }

        return availableMoves;
    }
    
    calculateAvailableMovesForWhite(chessBoard) {
        let gridCells = chessBoard.getReducedGridRepresentation();

        const row = this.position[0];
        const col = this.position[1];

        let availableMoves = [];

        // single
        if (isSafe(row-1, col) && gridCells[row-1][col] === '') {
            availableMoves.push([chessBoard.convertPositionToSquareNumber([row-1, col]), "single"]);
        }

        // double
        if (this.firstMove === true && gridCells[row-1][col] === '' && gridCells[row-2][col] === '') {
            availableMoves.push([chessBoard.convertPositionToSquareNumber([row-2, col]), "double"]);
        }

        // en passant right
        if (isSafe(row-1, col+1) && gridCells[row][col+1] === 'p') {
            let enemyPawn = chessBoard.findMatchingPiece(chessBoard.convertPositionToSquareNumber([row, col+1]));
            if (enemyPawn.enPassantable) {
                availableMoves.push([chessBoard.convertPositionToSquareNumber([row-1, col+1]), "enpassant-right"]);
            } 
        } 

        // en passsant left
        if (isSafe(row-1, col-1) && gridCells[row][col-1] === 'p') {
            let enemyPawn = chessBoard.findMatchingPiece(chessBoard.convertPositionToSquareNumber([row, col-1]));
            if (enemyPawn.enPassantable) {
                availableMoves.push([chessBoard.convertPositionToSquareNumber([row-1, col-1]), "enpassant-left"]);
            }
        }

        // diagnol capture left
        if (isSafe(row-1, col-1) && pieces.blackPieces.includes(gridCells[row-1][col-1])) {
            availableMoves.push([chessBoard.convertPositionToSquareNumber([row-1, col-1]), "capture-left"]);
        }

        // diagnol capture right
        if (isSafe(row-1, col+1) && pieces.blackPieces.includes(gridCells[row-1][col+1])) {
            availableMoves.push([chessBoard.convertPositionToSquareNumber([row-1, col+1]), "capture-right"]);
        }

        return availableMoves;
    }

    calculateAvailableMoves(chessBoard) {
        if (this.color === 'white') return this.calculateAvailableMovesForWhite(chessBoard);
        else return this.calculateAvailableMovesForBlack(chessBoard);
    }
}

class King extends Piece {
    constructor(color, position, availableMoves=[]) {
        super(color, position, availableMoves);

        this.symbolRepresentation = (this.color == 'white') ? 'K' : 'k';
        this.inCheck = false;
        this.hasMoved = false;
    }

    makeMove(chessBoard, toSquare) {
        if (!this.availableMoves.includes(toSquare)) return false;

        const squareNo = chessBoard.convertPositionToSquareNumber(this.position);

        if (Math.abs(toSquare - squareNo) === 2) {
            //* castling
            const [kingRook, queenRook] = this.getRooks(chessBoard);
            if (this.color === 'white') {
                if (toSquare === 58) {
                    // queenside
                    this.position = chessBoard.convertSquareNumberToPosition(58);
                    queenRook.position = chessBoard.convertSquareNumberToPosition(59);
                } else if (toSquare === 62) {
                    // kingside
                    this.position = chessBoard.convertSquareNumberToPosition(62);
                    kingRook.position = chessBoard.convertSquareNumberToPosition(61);
                }
            } else {
                if (toSquare === 2) {
                    // queenside
                    this.position = chessBoard.convertSquareNumberToPosition(2);
                    queenRook.position = chessBoard.convertSquareNumberToPosition(3);
                } else if (toSquare === 6) {
                    this.position = chessBoard.convertSquareNumberToPosition(6);
                    kingRook.position = chessBoard.convertSquareNumberToPosition(5);
                }
            }

            chessBoard.soundToPlay = 'castle'; // setting what sound to play
        } else {
            // not castling
            chessBoard.capturePieceIfPossible(toSquare);
            this.position = chessBoard.convertSquareNumberToPosition(toSquare);
        }

        this.hasMoved = true;
        return true;
    }

    checkIfKingInCheck(chessBoard) {
        const king = this;

        const enemyVision = getEnemyVision(chessBoard, complementColor(this.color));

        if (enemyVision.includes(chessBoard.convertPositionToSquareNumber(king.position))) return king.inCheck = true;
        else return king.inCheck = false;
    }

    calculateFilteredMoves(chessBoard) {
        const filteredMoves = [...this.calculateCastlingMoves(chessBoard)];
        let availableMoves = this.calculateAvailableMoves(chessBoard);
        for (let i = 0; i < availableMoves.length; i++) {
            if (isMoveLegal(chessBoard, this, availableMoves[i])) {
                filteredMoves.push(availableMoves[i]);
            }
        }
        
        // if (this.symbolRepresentation === 'k') console.log("filered moves: ", filteredMoves);
        return filteredMoves;
    }

    getRooks(chessBoard) {
        let kingRook = null, queenRook = null;
        if (this.color === 'white') {
            queenRook  = 
            chessBoard.piecesOnBoard.find( (piece) => piece.symbolRepresentation === 'R'
                                                    && chessBoard.convertPositionToSquareNumber(piece.position) === 56 );
            
            kingRook  = 
            chessBoard.piecesOnBoard.find( (piece) => piece.symbolRepresentation === 'R' 
                                                    && chessBoard.convertPositionToSquareNumber(piece.position) === 63 );
        } else {
            queenRook  = 
            chessBoard.piecesOnBoard.find( (piece) => piece.symbolRepresentation === 'r'
                                                    && chessBoard.convertPositionToSquareNumber(piece.position) === 0 );
            
            kingRook  = 
            chessBoard.piecesOnBoard.find( (piece) => piece.symbolRepresentation === 'r' 
                                                    && chessBoard.convertPositionToSquareNumber(piece.position) === 7 );
        }

        return [ kingRook, queenRook ];
    }

    calculateCastlingMoves(chessBoard) {
        let availableMoves = [];
        const gridCells = chessBoard.getReducedGridRepresentation();
        const [row, col] = this.position;

        if (!this.hasMoved && !this.checkIfKingInCheck(chessBoard)) {
            const [kingRook, queenRook] = this.getRooks(chessBoard);

            const enemyVision = getEnemyVision(chessBoard, complementColor(this.color));
            

            if (kingRook && !kingRook.hasMoved
                && gridCells[row][col+1] === '' 
                && gridCells[row][col+2] === ''
                && !enemyVision.includes(chessBoard.convertPositionToSquareNumber([row, col+1]))
                && !enemyVision.includes(chessBoard.convertPositionToSquareNumber([row, col+2])) ) {
                    availableMoves.push(chessBoard.convertPositionToSquareNumber([row, col+2]));
            }

            if (queenRook && !queenRook.hasMoved
                && gridCells[row][col-1] === '' 
                && gridCells[row][col-2] === '' 
                && gridCells[row][col-3] === ''
                && !enemyVision.includes(chessBoard.convertPositionToSquareNumber([row, col-1]))
                && !enemyVision.includes(chessBoard.convertPositionToSquareNumber([row, col-2]))
                && !enemyVision.includes(chessBoard.convertPositionToSquareNumber([row, col-3])) ) {
                    availableMoves.push(chessBoard.convertPositionToSquareNumber([row, col-2]));
            }
        }

        return availableMoves;
    }

    calculateAvailableMoves(chessBoard) {
        let gridCells = chessBoard.getReducedGridRepresentation();
        let availableMoves = [];

        const [row, col] = this.position;
        const moves = [ [0, -1], [0, 1], [1, 0], [-1, 0], [1, 1], [-1, -1], [1, -1], [-1, 1] ];

        // regular moves
        for (let i = 0; i < moves.length; i++) {
            const [dx, dy] = moves[i];
            if (isSafe(row+dx, col+dy) && 
                (gridCells[row+dx][col+dy] === '' || getPieceColor(gridCells, row+dx, col+dy) !==  this.color)) {
                availableMoves.push(chessBoard.convertPositionToSquareNumber([row+dx, col+dy]));
            }
        }

        //! if (this.symbolRepresentation === 'k') console.log("unfiltered moves: ", availableMoves);
        return availableMoves;
    }
}

class Queen extends Piece {
    constructor(color, position, availableMoves=[]) {
        super(color, position, availableMoves);

        this.symbolRepresentation = (this.color == 'white') ? 'Q' : 'q';
    }

    calculateAvailableMoves(chessBoard) {
        const gridCells = chessBoard.getReducedGridRepresentation();

        const leftDiagnol = getMovesAlongLeftDiagnol(chessBoard, gridCells, this);
        const rightDiagnol = getMovesAlongRightDiagnol(chessBoard, gridCells, this);
        const rank = getMovesAlongRank(chessBoard, gridCells, this);
        const file = getMovesAlongFile(chessBoard, gridCells, this);

        let availableMoves = [ ...leftDiagnol, ...rightDiagnol, ...rank, ...file ];
        
        return availableMoves;
    }
}

class Rook extends Piece {
    constructor(color, position, availableMoves=[]) {
        super(color, position, availableMoves);

        this.symbolRepresentation = (this.color == 'white') ? 'R' : 'r';
        this.hasMoved = false;
    }

    makeMove(chessBoard, toSquare) {
        if (!this.availableMoves.includes(toSquare)) return false;

        chessBoard.capturePieceIfPossible(toSquare);
        this.position = chessBoard.convertSquareNumberToPosition(toSquare);

        this.hasMoved = true;
        return true;
    }

    calculateAvailableMoves(chessBoard) {
        const gridCells = chessBoard.getReducedGridRepresentation();

        const movesAlongFile = getMovesAlongFile(chessBoard, gridCells, this);
        const movesAlongRank = getMovesAlongRank(chessBoard, gridCells, this);

        let availableMoves = [...movesAlongFile, ...movesAlongRank];

        return availableMoves;
    }
}

class Knight extends Piece {
    constructor(color, position, availableMoves=[]) {
        super(color, position, availableMoves);

        this.symbolRepresentation = (this.color == 'white') ? 'N' : 'n';
    }

    calculateAvailableMoves(chessBoard) {
        const [row, col] = this.position;

        let availableMoves = [];
        const gridCells = chessBoard.getReducedGridRepresentation();

        const moves = [ [2, 1], [2, -1], [-2, 1], [-2, -1], [1, 2], [-1, 2], [1, -2], [-1, -2] ];

        for (let i = 0; i < moves.length; i++) {
            const [dx, dy] = moves[i];

            if (isSafe(row+dx, col+dy) && (gridCells[row+dx][col+dy] === '' 
                                                || this.color !== getPieceColor(gridCells, row+dx, col+dy))) {
                    availableMoves.push(chessBoard.convertPositionToSquareNumber([row+dx, col+dy]));
            }
        }

        return availableMoves;
    }
}

class Bishop extends Piece {
    constructor(color, position, availableMoves=[]) {
        super(color, position, availableMoves);

        this.symbolRepresentation = (this.color == 'white') ? 'B' : 'b';
    }

    calculateAvailableMoves(chessBoard) {
        const gridCells = chessBoard.getReducedGridRepresentation();

        const leftDiagnol = getMovesAlongLeftDiagnol(chessBoard, gridCells, this);
        const rightDiagnol = getMovesAlongRightDiagnol(chessBoard, gridCells, this);

        let availableMoves = [...leftDiagnol, ...rightDiagnol];

        return availableMoves;
    }
}

export class ChessBoard {
  constructor(piecesOnBoard, piecesOffBoard = []) {
    if (piecesOnBoard) {
      this.piecesOnBoard = piecesOnBoard;
    } else {
      this.piecesOnBoard = this.setDefaultPiecesOnBoard();
      //! this.calculateAllAvailableMoves();
      this.calculateFilteredMovesForAll();
    }

    this.piecesOffBoard = piecesOffBoard;

    this.setGridCells = null;
    this.setTurn = null;
    this.turn = null;

    this.setGameOver = null;
    this.setGameOverMessage = null;

    this.timers = {};
    this.squares = {};

    this.soundToPlay = 'move';
  }

  // setting up
  setGridCellsSetter(setGridCells) {
    this.setGridCells = setGridCells;
  }

  setGameOverSetter(setShowMessage) {
    this.setGameOver = setShowMessage;
  }

  setGameOverMessageSetter(setGameOverMessage) {
    this.setGameOverMessage = setGameOverMessage;
  }

  setTurnVariable(turn) {
    this.turn = turn;
  }

  setTurnSetter(setTurn) {
    this.setTurn = setTurn;
  }

  setDefaultPiecesOnBoard() {
    let piecesOnBoard = [];
    for (let i = 0; i < 8; i++) {
      piecesOnBoard.push(new Pawn("white", [6, i]));
      piecesOnBoard.push(new Pawn("black", [1, i]));
    }

    for (let i = 0; i < 2; i++) {
      piecesOnBoard.push(new Bishop("white", [7, 3 * (i + 1) - 1]));
      piecesOnBoard.push(new Bishop("black", [0, 3 * (i + 1) - 1]));

      piecesOnBoard.push(new Rook("white", [7, 7 * i]));
      piecesOnBoard.push(new Rook("black", [0, 7 * i]));

      piecesOnBoard.push(new Knight("white", [7, 5 * i + 1]));
      piecesOnBoard.push(new Knight("black", [0, 5 * i + 1]));
    }

    piecesOnBoard.push(new Queen("white", [7, 3]));
    piecesOnBoard.push(new Queen("black", [0, 3]));

    piecesOnBoard.push(new King("white", [7, 4]));
    piecesOnBoard.push(new King("black", [0, 4]));

    return piecesOnBoard;
  }

  setTimers(whiteTimer, blackTimer) {
    this.timers = {
      white: whiteTimer,
      black: blackTimer,
    };
  }

  setSquare(squareNo, { promotionSquare, setShowPromotion }) {
    this.squares[squareNo] = {
      promotionSquare,
      setShowPromotion,
    };

    // console.log(this.squares);
  }

  getReducedGridRepresentation() {
    let grid = [];
    for (let i = 0; i < 8; i++) {
      let gridRow = ["", "", "", "", "", "", "", ""];
      grid.push(gridRow);
    }

    this.piecesOnBoard.forEach((piece) => {
      let row = piece.position[0];
      let col = piece.position[1];
      grid[row][col] = piece.symbolRepresentation;
    });

    return grid;
  }

  // making moves
  checkCheck(color) {
    const king = this.piecesOnBoard.find(
      (piece) =>
        piece.color === color && piece.symbolRepresentation.toUpperCase() === "K"
    );

    return king.checkIfKingInCheck(this);
  }

  calculateAllAvailableMoves() {
    for (let i = 0; i < this.piecesOnBoard.length; i++) {
      const piece = this.piecesOnBoard[i];
      piece.availableMoves = piece.calculateAvailableMoves(this);
    }
  }

  calculateFilteredMovesForAll() {
    for (let i = 0; i < this.piecesOnBoard.length; i++) {
      const piece = this.piecesOnBoard[i];
      piece.availableMoves = piece.calculateFilteredMoves(this);
    }
  }

  convertPositionToSquareNumber(position) {
    return 8 * position[0] + position[1];
  }

  convertSquareNumberToPosition(squareNumber) {
    return [Math.floor(squareNumber / 8), Math.floor(squareNumber % 8)];
  }

  rotateTurn() {
    this.setTurn((prevTurn) => {
      if (prevTurn === "white") {
        this.timers.white.pauseTimer();
        this.timers.black.playTimer();

        return (this.turn = "black");
      } else {
        this.timers.black.pauseTimer();
        this.timers.white.playTimer();

        return (this.turn = "white");
      }
    });
  }

  updateBoard() {
    this.rotateTurn();

    const newGrid = this.getReducedGridRepresentation();
    this.setGridCells(newGrid);
  }

  findMatchingPiece(squareNo) {
    let [fromRow, fromCol] = this.convertSquareNumberToPosition(squareNo);
    let [matchingPiece] = this.piecesOnBoard.filter(
      (piece) => piece.position[0] === fromRow && piece.position[1] === fromCol
    );

    return matchingPiece;
  }

  capturePieceIfPossible(toSquare) {
    let capturedPiece = this.findMatchingPiece(toSquare);
    if (capturedPiece) {
      this.piecesOnBoard = this.piecesOnBoard.filter(
        (piece) => piece.position !== capturedPiece.position
      );
      this.piecesOffBoard.push(capturedPiece);

      // if a piece is captured then this sound should be played...
      this.soundToPlay = 'capture';
    }
  }

  dealWithEnPassant() {
    // console.log(this.turn);
    if (this.turn === "white") {
      this.piecesOnBoard.forEach((piece) => {
        if (piece.symbolRepresentation === "P") piece.enPassantable = false;
      });
    } else {
      this.piecesOnBoard.forEach((piece) => {
        if (piece.symbolRepresentation === "p") piece.enPassantable = false;
      });
    }
  }

  makePromotion(promotionSquareNo, symbolRepresentation) {
    const promotionSquarePosition =
      this.convertSquareNumberToPosition(promotionSquareNo);

    // remove the pawn
    this.piecesOnBoard = this.piecesOnBoard.filter((piece) => !(piece.symbolRepresentation.toUpperCase() === 'P' 
                                                                    && piece.position[0] === promotionSquarePosition[0] 
                                                                    && piece.position[1] === promotionSquarePosition[1]));

    // add the new piece
    let newPiece;
    if (symbolRepresentation === "Q") {
        newPiece = new Queen('white', promotionSquarePosition);
        newPiece.calculateFilteredMoves(this);
        this.piecesOnBoard.push(newPiece);
    } else if (symbolRepresentation === "R") {
        newPiece = new Rook('white', promotionSquarePosition)
        newPiece.calculateFilteredMoves(this);
        this.piecesOnBoard.push(newPiece);
    } else if (symbolRepresentation === "N") {
        newPiece = new Knight('white', promotionSquarePosition)
        newPiece.calculateFilteredMoves(this);
        this.piecesOnBoard.push(newPiece);
    } else if (symbolRepresentation === "B") {
        newPiece = new Bishop('white', promotionSquarePosition)
        newPiece.calculateFilteredMoves(this);
        this.piecesOnBoard.push(newPiece);
    } else if (symbolRepresentation === "q") {
        newPiece = new Queen('black', promotionSquarePosition)
        newPiece.calculateFilteredMoves(this);
        this.piecesOnBoard.push(newPiece);
    } else if (symbolRepresentation === "r") {
        newPiece = new Rook('black', promotionSquarePosition)
        newPiece.calculateFilteredMoves(this);
        this.piecesOnBoard.push(newPiece);
    } else if (symbolRepresentation === "n") {
        newPiece = new Knight('black', promotionSquarePosition)
        newPiece.calculateFilteredMoves(this);
        this.piecesOnBoard.push(newPiece);
    } else if (symbolRepresentation === "b") {
        newPiece = new Bishop('black', promotionSquarePosition)
        newPiece.calculateFilteredMoves(this);
        this.piecesOnBoard.push(newPiece);
    }
  }

  dealWithPawnPromotions(pieceToMove) {
    if (pieceToMove.symbolRepresentation.toUpperCase() === "P") {
      if (pieceToMove.color === "white" && pieceToMove.position[0] === 0) {
    
        const promotionSquareNo = this.convertPositionToSquareNumber(pieceToMove.position);
        this.squares[promotionSquareNo].setShowPromotion(true);

        return true;
      } else if ( pieceToMove.color === "black" && pieceToMove.position[0] === 7) {
        
        const promotionSquareNo = this.convertPositionToSquareNumber(pieceToMove.position);
        this.squares[promotionSquareNo].setShowPromotion(true);

        return true;
      }
    }

    return false;
  }

  //* game over
  timeOut(color) {
    this.gameOver(`timeout-${color}`);
  }

  gameOver(gameCondition) {
    if (gameCondition === "checkmate") {
      this.setGameOver(true);
      this.setGameOverMessage(
        `${complementColor(this.turn).toUpperCase()} WINS by Checkmate`
      );
    } else if (gameCondition === "stalemate") {
      this.setGameOver(true);
      this.setGameOverMessage("DRAW by Stalemate");
    } else if (gameCondition === "insufficient") {
      this.setGameOver(true);
      this.setGameOverMessage("DRAW by Insufficient Material");
    } else if (gameCondition.includes("timeout")) {
      const lostColor = gameCondition.split("-")[1];
      this.setGameOver(true);
      this.setGameOverMessage(
        `${complementColor(lostColor).toUpperCase()} WINS by Timeout`
      );
    }

    this.timers.white.pauseTimer();
    this.timers.black.pauseTimer();
  }

  insufficientMaterial(color) {
    const pieces = this.piecesOnBoard.filter((piece) => piece.color === color);
    if (pieces.length === 1) {
      return true;
    } else if (pieces.length == 2) {
      let otherPiece;
      if (pieces[0].symbolRepresentation.toUpperCase() === "K") {
        otherPiece = pieces[1];
      } else {
        otherPiece = pieces[0];
      }

      if (
        otherPiece.symbolRepresentation.toUpperCase() === "N" ||
        otherPiece.symbolRepresentation.toUpperCase() === "B"
      ) {
        return true;
      }
    }

    return false;
  }

  getGameCondition(color) {
    const [king] = this.piecesOnBoard.filter(
      (piece) =>
        piece.symbolRepresentation.toUpperCase() === "K" &&
        piece.color === color
    );

    let availableMovesForColor = 0;
    for (
      let i = 0;
      i < this.piecesOnBoard.length && availableMovesForColor === 0;
      i++
    ) {
      if (this.piecesOnBoard[i].color === color) {
        availableMovesForColor += this.piecesOnBoard[i].availableMoves.length;
      }
    }

    if (king.checkIfKingInCheck(this) && availableMovesForColor === 0) {
      return "checkmate";
    } else if (availableMovesForColor === 0) {
      return "stalemate";
    } else if (
      this.insufficientMaterial("white") &&
      this.insufficientMaterial("black")
    ) {
      return "insufficient";
    } else {
      return "normal";
    }
  }

  makeMove({ fromSquare, toSquare, pieceSymbol }) {
    if (fromSquare === toSquare) return;

    // sound setup
    this.soundToPlay = 'move';

    // en-passant setup
    this.dealWithEnPassant();
    let pieceToMove = this.findMatchingPiece(fromSquare);
    

    if (pieceToMove.makeMove(this, toSquare)) {
        if (this.dealWithPawnPromotions(pieceToMove)) { return; } // the flow continues in promoteTo() in Square.jsx
        
        this.updateBoard();
        this.calculateFilteredMovesForAll();

        if (this.checkCheck(this.turn)) {   this.soundToPlay = 'check';     }

        let gameCondition = this.getGameCondition(this.turn);
        if (gameCondition !== "normal") {
            playSound('gameover');
            this.gameOver(gameCondition);
        } else {
            playSound(this.soundToPlay);
        }
    }
  }
}

//! filtering out illegal moves

// TODO: pawn promotions --> done + square highlights 
// TODO: test chess
// TODO: AI

/**
 * * Newest Design Change -> we don't separately calculate the available moves for all and then calculate the filtered moves for all. WE now use this.calculateAvailableMoves() within the calculateFilteredMoves() to directly calculate the filtered moves
 *  
 * */ 