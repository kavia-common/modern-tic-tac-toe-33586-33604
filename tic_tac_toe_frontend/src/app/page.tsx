"use client";
import { useState } from "react";

const COLORS = {
  accent: "#fbbf24",
  primary: "#2563eb",
  secondary: "#f1f5f9",
};

const initialBoard = Array(9).fill("");

const WIN_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

// PUBLIC_INTERFACE
function getWinner(board: string[]): { winner: string | null; line: number[] | null } {
  /*
   Returns winner "X" or "O" and the line if found, else nulls.
  */
  for (const line of WIN_LINES) {
    const [a, b, c] = line;
    if (
      board[a] &&
      board[a] === board[b] &&
      board[a] === board[c]
    ) {
      return { winner: board[a], line };
    }
  }
  return { winner: null, line: null };
}

// PUBLIC_INTERFACE
function getStatus({
  board,
  isXNext,
  winner,
}: {
  board: string[];
  isXNext: boolean;
  winner: string | null;
}) {
  if (winner) return `Player "${winner}" wins!`;
  if (!board.includes("")) return "It's a draw!";
  return `Current Turn: Player "${isXNext ? "X" : "O"}"`;
}

export default function Home() {
  const [board, setBoard] = useState<string[]>([...initialBoard]);
  const [isXNext, setIsXNext] = useState<boolean>(true);
  const [score, setScore] = useState({ X: 0, O: 0 });
  const [highlight, setHighlight] = useState<number[] | null>(null);
  const { winner } = getWinner(board);

  // Show winner and highlight only at the end
  const status = getStatus({ board, isXNext, winner });

  function handleClick(idx: number) {
    if (board[idx] || winner) return;
    const nextBoard = board.slice();
    nextBoard[idx] = isXNext ? "X" : "O";
    setBoard(nextBoard);

    const result = getWinner(nextBoard);
    if (result.winner) {
      setTimeout(() => {
        setHighlight(result.line);
        setScore((s) => ({ ...s, [result.winner as "X" | "O"]: s[result.winner as "X" | "O"] + 1 }));
      }, 0);
    } else if (!nextBoard.includes("")) {
      setHighlight([]);
    }
    setIsXNext(!isXNext);
  }

  function handleReset() {
    setBoard([...initialBoard]);
    setHighlight(null);
    setIsXNext(true);
  }

  // Responsive style helpers
  function getCellClasses(idx: number) {
    let classes =
      "aspect-square w-16 sm:w-20 md:w-24 text-3xl sm:text-4xl md:text-5xl flex items-center justify-center cursor-pointer select-none border border-[1.5px] border-secondary font-semibold transition-colors duration-150 ease-in-out";
    if (highlight && highlight.includes(idx)) {
      classes += " bg-[#fbbf2433] shadow-inner outline outline-2 outline-accent";
    } else if (board[idx]) {
      classes += " text-primary";
    } else {
      classes += " hover:bg-secondary/80";
    }
    return classes;
  }

  return (
    <div
      className="min-h-screen flex flex-col justify-center items-center bg-white"
      style={{ background: COLORS.secondary }}
    >
      <header className="w-full max-w-md flex flex-col items-center justify-center gap-4 pb-3">
        <h1
          className="text-3xl md:text-4xl font-bold mb-2 tracking-tight text-primary select-none"
          style={{ color: COLORS.primary }}
        >
          Tic Tac Toe
        </h1>
        {/* Scoreboard */}
        <div className="flex flex-row items-center justify-center gap-8 text-base mb-2">
          <div
            className="flex flex-col items-center"
          >
            <span
              className="font-medium text-xl"
              style={{ color: COLORS.primary }}
            >
              X
            </span>
            <span className="font-bold text-accent text-lg" style={{ color: COLORS.accent }}>
              {score.X}
            </span>
          </div>
          <div className="h-8 w-[2px] bg-primary/10 rounded"></div>
          <div
            className="flex flex-col items-center"
          >
            <span
              className="font-medium text-xl"
              style={{ color: COLORS.primary }}
            >
              O
            </span>
            <span className="font-bold text-accent text-lg" style={{ color: COLORS.accent }}>
              {score.O}
            </span>
          </div>
        </div>
        {/* Status */}
        <div
          className={`text-center px-2 py-1 rounded select-none transition-all duration-200
            ${winner ? "bg-accent/10 text-accent font-semibold" : "bg-primary/10 text-primary"}
          `}
          style={
            winner
              ? { background: "#fbbf2420", color: COLORS.accent }
              : { background: "#2563eb22", color: COLORS.primary }
          }
        >
          {status}
        </div>
      </header>

      {/* Main Board */}
      <main
        className="flex flex-col items-center justify-center grow max-w-md w-full"
      >
        <div
          className="grid grid-cols-3 grid-rows-3 gap-2 sm:gap-3 p-2 bg-white rounded-xl shadow-md"
          style={{
            background: "#fff",
            boxShadow: "0 2px 24px #0a203013",
            border: `1.5px solid ${COLORS.secondary}`,
          }}
        >
          {board.map((cell, idx) => (
            <button
              key={idx}
              className={getCellClasses(idx)}
              aria-label={`Cell ${idx + 1}`}
              onClick={() => handleClick(idx)}
              tabIndex={board[idx] || winner ? -1 : 0}
              style={
                highlight && highlight.includes(idx)
                  ? { background: COLORS.accent + "33", outline: `2px solid ${COLORS.accent}` }
                  : board[idx]
                  ? { color: COLORS.primary }
                  : undefined
              }
            >
              {cell}
            </button>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer
        className="w-full flex flex-col items-center justify-center gap-4 py-6 mb-0"
      >
        <button
          onClick={handleReset}
          className="mt-1 px-7 py-2 rounded-full font-semibold bg-accent text-white text-base shadow transition hover:scale-105 hover:bg-[#e09e13] focus:outline-none focus:ring-2 focus:ring-accent/50"
          style={{ background: COLORS.accent }}
        >
          Reset Game
        </button>
        <span className="text-xs text-primary/70 select-none">A simple Tic Tac Toe game</span>
      </footer>
    </div>
  );
}
