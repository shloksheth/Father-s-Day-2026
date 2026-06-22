'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useGameState } from '@/hooks/useGameState';
import { Pong } from './Pong';
import { DotsAndBoxes } from './DotsAndBoxes';
import { WordScrambleRace } from './WordScrambleRace';
import { TriviaShowdown } from './TriviaShowdown';

const TABS = [
  { id: 'pong', label: '🏓 Pong', component: Pong },
  { id: 'dots', label: '⬛ Dots & Boxes', component: DotsAndBoxes },
  { id: 'scramble', label: '🔤 Word Scramble', component: WordScrambleRace },
  { id: 'trivia', label: '❓ Trivia Showdown', component: TriviaShowdown },
];

export const ArcadeSection = () => {
  const { unlockSection } = useGameState();
  const [activeTab, setActiveTab] = useState(TABS[0].id);
  const [beatenGames, setBeatenGames] = useState<Set<string>>(new Set());

  const handleGameBeat = (gameId: string) => {
    setBeatenGames(prev => {
      const next = new Set(prev);
      next.add(gameId);
      if (next.size === TABS.length) {
        setTimeout(() => unlockSection('button'), 2000);
      }
      return next;
    });
  };
  return (
    <section className="min-h-screen py-20 flex flex-col items-center bg-white border-t border-gray-50">
      <h2 className="text-4xl md:text-5xl font-playfair mb-12 text-center">Dad & Kid Arcade</h2>
      <div className="w-full max-w-6xl px-6">
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {TABS.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={cn("px-6 py-3 rounded-full font-bold", activeTab === tab.id ? "bg-accent text-white" : "bg-gray-100 text-gray-500")}>{tab.label}</button>
          ))}
        </div>
        <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl overflow-hidden min-h-[600px]">
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="w-full h-full">
              {(() => {
                const TabComponent = TABS.find(t => t.id === activeTab)?.component;
                return TabComponent ? <TabComponent onBeat={() => handleGameBeat(activeTab)} /> : null;
              })()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
