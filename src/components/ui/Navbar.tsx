'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useGameState } from '@/hooks/useGameState';

const SECTIONS = [
  { id: 'puzzle', label: 'Puzzle' },
  { id: 'memory', label: 'Memory' },
  { id: 'wordsearch', label: 'Word Search' },
  { id: 'arcade', label: 'Arcade' },
  { id: 'button', label: 'The Button' },
  { id: 'gallery', label: 'Gallery' },
];

export const Navbar = () => {
  const { unlockedSections, skipToSection } = useGameState();
  const [isOpen, setIsOpen] = useState(false);
  const [showDevMenu, setShowDevMenu] = useState(false);
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) { element.scrollIntoView({ behavior: 'smooth' }); setIsOpen(false); }
  };
  return (
    <nav className={cn("fixed top-0 left-0 right-0 z-40 transition-all duration-300 px-6 py-4", scrolled ? "bg-white/80 backdrop-blur-md shadow-sm" : "bg-transparent")}>
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <span className="font-playfair text-xl text-accent font-bold">Nirav</span>
        <div className="hidden md:flex gap-8">
          {SECTIONS.map((s) => (
            unlockedSections.has(s.id as any) && (
              <button key={s.id} onClick={() => scrollTo(s.id)} className="text-sm font-medium text-gray-500 hover:text-accent transition-colors">{s.label}</button>
            )
          ))}
        </div>
        <div className="flex items-center gap-4">
          <button className="text-gray-300 hover:text-accent transition-colors" onClick={() => setShowDevMenu(true)}>
            <Settings size={20} />
          </button>
          <button className="md:hidden text-accent" onClick={() => setIsOpen(!isOpen)}>{isOpen ? <X /> : <Menu />}</button>
        </div>
      </div>

      {/* Dev Menu Modal */}
      <AnimatePresence>
        {showDevMenu && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-6"
          >
            <motion.div 
              initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-playfair">Settings</h3>
                <button onClick={() => { setShowDevMenu(false); setIsAuthenticated(false); setPassword(''); }}><X /></button>
              </div>

              {!isAuthenticated ? (
                <div className="flex flex-col gap-4">
                  <p className="text-sm text-gray-500">Enter password for dev options:</p>
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (e.target.value === 'blehbleh') setIsAuthenticated(true);
                    }}
                    className="p-3 border rounded-xl outline-none focus:border-accent"
                    placeholder="Password..."
                    autoFocus
                  />
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                   <p className="text-sm font-bold text-accent uppercase tracking-widest">Jump to Section</p>
                   <div className="grid grid-cols-2 gap-2">
                     {SECTIONS.map(s => (
                       <button 
                         key={s.id}
                         onClick={() => {
                           skipToSection(s.id as any);
                           setShowDevMenu(false);
                           setIsAuthenticated(false);
                           setPassword('');
                         }}
                         className="p-3 bg-gray-50 hover:bg-accent hover:text-white rounded-xl text-left text-sm transition-colors"
                       >
                         {s.label}
                       </button>
                     ))}
                   </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="absolute top-full left-0 right-0 bg-white border-b border-gray-100 p-6 flex flex-col gap-4 md:hidden">
            {SECTIONS.map((s) => (
              unlockedSections.has(s.id as any) && (
                <button key={s.id} onClick={() => scrollTo(s.id)} className="text-lg font-playfair text-gray-800">{s.label}</button>
              )
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
