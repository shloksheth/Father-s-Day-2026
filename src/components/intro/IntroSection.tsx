'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { cn } from '@/lib/utils';

interface IntroSectionProps {
  onUnlock: () => void;
}

export const IntroSection: React.FC<IntroSectionProps> = ({ onUnlock }) => {
  const [narratorText, setNarratorText] = useState("");
  const [chaosLevel, setChaosLevel] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isShattered, setIsShattered] = useState(false);
  const [triggeredElements, setTriggeredElements] = useState<Set<string>>(new Set());
  const [closeButtonPos, setCloseButtonPos] = useState({ x: 50, y: 60 });
  const [showError, setShowError] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isRevealing, setIsRevealing] = useState(false);

  const fullText = "This is not a website. There is nothing here. Please close this tab.";
  const CHAOS_THRESHOLD = 5;

  const speak = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.pitch = 1;
      utterance.rate = 0.9;
      const voices = window.speechSynthesis.getVoices();
      const googleVoice = voices.find(v => v.name.includes('Google') && v.lang.includes('en'));
      if (googleVoice) utterance.voice = googleVoice;
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setNarratorText(fullText.slice(0, index));
      index++;
      if (index === 1) speak(fullText);
      if (index > fullText.length) clearInterval(interval);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    if (chaosLevel >= CHAOS_THRESHOLD) {
      setTimeout(() => {
        setIsShattered(true);
        setTimeout(() => {
          setIsRevealing(true);
          setTimeout(onUnlock, 2000);
        }, 1500);
      }, 1000);
    }
  }, [chaosLevel, onUnlock]);

  const triggerChaos = (id: string) => {
    if (!triggeredElements.has(id)) {
      setTriggeredElements(prev => new Set(prev).add(id));
      setChaosLevel(prev => prev + 1);
      setProgress(prev => Math.min(100, (chaosLevel + 1) * (100 / CHAOS_THRESHOLD)));
    }
  };

  const handleCloseClick = () => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 }
    });
    setCloseButtonPos({
      x: Math.random() * 80 + 10,
      y: Math.random() * 80 + 10
    });
    triggerChaos('close-button');
  };

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-hidden flex flex-col items-center justify-center font-inter">
      <AnimatePresence>
        {!isShattered && (
          <motion.div 
            className="relative w-full h-full flex flex-col items-center justify-center p-10"
            exit={{ opacity: 0, scale: 2, filter: "blur(10px)" }}
          >
            {/* Narrator Text */}
            <div className="w-full max-w-[80vw] px-8 mb-12">
            <h1 className="text-2xl md:text-3xl lg:text-5xl text-center font-light leading-snug">
              {narratorText.split('').map((char, i) => (
                <motion.span
                  key={i}
                  className={cn(
                    "inline-block",
                    triggeredElements.has(`char-${i}`) && "animate-bounce text-accent"
                  )}
                  onClick={() => char !== ' ' && triggerChaos(`char-${i}`)}
                  whileHover={char !== ' ' ? { scale: 1.2, color: '#C9933A' } : {}}
                >
                  {char === ' ' ? '\u00A0' : char}
                </motion.span>
              ))}
            </h1>
            </div>

            {/* Close Tab Button */}
            <motion.button
              className="absolute px-6 py-2 bg-gray-100 border border-gray-300 rounded shadow-sm hover:bg-gray-200 transition-colors"
              style={{ left: `${closeButtonPos.x}%`, top: `${closeButtonPos.y}%` }}
              onClick={handleCloseClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Close Tab
            </motion.button>

            {/* Cursor Following Eye */}
            <div 
              className="fixed pointer-events-none z-50"
              style={{ 
                left: mousePos.x, 
                top: mousePos.y,
                transform: 'translate(-50%, -50%)' 
              }}
            >
              <div className="w-12 h-12 bg-white border-2 border-black rounded-full flex items-center justify-center overflow-hidden">
                <motion.div 
                  className="w-4 h-4 bg-black rounded-full"
                  animate={{
                    x: typeof window !== 'undefined' ? (mousePos.x - window.innerWidth / 2) / 50 : 0,
                    y: typeof window !== 'undefined' ? (mousePos.y - window.innerHeight / 2) / 50 : 0,
                  }}
                />
              </div>
            </div>

            {/* Loading Nothing Progress Bar */}
            <div className="absolute bottom-20 w-64 h-8 border border-gray-300 p-1">
              <div 
                className="h-full bg-accent transition-all duration-500" 
                style={{ width: `${progress}%` }}
                onClick={() => triggerChaos('progress-bar')}
              />
              <span className="absolute -top-6 left-0 text-xs text-gray-500">Loading: Nothing</span>
            </div>

            {/* Tumbling Trash */}
            <motion.div
              className="absolute cursor-pointer"
              initial={{ top: -100, left: '20%', rotate: 0 }}
              animate={{ 
                top: '110%', 
                rotate: 360,
                left: ['20%', '25%', '15%', '20%']
              }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              onClick={() => triggerChaos('trash')}
            >
              <div className="relative group">
                <span className="text-4xl">🗑️</span>
                <span className="absolute left-full ml-2 px-2 py-1 bg-black text-white text-[10px] rounded opacity-0 group-hover:opacity-100 whitespace-nowrap">
                  Oh. Same as India.
                </span>
              </div>
            </motion.div>

            {/* Stylized SVG Bird - Better Animation */}
            <motion.div
              className="absolute cursor-pointer"
              initial={{ left: '-10%', top: '20%' }}
              animate={{ left: '110%', top: ['20%', '15%', '25%', '20%'] }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
              onClick={() => triggerChaos('bird')}
            >
              <svg width="80" height="60" viewBox="0 0 80 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                <motion.path 
                  d="M10 30 Q 30 10 50 30 Q 70 50 50 30 Q 30 10 10 30" 
                  stroke="#C9933A" 
                  strokeWidth="2"
                  animate={{ d: ["M10 30 Q 30 10 50 30 Q 70 50 50 30 Q 30 10 10 30", "M10 30 Q 30 50 50 30 Q 70 10 50 30 Q 30 50 10 30"] }}
                  transition={{ duration: 0.4, repeat: Infinity, ease: "easeInOut" }}
                />
                <circle cx="52" cy="28" r="1.5" fill="#C9933A" />
                <path d="M55 28 L60 25 L55 31 Z" fill="#C9933A" />
              </svg>
            </motion.div>

            {/* Tiny Star in Corner */}
            <motion.div
              className="absolute top-4 right-4 cursor-pointer text-accent"
              whileHover={{ scale: 1.5, rotate: 180 }}
              onClick={() => triggerChaos('star')}
            >
              ⭐
            </motion.div>

            {/* Premium Trash Image at bottom */}
            <motion.div
              className="absolute bottom-10 left-1/2 -translate-x-1/2 cursor-pointer z-40"
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 5, duration: 1 }}
              onClick={() => {
                setShowError(true);
                triggerChaos('trash-big');
              }}
            >
              <div className="relative group">
                <div className="w-32 h-32 bg-white rounded-2xl shadow-xl border border-gray-100 flex items-center justify-center grayscale hover:grayscale-0 transition-all overflow-hidden p-2">
                  <img 
                    src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=200" 
                    alt="Trash"
                    className="w-full h-full object-cover rounded-xl"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                </div>
                <div className="absolute -top-3 -right-3 bg-accent text-white rounded-full px-3 py-1 shadow-lg text-xs font-bold">
                  CLICK ME
                </div>
              </div>
            </motion.div>

            {/* Big "Same as India" Popup */}
            <AnimatePresence>
              {showError && (
                <motion.div
                  initial={{ scale: 0, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0, opacity: 0, y: 20 }}
                  className="fixed inset-0 z-[100] flex items-center justify-center bg-black/20 backdrop-blur-sm"
                  onClick={() => setShowError(false)}
                >
                  <motion.div 
                    className="bg-white p-12 rounded-3xl shadow-2xl border-4 border-accent text-center max-w-lg"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <h3 className="text-7xl mb-6 font-playfair text-accent">Oh.</h3>
                    <p className="text-3xl font-inter font-bold text-gray-800 uppercase tracking-tighter">Same as India.</p>
                    <button 
                      onClick={() => setShowError(false)}
                      className="mt-10 px-8 py-3 bg-accent text-white rounded-full font-bold hover:scale-105 transition-transform"
                    >
                      Okay...
                    </button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Fake Error Message */}
            {chaosLevel > 2 && !showError && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-1/4 left-1/4 p-4 bg-red-50 border border-red-200 text-red-600 rounded shadow-lg max-w-xs"
              >
                <p className="font-bold">Error 404</p>
                <p className="text-sm">Meaning not found. Please stop clicking things.</p>
                <button 
                  className="mt-2 text-xs underline"
                  onClick={() => setChaosLevel(prev => prev + 1)}
                >
                  Dismiss
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Improved Glass Shatter Effect */}
      {isShattered && !isRevealing && (
        <div className="fixed inset-0 z-[60] pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-white border border-gray-100"
              initial={{ 
                clipPath: `polygon(${Math.random()*100}% ${Math.random()*100}%, ${Math.random()*100}% ${Math.random()*100}%, ${Math.random()*100}% ${Math.random()*100}%)`,
                top: 0, left: 0, right: 0, bottom: 0,
                opacity: 1
              }}
              animate={{ 
                y: [0, Math.random() * 2000 - 500],
                x: [0, (Math.random() - 0.5) * 1000],
                rotate: [0, (Math.random() - 0.5) * 720],
                opacity: [1, 1, 0]
              }}
              transition={{ duration: 1.5, ease: "circIn" }}
            />
          ))}
        </div>
      )}

      {/* Final Reveal */}
      <AnimatePresence>
        {isRevealing && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed inset-0 flex flex-col items-center justify-center bg-white z-[70]"
          >
            <motion.h2 
              className="text-4xl md:text-6xl font-playfair text-accent text-center px-6"
              initial={{ y: 20 }}
              animate={{ y: 0 }}
            >
              Okay fine. Happy Father's Day, Nirav.
            </motion.h2>
            <motion.div
              className="mt-8 w-24 h-24 rounded-full bg-accent"
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ delay: 0.5, duration: 0.8 }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
