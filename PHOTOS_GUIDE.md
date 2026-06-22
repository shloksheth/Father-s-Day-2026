'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Section = 'intro' | 'puzzle' | 'memory' | 'wordsearch' | 'arcade' | 'button' | 'gallery';

interface GameStateContextType {
  unlockedSections: Set<Section>;
  unlockSection: (section: Section) => void;
  currentSection: Section;
  setCurrentSection: (section: Section) => void;
  skipToSection: (section: Section) => void;
}

const GameStateContext = createContext<GameStateContextType | undefined>(undefined);

export const GameStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [unlockedSections, setUnlockedSections] = useState<Set<Section>>(new Set(['intro']));
  const [currentSection, setCurrentSection] = useState<Section>('intro');

  const unlockSection = (section: Section) => {
    setUnlockedSections((prev) => {
      const next = new Set(prev);
      next.add(section);
      return next;
    });
    
    // Auto-scroll to the newly unlocked section
    setTimeout(() => {
      const element = document.getElementById(section);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        setCurrentSection(section);
      }
    }, 500);
  };

  const skipToSection = (section: Section) => {
    setUnlockedSections((prev) => {
      const next = new Set(prev);
      // Logic to unlock everything up to this section
      const sections: Section[] = ['intro', 'puzzle', 'memory', 'wordsearch', 'arcade', 'button', 'gallery'];
      const index = sections.indexOf(section);
      for (let i = 0; i <= index; i++) {
        next.add(sections[i]);
      }
      return next;
    });
    
    setTimeout(() => {
      const element = document.getElementById(section);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        setCurrentSection(section);
      }
    }, 100);
  };

  return (
    <GameStateContext.Provider value={{ unlockedSections, unlockSection, currentSection, setCurrentSection, skipToSection }}>
      {children}
    </GameStateContext.Provider>
  );
};

export const useGameState = () => {
  const context = useContext(GameStateContext);
  if (context === undefined) {
    throw new Error('useGameState must be used within a GameStateProvider');
  }
  return context;
};
