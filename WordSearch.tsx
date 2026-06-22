'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const ROUNDS = [
  { word: 'ACOSTA', scrambled: 'CASATO' },
  { word: 'RATLAMI', scrambled: 'MAITLAR' },
  { word: 'LABYRINTH', scrambled: 'THYRAINLB' },
  { word: 'PARADOX', scrambled: 'DOPRAXA' },
  { word: 'QUANTUM', scrambled: 'MUNTAUQ' },
  { word: 'SPHINX', scrambled: 'XNIHPS' },
];

export const WordScrambleRace = ({ onBeat }: { onBeat?: () => void }) => {
  const [currentRound, setCurrentRound] = useState(0);
  const [scores, setScores] = useState({ p1: 0, p2: 0 });
  const [p1Input, setP1Input] = useState('');
  const [p2Input, setP2Input] = useState('');
  const [winner, setWinner] = useState<number | null>(null);
  const [roundWinner, setRoundWinner] = useState<number | null>(null);

  const handleP1Change = (val: string) => {
    if (roundWinner) return;
    const input = val.toUpperCase(); setP1Input(input);
    if (input === ROUNDS[currentRound].word) handleWin(1);
  };

  const handleP2Change = (val: string) => {
    if (roundWinner) return;
    const input = val.toUpperCase(); setP2Input(input);
    if (input === ROUNDS[currentRound].word) handleWin(2);
  };

  const handleWin = (player: number) => {
    setRoundWinner(player);
    setScores(s => ({ ...s, [player === 1 ? 'p1' : 'p2']: s[player === 1 ? 'p1' : 'p2'] + 1 }));
    setTimeout(() => {
      if (currentRound < ROUNDS.length - 1) {
        setCurrentRound(prev => prev + 1); setP1Input(''); setP2Input(''); setRoundWinner(null);
      } else {
        setWinner(scores.p1 > scores.p2 ? 1 : 2);
        if (onBeat) onBeat();
      }
    }, 1500);
  };

  if (winner) return <div className="p-12 text-center"><h3 className="text-5xl font-playfair text-accent">Champion!</h3><p className="text-2xl">Player {winner} wins!</p></div>;

  return (
    <div className="flex flex-col items-center gap-12 p-8">
      <div className="flex justify-between w-full max-w-2xl">
        <div className="text-center"><p className="text-sm">PLAYER 1</p><p className="text-4xl text-accent">{scores.p1}</p></div>
        <div className="text-center"><p className="text-sm">ROUND</p><p className="text-4xl">{currentRound + 1}/6</p></div>
        <div className="text-center"><p className="text-sm">PLAYER 2</p><p className="text-4xl text-slate-700">{scores.p2}</p></div>
      </div>
      <motion.div key={currentRound} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-6xl md:text-8xl font-playfair tracking-widest">{ROUNDS[currentRound].scrambled}</motion.div>
      <div className="grid grid-cols-2 gap-12 w-full max-w-4xl">
        <input value={p1Input} onChange={(e) => handleP1Change(e.target.value)} disabled={roundWinner !== null} className={cn("p-4 text-2xl border-4 rounded-xl", roundWinner === 1 ? "border-green-500 bg-green-50" : "border-gray-100")} placeholder="P1..." />
        <input value={p2Input} onChange={(e) => handleP2Change(e.target.value)} disabled={roundWinner !== null} className={cn("p-4 text-2xl border-4 rounded-xl", roundWinner === 2 ? "border-green-500 bg-green-50" : "border-gray-100")} placeholder="P2..." />
      </div>
    </div>
  );
};
