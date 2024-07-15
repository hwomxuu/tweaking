import React, { useState, useEffect, useCallback } from "react";
import { Rnd } from "react-rnd";

const BOARD_SIZE = 8;
const MINE_COUNT = 8;

const Minesweeper = ({ onClose }) => {
  const createEmptyBoard = () =>
    Array(BOARD_SIZE)
      .fill()
      .map(() =>
        Array(BOARD_SIZE)
          .fill()
          .map(() => ({
            isMine: false,
            isRevealed: false,
            neighborCount: 0,
            isFlagged: false,
          })),
      );

  const [board, setBoard] = useState(createEmptyBoard);
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);
  const [firstClick, setFirstClick] = useState(true);
  const [timer, setTimer] = useState(0);
  const [timerInterval, setTimerInterval] = useState(null);

  const initializeBoard = useCallback((clickedRow, clickedCol) => {
    let newBoard = createEmptyBoard();
    let minesPlaced = 0;

    while (minesPlaced < MINE_COUNT) {
      const row = Math.floor(Math.random() * BOARD_SIZE);
      const col = Math.floor(Math.random() * BOARD_SIZE);

      if (
        !newBoard[row][col].isMine &&
        (row !== clickedRow || col !== clickedCol)
      ) {
        newBoard[row][col].isMine = true;
        minesPlaced++;
      }
    }

    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        if (!newBoard[row][col].isMine) {
          let count = 0;
          for (let r = -1; r <= 1; r++) {
            for (let c = -1; c <= 1; c++) {
              if (
                row + r >= 0 &&
                row + r < BOARD_SIZE &&
                col + c >= 0 &&
                col + c < BOARD_SIZE &&
                newBoard[row + r][col + c].isMine
              ) {
                count++;
              }
            }
          }
          newBoard[row][col].neighborCount = count;
        }
      }
    }

    return newBoard;
  }, []);

  const revealCell = (row, col) => {
    if (
      gameOver ||
      win ||
      board[row][col].isRevealed ||
      board[row][col].isFlagged
    )
      return;

    let newBoard = [...board];
    if (firstClick) {
      newBoard = initializeBoard(row, col);
      setFirstClick(false);
      setTimerInterval(setInterval(() => setTimer((t) => t + 1), 1000));
    }

    newBoard[row][col].isRevealed = true;

    if (newBoard[row][col].isMine) {
      setGameOver(true);
      clearInterval(timerInterval);
      return;
    }

    if (newBoard[row][col].neighborCount === 0) {
      const revealQueue = [{ r: row, c: col }];
      while (revealQueue.length > 0) {
        const { r, c } = revealQueue.shift();
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            const newRow = r + i;
            const newCol = c + j;
            if (
              newRow >= 0 &&
              newRow < BOARD_SIZE &&
              newCol >= 0 &&
              newCol < BOARD_SIZE &&
              !newBoard[newRow][newCol].isRevealed &&
              !newBoard[newRow][newCol].isFlagged
            ) {
              newBoard[newRow][newCol].isRevealed = true;
              if (newBoard[newRow][newCol].neighborCount === 0) {
                revealQueue.push({ r: newRow, c: newCol });
              }
            }
          }
        }
      }
    }

    setBoard(newBoard);

    if (checkWin(newBoard)) {
      setWin(true);
      clearInterval(timerInterval);
    }
  };

  const handleFlag = (event, row, col) => {
    event.preventDefault();
    if (gameOver || win || board[row][col].isRevealed) return;

    let newBoard = [...board];
    newBoard[row][col].isFlagged = !newBoard[row][col].isFlagged;
    setBoard(newBoard);
  };

  const checkWin = (board) => {
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        if (!board[row][col].isMine && !board[row][col].isRevealed) {
          return false;
        }
      }
    }
    return true;
  };

  const resetGame = () => {
    setBoard(createEmptyBoard());
    setGameOver(false);
    setWin(false);
    setFirstClick(true);
    setTimer(0);
    clearInterval(timerInterval);
  };

  useEffect(() => {
    return () => clearInterval(timerInterval);
  }, [timerInterval]);

  return (
    <Rnd
      default={{
        x: 50,
        y: 50,
        width: 240,
        height: 320,
      }}
      minWidth={240}
      minHeight={320}
      maxWidth={300}
      maxHeight={400}
      bounds="parent"
      style={{ zIndex: 9999 }}
    >
      <div className="bg-white p-2 rounded shadow-lg border border-gray-300 w-full h-full">
        <div className="mb-2 flex justify-between items-center">
          <div className="text-sm">Time: {timer}s</div>
          <div>
            <button
              onClick={resetGame}
              className="bg-blue-500 text-white px-2 py-1 rounded text-xs mr-1"
            >
              Reset
            </button>
            <button
              onClick={onClose}
              className="bg-red-500 text-white px-2 py-1 rounded text-xs"
            >
              Close
            </button>
          </div>
        </div>
        <div className="grid grid-cols-8 gap-1">
          {board.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <button
                key={`${rowIndex}-${colIndex}`}
                className={`w-5 h-5 border text-xs ${
                  cell.isRevealed ? "bg-gray-100" : "bg-gray-400"
                } ${cell.isFlagged ? "bg-red-500" : ""}`}
                onClick={() => revealCell(rowIndex, colIndex)}
                onContextMenu={(event) => handleFlag(event, rowIndex, colIndex)}
                disabled={gameOver || win}
              >
                {cell.isRevealed && cell.isMine
                  ? "💣"
                  : cell.isRevealed && cell.neighborCount > 0
                    ? cell.neighborCount
                    : cell.isFlagged
                      ? "🚩"
                      : ""}
              </button>
            )),
          )}
        </div>
        {gameOver && (
          <div className="mt-2 text-red-500 text-sm">Game Over!</div>
        )}
        {win && <div className="mt-2 text-green-500 text-sm">You Win!</div>}
      </div>
    </Rnd>
  );
};

export default Minesweeper;
