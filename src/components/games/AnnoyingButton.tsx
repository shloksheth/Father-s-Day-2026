'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useGameState } from '@/hooks/useGameState';

const TAUNTS = ["Nope.", "Not yet.", "You're too slow, Nirav.", "Try harder.", "Is that all you got?", "Almost!", "Missed me!", "Still too slow."];

export const AnnoyingButton = () => {
  const { unlockSection } = useGameState();
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [attempts, setAttempts] = useState(0);
  const [taunt, setTaunt] = useState("Click me to continue");
  const [isFrozen, setIsFrozen] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const moveButton = () => {
    if (isFrozen || isClicked) return;
    if (containerRef.current) {
      const container = containerRef.current.getBoundingClientRect();
      const newX = Math.random() * (container.width - 200) - (container.width / 2) + 100;
      const newY = Math.random() * (container.height - 100) - (container.height / 2) + 50;
      setPos({ x: newX, y: newY });
      setAttempts(prev => {
        const next = prev + 1;
        if (next >= 12) { setIsFrozen(true); setTaunt("Fine. You got me."); }
        else setTaunt(TAUNTS[next % TAUNTS.length]);
        return next;
      });
    }
  };

  return (
    <section ref={containerRef} className="h-screen py-20 flex flex-col items-center justify-center bg-white border-t border-gray-50 overflow-hidden relative">
      <h2 className="text-4xl md:text-5xl font-playfair mb-12 text-center">Almost done. Just click the button to continue.</h2>
      <div className="relative w-full h-64 flex items-center justify-center">
        <motion.button 
          animate={{ x: pos.x, y: pos.y }} 
          onMouseEnter={moveButton} 
          onClick={() => { 
            if (isFrozen) { 
              setIsClicked(true); 
              setTaunt("Keep going."); 
              setTimeout(() => unlockSection('gallery'), 2000);
            } 
          }} 
          className={cn("px-8 py-4 bg-accent text-white rounded-full text-xl font-bold shadow-xl", isFrozen && "animate-shake")}
        >
          {taunt}
        </motion.button>
      </div>
      <AnimatePresence>{isClicked && <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-12 text-2xl font-playfair text-accent">Fine. You got me. Keep going.</motion.div>}</AnimatePresence>
      <style jsx global>{`@keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } } .animate-shake { animation: shake 0.1s infinite; }`}</style>
    </section>
  );
};
