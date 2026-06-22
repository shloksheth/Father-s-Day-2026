'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useGameState } from '@/hooks/useGameState';

interface Tile {
  id: number;
  currentPos: number;
  correctPos: number;
}

export const SlidingPuzzle = () => {
  const { unlockSection } = useGameState();
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [moves, setMoves] = useState(0);
  const [isSolved, setIsSolved] = useState(false);
  const [showTrash, setShowTrash] = useState(false);

  const initPuzzle = useCallback(() => {
    let initialTiles: Tile[] = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      currentPos: i,
      correctPos: i,
    }));
    
    let positions = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    let emptyPos = 8;
    
    for (let i = 0; i < 100; i++) {
      const neighbors = getNeighbors(emptyPos);
      const randomNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
      [positions[emptyPos], positions[randomNeighbor]] = [positions[randomNeighbor], positions[emptyPos]];
      emptyPos = randomNeighbor;
    }

    const shuffledTiles = initialTiles.map(tile => ({
      ...tile,
      currentPos: positions.indexOf(tile.id)
    }));

    setTiles(shuffledTiles);
    setMoves(0);
    setIsSolved(false);
  }, []);

  useEffect(() => {
    initPuzzle();
    const timer = setTimeout(() => setShowTrash(true), 5000);
    return () => clearTimeout(timer);
  }, [initPuzzle]);

  function getNeighbors(pos: number) {
    const neighbors = [];
    const row = Math.floor(pos / 3);
    const col = pos % 3;
    if (row > 0) neighbors.push(pos - 3);
    if (row < 2) neighbors.push(pos + 3);
    if (col > 0) neighbors.push(pos - 1);
    if (col < 2) neighbors.push(pos + 1);
    return neighbors;
  }

  const handleTileClick = (clickedTile: Tile) => {
    if (isSolved) return;
    const emptyPos = [0, 1, 2, 3, 4, 5, 6, 7, 8].find(
      pos => !tiles.some(tile => tile.currentPos === pos)
    )!;
    if (getNeighbors(clickedTile.currentPos).includes(emptyPos)) {
      const newTiles = tiles.map(tile => 
        tile.id === clickedTile.id ? { ...tile, currentPos: emptyPos } : tile
      );
      setTiles(newTiles);
      setMoves(moves + 1);
      if (newTiles.every(tile => tile.currentPos === tile.correctPos)) {
        setIsSolved(true);
        setTimeout(() => unlockSection('memory'), 2000);
      }
    }
  };

  return (
    <section className="min-h-screen py-20 flex flex-col items-center justify-center bg-white relative overflow-hidden">
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="text-4xl md:text-5xl font-playfair mb-8 text-center"
      >
        Put it together, Dad.
      </motion.h2>

      <div className="relative w-72 h-72 md:w-96 md:h-96 bg-gray-50 border-4 border-gray-100 shadow-xl p-1">
        {tiles.map((tile) => (
          <motion.div
            key={tile.id}
            layout
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={() => handleTileClick(tile)}
            className="absolute w-[32%] h-[32%] bg-accent flex items-center justify-center cursor-pointer overflow-hidden border border-white/20"
            style={{
              left: `${(tile.currentPos % 3) * 33.33}%`,
              top: `${Math.floor(tile.currentPos / 3) * 33.33}%`,
            }}
          >
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ 
                backgroundImage: 'url(/images/puzzle.jpg)',
                backgroundSize: '300% 300%',
                backgroundPosition: `${(tile.correctPos % 3) * 50}% ${Math.floor(tile.correctPos / 3) * 50}%`
              }}
            />
            {/* Fallback if no image */}
            <div className="absolute inset-0 bg-accent/20 flex items-center justify-center -z-10">
               <span className="text-white/20 font-bold text-4xl">{tile.id + 1}</span>
            </div>
          </motion.div>
        ))}
        {isSolved && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-cover bg-center z-10"
            style={{ backgroundImage: 'url(/images/puzzle.jpg)' }}
          />
        )}
      </div>

      <div className="mt-8 flex flex-col items-center gap-4">
        <p className="text-gray-500 font-inter">Moves: {moves}</p>
        <AnimatePresence>
          {isSolved && (
            <motion.div 
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center gap-2 text-green-600 font-medium"
            >
              <CheckCircle2 className="w-6 h-6" />
              <span>Not bad.</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showTrash && (
          <motion.div
            className="absolute cursor-pointer z-20"
            initial={{ top: -100, left: '70%', rotate: 0 }}
            animate={{ 
              top: '110%', 
              rotate: 360,
              left: ['70%', '75%', '65%', '70%']
            }}
            transition={{ duration: 12, ease: "linear" }}
            onAnimationComplete={() => setShowTrash(false)}
          >
            <div className="relative group">
              <span className="text-4xl">🗑️</span>
              <span className="absolute right-full mr-2 px-2 py-1 bg-black text-white text-[10px] rounded opacity-0 group-hover:opacity-100 whitespace-nowrap">
                Oh. Same as India.
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
