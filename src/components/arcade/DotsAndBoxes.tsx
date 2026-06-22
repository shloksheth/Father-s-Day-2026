'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';

const GRID_SIZE = 6;

export const DotsAndBoxes = ({ onBeat }: { onBeat?: () => void }) => {
  const [horizontalLines, setHorizontalLines] = useState<boolean[][]>(Array(GRID_SIZE + 1).fill(null).map(() => Array(GRID_SIZE).fill(false)));
  const [verticalLines, setVerticalLines] = useState<boolean[][]>(Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE + 1).fill(false)));
  const [boxes, setBoxes] = useState<(number | null)[][]>(Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null)));
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [scores, setScores] = useState({ p1: 0, p2: 0 });

  const handleLineClick = (r: number, c: number, isHorizontal: boolean) => {
    if (isHorizontal ? horizontalLines[r][c] : verticalLines[r][c]) return;
    if (isHorizontal) {
      const newLines = [...horizontalLines]; newLines[r] = [...newLines[r]]; newLines[r][c] = true; setHorizontalLines(newLines);
    } else {
      const newLines = [...verticalLines]; newLines[r] = [...newLines[r]]; newLines[r][c] = true; setVerticalLines(newLines);
    }
    const boxesCompleted = checkBoxes(r, c, isHorizontal);
    if (boxesCompleted.length > 0) {
      const newBoxes = [...boxes]; boxesCompleted.forEach(([br, bc]) => { newBoxes[br] = [...newBoxes[br]]; newBoxes[br][bc] = currentPlayer; });
      setBoxes(newBoxes);
      setScores(s => {
        const next = { ...s, p1: currentPlayer === 1 ? s.p1 + boxesCompleted.length : s.p1, p2: currentPlayer === 2 ? s.p2 + boxesCompleted.length : s.p2 };
        if (next.p1 + next.p2 === GRID_SIZE * GRID_SIZE) {
          if (onBeat) onBeat();
        }
        return next;
      });
    } else setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
  };

  const checkBoxes = (r: number, c: number, isHorizontal: boolean) => {
    const completed = [];
    if (isHorizontal) {
      if (r > 0 && horizontalLines[r-1][c] && verticalLines[r-1][c] && verticalLines[r-1][c+1]) completed.push([r-1, c]);
      if (r < GRID_SIZE && horizontalLines[r+1][c] && verticalLines[r][c] && verticalLines[r][c+1]) completed.push([r, c]);
    } else {
      if (c > 0 && verticalLines[r][c-1] && horizontalLines[r][c-1] && horizontalLines[r+1][c-1]) completed.push([r, c-1]);
      if (c < GRID_SIZE && verticalLines[r][c+1] && horizontalLines[r][c] && horizontalLines[r+1][c]) completed.push([r, c]);
    }
    return completed;
  };

  return (
    <div className="flex flex-col items-center gap-8 p-6">
      <div className="flex justify-center gap-12">
        <div className={cn("p-4 rounded-xl", currentPlayer === 1 ? "bg-accent/10 border-2 border-accent" : "opacity-50")}>
          <p className="text-sm font-bold">PLAYER 1 (NIRAV)</p><p className="text-3xl font-playfair text-accent">{scores.p1}</p>
        </div>
        <div className={cn("p-4 rounded-xl", currentPlayer === 2 ? "bg-slate-100 border-2 border-slate-500" : "opacity-50")}>
          <p className="text-sm font-bold">PLAYER 2 (SHLOK)</p><p className="text-3xl font-playfair text-slate-700">{scores.p2}</p>
        </div>
      </div>
      <div className="relative p-8 bg-white border border-gray-100 shadow-xl rounded-2xl">
        <div className="grid" style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`, width: 'fit-content' }}>
          {boxes.map((row, r) => row.map((box, c) => (
            <div key={`${r}-${c}`} className="relative w-12 h-12 md:w-16 md:h-16">
              <div className="absolute -top-1 -left-1 w-2 h-2 bg-gray-300 rounded-full z-10" />
              {r === GRID_SIZE - 1 && <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-gray-300 rounded-full z-10" />}
              {c === GRID_SIZE - 1 && <div className="absolute -top-1 -right-1 w-2 h-2 bg-gray-300 rounded-full z-10" />}
              {r === GRID_SIZE - 1 && c === GRID_SIZE - 1 && <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-gray-300 rounded-full z-10" />}
              <div className={cn("absolute inset-1 rounded-sm flex items-center justify-center text-2xl font-playfair", box === 1 ? "bg-accent/20 text-accent" : box === 2 ? "bg-slate-200 text-slate-600" : "")}>{box === 1 ? 'N' : box === 2 ? 'S' : ''}</div>
              <div className={cn("absolute top-[-2px] left-1 right-1 h-1 cursor-pointer", horizontalLines[r][c] ? "bg-accent" : "hover:bg-accent/20")} onClick={() => handleLineClick(r, c, true)} />
              {r === GRID_SIZE - 1 && <div className={cn("absolute bottom-[-2px] left-1 right-1 h-1 cursor-pointer", horizontalLines[r+1][c] ? "bg-accent" : "hover:bg-accent/20")} onClick={() => handleLineClick(r+1, c, true)} />}
              <div className={cn("absolute top-1 bottom-1 left-[-2px] w-1 cursor-pointer", verticalLines[r][c] ? "bg-slate-700" : "hover:bg-slate-200")} onClick={() => handleLineClick(r, c, false)} />
              {c === GRID_SIZE - 1 && <div className={cn("absolute top-1 bottom-1 right-[-2px] w-1 cursor-pointer", verticalLines[r][c+1] ? "bg-slate-700" : "hover:bg-slate-200")} onClick={() => handleLineClick(r, c+1, false)} />}
            </div>
          )))}
        </div>
      </div>
    </div>
  );
};
