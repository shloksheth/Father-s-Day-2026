'use client';

import { IntroSection } from '@/components/intro/IntroSection';
import { SlidingPuzzle } from '@/components/games/SlidingPuzzle';
import { MemoryMatch } from '@/components/games/MemoryMatch';
import { WordSearch } from '@/components/games/WordSearch';
import { ArcadeSection } from '@/components/arcade/ArcadeSection';
import { AnnoyingButton } from '@/components/games/AnnoyingButton';
import { PhotoGallery } from '@/components/gallery/PhotoGallery';
import { Navbar } from '@/components/ui/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useGameState } from '@/hooks/useGameState';

export default function Home() {
  const { unlockedSections, unlockSection } = useGameState();
  const isUnlocked = unlockedSections.has('puzzle');

  return (
    <main className={cn("min-h-screen", !isUnlocked && "h-screen overflow-hidden")}>
      <AnimatePresence>
        {!isUnlocked && (
          <IntroSection onUnlock={() => unlockSection('puzzle')} />
        )}
      </AnimatePresence>

      <div className={cn("transition-opacity duration-1000", isUnlocked ? "opacity-100" : "opacity-0")}>
        <Navbar />
        {unlockedSections.has('puzzle') && <div id="puzzle"><SlidingPuzzle /></div>}
        {unlockedSections.has('memory') && <div id="memory"><MemoryMatch /></div>}
        {unlockedSections.has('wordsearch') && <div id="wordsearch"><WordSearch /></div>}
        {unlockedSections.has('arcade') && <div id="arcade"><ArcadeSection /></div>}
        {unlockedSections.has('button') && <div id="button"><AnnoyingButton /></div>}
        {unlockedSections.has('gallery') && <div id="gallery"><PhotoGallery /></div>}
        
        <footer className="relative py-24 px-6 bg-white flex flex-col items-center justify-center gap-8 overflow-hidden">
           <motion.div 
             initial={{ scale: 0.8, opacity: 0 }}
             whileInView={{ scale: 1, opacity: 1 }}
             viewport={{ once: true }}
             className="text-4xl md:text-6xl font-playfair text-accent"
           >
             Happy Father's Day, Nirav
           </motion.div>
           <div className="w-16 h-[1px] bg-accent/30" />
           <p className="text-sm text-gray-400 font-inter">Wishing you a day filled with love and joy.</p>
           
           <p className="absolute bottom-4 right-4 text-[10px] text-gray-300 font-inter">
             Made by Shlok Sheth
           </p>
        </footer>
      </div>
    </main>
  );
}
