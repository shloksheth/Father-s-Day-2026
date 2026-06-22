'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useGameState } from '@/hooks/useGameState';

interface Card {
  id: number;
  content: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const ICONS = ['❤️', '⭐', '🎁', '🎈', '🎉', '🍦', '🚗', '🚀'];

export const MemoryMatch = () => {
  const { unlockSection } = useGameState();
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isActive, setIsActive] = useState(false);

  const initGame = useCallback(() => {
    const duplicatedIcons = [...ICONS, ...ICONS];
    const shuffledIcons = duplicatedIcons.sort(() => Math.random() - 0.5);
    const initialCards = shuffledIcons.map((icon, index) => ({
      id: index,
      content: icon,
      isFlipped: false,
      isMatched: false,
    }));
    setCards(initialCards);
    setFlippedIndices([]);
    setMoves(0);
    setMatches(0);
    setTimer(0);
    setIsActive(false);
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  useEffect(() => {
    let interval: any;
    if (isActive && matches < ICONS.length) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, matches]);

  const handleCardClick = (index: number) => {
    if (!isActive) setIsActive(true);
    if (cards[index].isFlipped || cards[index].isMatched || flippedIndices.length === 2) return;

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(prev => prev + 1);
      const [firstIndex, secondIndex] = newFlipped;
      if (cards[firstIndex].content === cards[secondIndex].content) {
        setTimeout(() => {
          const matchedCards = [...cards];
          matchedCards[firstIndex].isMatched = true;
          matchedCards[secondIndex].isMatched = true;
          setCards(matchedCards);
          const newMatches = matches + 1;
          setMatches(newMatches);
          setFlippedIndices([]);
          if (newMatches === ICONS.length) {
            setTimeout(() => unlockSection('wordsearch'), 2000);
          }
        }, 500);
      } else {
        setTimeout(() => {
          const resetCards = [...cards];
          resetCards[firstIndex].isFlipped = false;
          resetCards[secondIndex].isFlipped = false;
          setCards(resetCards);
          setFlippedIndices([]);
        }, 1000);
      }
    }
  };

  return (
    <section className="min-h-screen py-20 flex flex-col items-center justify-center bg-white border-t border-gray-50">
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="text-4xl md:text-5xl font-playfair mb-8 text-center"
      >
        Think you can remember?
      </motion.h2>

      <div className="mb-8 flex gap-8 text-gray-500 font-inter">
        <p>Flips: {moves}</p>
        <p>Time: {timer}s</p>
      </div>

      <div className="grid grid-cols-4 gap-4 max-w-md w-full px-4">
        {cards.map((card, index) => (
          <motion.div
            key={card.id}
            className="aspect-square relative cursor-pointer"
            style={{ perspective: 1000 }}
            onClick={() => handleCardClick(index)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className="w-full h-full relative"
              style={{ transformStyle: 'preserve-3d' }}
              animate={{ rotateY: card.isFlipped || card.isMatched ? 180 : 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="absolute inset-0 bg-white border-2 border-accent/20 flex items-center justify-center rounded-xl" style={{ backfaceVisibility: 'hidden' }}>
                <div className="w-full h-full bg-[radial-gradient(circle_at_center,_#C9933A_1px,_transparent_1px)] bg-[size:12px_12px] opacity-20" />
              </div>
              <div 
                className={cn(
                  "absolute inset-0 bg-white border-2 border-accent flex items-center justify-center rounded-xl",
                  card.isMatched && "bg-accent/5"
                )}
                style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
              >
                <span className="text-3xl">{card.content}</span>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {matches === ICONS.length && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 flex flex-col items-center gap-4"
          >
            <div className="flex items-center gap-2 text-green-600 font-medium text-xl">
              <CheckCircle2 className="w-8 h-8" />
              <span>Perfect memory!</span>
            </div>
            <button 
              onClick={initGame}
              className="px-6 py-2 border border-accent text-accent hover:bg-accent hover:text-white transition-colors rounded-full"
            >
              Play Again
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
