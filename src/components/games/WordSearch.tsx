'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useGameState } from '@/hooks/useGameState';

const WORDS = [
  'ACOSTA', 'RATLAMI', 'NIRAV', 'DAD', 'PAPA', 'HERO', 
  'KING', 'LOVE', 'STRONG', 'LEGEND', 'FAMILY', 'HAPPY'
];

const GRID_SIZE = 12;

export const WordSearch = () => {
  const { unlockSection } = useGameState();
  const [grid, setGrid] = useState<string[][]>([]);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [selection, setSelection] = useState<{ start: { r: number, c: number }, end: { r: number, c: number } } | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);

  useEffect(() => {
    generateGrid();
  }, []);

  const generateGrid = () => {
    const newGrid = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(''));
    WORDS.forEach(word => {
      let placed = false;
      while (!placed) {
        const direction = Math.floor(Math.random() * 3);
        const row = Math.floor(Math.random() * GRID_SIZE);
        const col = Math.floor(Math.random() * GRID_SIZE);
        if (canPlace(newGrid, word, row, col, direction)) {
          place(newGrid, word, row, col, direction);
          placed = true;
        }
      }
    });
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        if (newGrid[r][c] === '') {
          newGrid[r][c] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
        }
      }
    }
    setGrid(newGrid);
    setFoundWords([]);
  };

  const canPlace = (grid: string[][], word: string, row: number, col: number, dir: number) => {
    const dr = [0, 1, 1][dir];
    const dc = [1, 0, 1][dir];
    if (row + dr * word.length > GRID_SIZE || col + dc * word.length > GRID_SIZE) return false;
    for (let i = 0; i < word.length; i++) {
      const char = grid[row + dr * i][col + dc * i];
      if (char !== '' && char !== word[i]) return false;
    }
    return true;
  };

  const place = (grid: string[][], word: string, row: number, col: number, dir: number) => {
    const dr = [0, 1, 1][dir];
    const dc = [1, 0, 1][dir];
    for (let i = 0; i < word.length; i++) {
      grid[row + dr * i][col + dc * i] = word[i];
    }
  };

  const getCellFromEvent = (e: React.MouseEvent | React.TouchEvent) => {
    const touch = 'touches' in e ? e.touches[0] : e;
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    const cell = element?.closest('[data-cell]');
    if (cell) {
      const r = parseInt(cell.getAttribute('data-row')!);
      const c = parseInt(cell.getAttribute('data-col')!);
      return { r, c };
    }
    return null;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const cell = getCellFromEvent(e);
    if (cell) {
      setSelection({ start: cell, end: cell });
      setIsSelecting(true);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isSelecting) {
      const cell = getCellFromEvent(e);
      if (cell) setSelection(prev => prev ? { ...prev, end: cell } : null);
    }
  };

  const handleMouseUp = () => {
    if (isSelecting && selection) checkSelection();
    setIsSelecting(false);
    setSelection(null);
  };

  const checkSelection = () => {
    if (!selection) return;
    const { start, end } = selection;
    const dr = Math.sign(end.r - start.r);
    const dc = Math.sign(end.c - start.c);
    if (dr === 0 && dc === 0) return;
    let selectedWord = '';
    let r = start.r;
    let c = start.c;
    const length = Math.max(Math.abs(end.r - start.r), Math.abs(end.c - start.c)) + 1;
    if (dr !== 0 && dc !== 0 && Math.abs(end.r - start.r) !== Math.abs(end.c - start.c)) return;
    for (let i = 0; i < length; i++) {
      selectedWord += grid[r][c];
      r += dr;
      c += dc;
    }
    if (WORDS.includes(selectedWord) && !foundWords.includes(selectedWord)) {
      const newFound = [...foundWords, selectedWord];
      setFoundWords(newFound);
      if (newFound.length === WORDS.length) {
        setTimeout(() => unlockSection('arcade'), 2000);
      }
    } else if (WORDS.includes(selectedWord.split('').reverse().join('')) && !foundWords.includes(selectedWord.split('').reverse().join(''))) {
      const reversed = selectedWord.split('').reverse().join('');
      const newFound = [...foundWords, reversed];
      setFoundWords(newFound);
      if (newFound.length === WORDS.length) {
        setTimeout(() => unlockSection('arcade'), 2000);
      }
    }
  };

  const isCellSelected = (r: number, c: number) => {
    if (!selection) return false;
    const { start, end } = selection;
    const dr = Math.sign(end.r - start.r);
    const dc = Math.sign(end.c - start.c);
    const length = Math.max(Math.abs(end.r - start.r), Math.abs(end.c - start.c)) + 1;
    if (dr !== 0 && dc !== 0 && Math.abs(end.r - start.r) !== Math.abs(end.c - start.c)) return false;
    for (let i = 0; i < length; i++) {
      if (start.r + dr * i === r && start.c + dc * i === c) return true;
    }
    return false;
  };

  return (
    <section className="min-h-screen py-20 flex flex-col items-center justify-center bg-white border-t border-gray-50">
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="text-4xl md:text-5xl font-playfair mb-12 text-center"
      >
        Find what matters.
      </motion.h2>

      <div className="flex flex-col lg:flex-row gap-12 items-start justify-center w-full max-w-5xl px-6">
        <div 
          className="grid grid-cols-12 gap-1 p-2 bg-gray-50 rounded-lg shadow-inner select-none touch-none"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {grid.map((row, r) => row.map((char, c) => (
            <div
              key={`${r}-${c}`}
              data-cell
              data-row={r}
              data-col={c}
              className={cn(
                "w-6 h-6 md:w-9 md:h-9 flex items-center justify-center text-sm md:text-lg font-bold rounded cursor-pointer transition-colors",
                isCellSelected(r, c) ? "bg-accent text-white" : "hover:bg-gray-200"
              )}
            >
              {char}
            </div>
          )))}
        </div>

        <div className="w-full lg:w-64 grid grid-cols-2 lg:grid-cols-1 gap-3">
          {WORDS.map(word => (
            <div key={word} className={cn("flex items-center gap-2 text-lg transition-all", foundWords.includes(word) ? "text-accent line-through opacity-50" : "text-gray-700")}>
              {foundWords.includes(word) && <CheckCircle2 className="w-5 h-5 text-accent" />}
              <span className="font-inter tracking-wide">{word}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
