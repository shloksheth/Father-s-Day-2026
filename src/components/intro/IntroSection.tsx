'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { cn } from '@/lib/utils';

interface IntroSectionProps {
  onUnlock: () => void;
}

export const IntroSection: React.FC<IntroSectionProps> = ({ onUnlock }) => {
  const [narratorText, setNarratorText] = useState("Hello. There is absolutely no website here.");
  const [buttonText, setButtonText] = useState("Close Tab");
  const [chaosLevel, setChaosLevel] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isShattered, setIsShattered] = useState(false);
  const [closeButtonPos, setCloseButtonPos] = useState({ x: 50, y: 60 });
  const [showError, setShowError] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isRevealing, setIsRevealing] = useState(false);

  // Helper function to safely execute text-to-speech dynamically
  const speak = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.pitch = 0.85; // Slightly deeper, robotic narrator tone
      utterance.rate = 0.95;
      
      const voices = window.speechSynthesis.getVoices();
      const googleVoice = voices.find(v => v.name.includes('Google') && v.lang.includes('en'));
      if (googleVoice) utterance.voice = googleVoice;
      
      window.speechSynthesis.speak(utterance);
    }
  };

  // Initial welcome message
  useEffect(() => {
    const timer = setTimeout(() => {
      speak("Hello. There is absolutely no website here. Please close the tab and go back to work.");
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Track cursor coordinates for the custom eye element
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Monitor total progress to trigger the final glass shatter sequence
  useEffect(() => {
    if (chaosLevel >= 6) {
      speak("Stop! Stop! Look what you did! You broke the code structure!");
      setTimeout(() => {
        setIsShattered(true);
        setTimeout(() => {
          setIsRevealing(true);
          setTimeout(onUnlock, 3000);
        }, 1500);
      }, 1500);
    }
  }, [chaosLevel, onUnlock]);

  // Dynamic narrator script handling based on user actions
  const triggerInteraction = (type: string) => {
    setChaosLevel(prev => {
      const nextChaos = prev + 1;
      setProgress(Math.min(100, (nextChaos / 6) * 100));

      if (type === 'text_click') {
        setNarratorText("Hey! Do not touch the letters. They are highly volatile.");
        speak("Hey! Do not touch the letters. They are highly volatile.");
      } else if (type === 'button_click') {
        const responses = [
          "Stop trying to click that. It doesn't even work.",
          "Missed me! Seriously, just close the browser manually.",
          "Wow, you are very persistent. Stop it.",
          "Fine, I will just move it somewhere else!"
        ];
        const randomReply = responses[Math.min(nextChaos - 1, responses.length - 1)];
        setNarratorText(randomReply);
        speak(randomReply);
      } else if (type === 'progress_click') {
        setNarratorText("Why are you clicking the bar? It is loading absolutely nothing.");
        speak("Why are you clicking the bar? It is loading absolutely nothing.");
      } else if (type === 'trash_click') {
        setNarratorText("Ah, premium trash. Remind you of home?");
        speak("Ah, premium trash. Remind you of home?");
      }

      return nextChaos;
    });
  };

  const handleCloseClick = () => {
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 }
    });
    
    // Teleport button to a random safe screen coordinate
    setCloseButtonPos({
      x: Math.random() * 70 + 15,
      y: Math.random() * 70 + 15
    });

    const buttonLabels = ["Click Me", "Not Here", "Over Here", "Too Slow", "Try Again"];
    setButtonText(buttonLabels[Math.floor(Math.random() * buttonLabels.length)]);
    
    triggerInteraction('button_click');
  };

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-hidden flex flex-col items-center justify-center font-inter select-none">
      <AnimatePresence>
        {!isShattered && (
          <motion.div 
            className="relative w-full h-full flex flex-col items-center justify-center p-10"
            exit={{ opacity: 0, scale: 2, filter: "blur(10px)" }}
          >
            {/* Active Reacting Narrator Box */}
            <div className="w-full max-w-[80vw] px-8 mb-12 min-h-[120px] flex items-center justify-center">
              <h1 
                className="text-2xl md:text-3xl lg:text-4xl text-center font-semibold text-gray-800 leading-snug cursor-pointer hover:text-accent transition-colors"
                onClick={() => triggerInteraction('text_click')}
              >
                {narratorText}
              </h1>
            </div>

            {/* Runaway Button */}
            <motion.button
              className="absolute px-6 py-3 bg-gray-900 text-white font-bold rounded-xl shadow-lg hover:bg-black transition-colors z-30"
              style={{ left: `${closeButtonPos.x}%`, top: `${closeButtonPos.y}%` }}
              onClick={handleCloseClick}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {buttonText}
            </motion.button>

            {/* Cursor Tracking Eye */}
            <div 
              className="fixed pointer-events-none z-50 hidden md:block"
              style={{ 
                left: mousePos.x, 
                top: mousePos.y,
                transform: 'translate(-50%, -50%)' 
              }}
            >
              <div className="w-14 h-14 bg-white border-4 border-gray-900 rounded-full flex items-center justify-center overflow-hidden shadow-md">
                <motion.div 
                  className="w-5 h-5 bg-gray-900 rounded-full"
                  animate={{
                    x: typeof window !== 'undefined' ? (mousePos.x - window.innerWidth / 2) / 35 : 0,
                    y: typeof window !== 'undefined' ? (mousePos.y - window.innerHeight / 2) / 35 : 0,
                  }}
                />
              </div>
            </div>

            {/* Interactive Progress Bar */}
            <div 
              className="absolute bottom-24 w-72 h-10 border-2 border-gray-900 rounded-lg p-1 cursor-pointer overflow-hidden bg-gray-50"
              onClick={() => triggerInteraction('progress_click')}
            >
              <div 
                className="h-full bg-accent rounded-sm transition-all duration-300" 
                style={{ width: `${progress}%` }}
              />
              <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-700 mix-blend-difference">
                Loading Nothing: {Math.round(progress)}%
              </span>
            </div>

            {/* Floating Trash Bin Icon */}
            <motion.div
              className="absolute cursor-pointer p-2 z-20"
              initial={{ top: -100, left: '20%' }}
              animate={{ 
                top: '110%', 
                rotate: 360,
                left: ['20%', '28%', '12%', '20%']
              }}
              transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
              onClick={() => triggerInteraction('text_click')}
            >
              <span className="text-4xl">🗑️</span>
            </motion.div>

            {/* Premium Trash Box Section */}
            <motion.div
              className="absolute bottom-6 left-1/2 -translate-x-1/2 cursor-pointer z-40"
              initial={{ y: 150, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 2, duration: 0.8 }}
              onClick={() => {
                setShowError(true);
                triggerInteraction('trash_click');
              }}
            >
              <div className="relative group">
                <div className="w-24 h-24 bg-white rounded-2xl shadow-xl border-2 border-gray-200 flex items-center justify-center grayscale group-hover:grayscale-0 transition-all overflow-hidden p-1">
                  <img 
                    src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=200" 
                    alt="Trash"
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
                <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-2 py-0.5 shadow-md text-[10px] font-black animate-pulse">
                  DO NOT CLICK
                </div>
              </div>
            </motion.div>

            {/* "Same as India" Modal Overlay */}
            <AnimatePresence>
              {showError && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm"
                  onClick={() => setShowError(false)}
                >
                  <motion.div 
                    className="bg-white p-10 rounded-3xl shadow-2xl border-4 border-gray-900 text-center max-w-sm mx-4"
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <h3 className="text-6xl mb-4 font-serif text-accent">Oh.</h3>
                    <p className="text-2xl font-bold text-gray-800 uppercase tracking-tight">Same as India.</p>
                    <button 
                      onClick={() => setShowError(false)}
                      className="mt-6 px-6 py-2.5 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-colors"
                    >
                      Understood
                    </button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Screen Crack / Shatter Animation */}
      {isShattered && !isRevealing && (
        <div className="fixed inset-0 z-[60] pointer-events-none">
          {[...Array(25)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-white border border-gray-200"
              initial={{ 
                clipPath: `polygon(${Math.random()*100}% ${Math.random()*100}%, ${Math.random()*100}% ${Math.random()*100}%, ${Math.random()*100}% ${Math.random()*100}%)`,
                top: 0, left: 0, right: 0, bottom: 0,
                opacity: 1
              }}
              animate={{ 
                y: [0, Math.random() * 1600 - 400],
                x: [0, (Math.random() - 0.5) * 800],
                rotate: [0, (Math.random() - 0.5) * 360],
                opacity: [1, 1, 0]
              }}
              transition={{ duration: 1.4, ease: "easeInOut" }}
            />
          ))}
        </div>
      )}

      {/* Final Gift Reveal Container */}
      <AnimatePresence>
        {isRevealing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 flex flex-col items-center justify-center bg-gray-950 z-[70]"
          >
            <motion.h2 
              className="text-3xl md:text-5xl font-serif text-accent text-center px-6 max-w-2xl leading-tight font-medium"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Fine, you wins. <br />
              <span className="text-white">Happy Father's Day, Nirav.</span>
            </motion.h2>
            <motion.div
              className="mt-8 w-16 h-16 rounded-full bg-accent animate-ping opacity-25"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};