'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Question {
  id: number;
  category: string;
  type: 'mcq' | 'buzzer';
  question: string;
  options?: string[];
  answer: string;
}

const DUMMY_QUESTIONS: Question[] = [
  { id: 1, category: 'Random', type: 'buzzer', question: "What color is a blue orange?", answer: "Transparent" },
  { id: 2, category: 'Random', type: 'mcq', question: "Who is the king of Nothing?", options: ["Me", "You", "Nirav", "Nobody"], answer: "Nobody" },
];

const REAL_QUESTIONS: Question[] = [
  { id: 1, category: 'Marvel', type: 'buzzer', question: "What is the name of Thor's hammer?", answer: "Mjolnir" },
  { id: 2, category: 'Marvel', type: 'buzzer', question: "Who was the first Avenger to join the team in the MCU?", answer: "Captain America" },
  { id: 3, category: 'Marvel', type: 'buzzer', question: "What substance is Captain America's shield made of?", answer: "Vibranium" },
  { id: 4, category: 'DC', type: 'buzzer', question: "What is the name of Batman's butler?", answer: "Alfred Pennyworth" },
  { id: 5, category: 'DC', type: 'buzzer', question: "What is Wonder Woman's secret identity?", answer: "Diana Prince" },
  { id: 6, category: 'Movies', type: 'buzzer', question: "In Inception, what is the 'totem' used by Cobb?", answer: "A spinning top" },
  { id: 7, category: 'Geography', type: 'mcq', question: "Which is the largest country in the world by land area?", options: ["Canada", "China", "Russia", "USA"], answer: "Russia" },
  { id: 8, category: 'Geography', type: 'mcq', question: "Which river is the longest in the world?", options: ["Amazon", "Nile", "Yangtze", "Mississippi"], answer: "Nile" },
  { id: 9, category: 'Geography', type: 'mcq', question: "What is the capital of Japan?", options: ["Seoul", "Beijing", "Tokyo", "Bangkok"], answer: "Tokyo" },
  { id: 10, category: 'Geography', type: 'mcq', question: "Mount Everest is located in which mountain range?", options: ["Andes", "Himalayas", "Rockies", "Alps"], answer: "Himalayas" },
  { id: 11, category: 'Math', type: 'buzzer', question: "If a doctor gives you 3 pills and tells you to take one every half hour, how long will they last?", answer: "1 hour" },
  { id: 12, category: 'Math', type: 'buzzer', question: "A bat and a ball cost $1.10 in total. The bat costs $1.00 more than the ball. How much does the ball cost?", answer: "5 cents" },
  { id: 13, category: 'Riddles', type: 'buzzer', question: "What has keys but no locks, and space but no rooms?", answer: "A keyboard" },
  { id: 14, category: 'Riddles', type: 'buzzer', question: "The more of this there is, the less you see. What is it?", answer: "Darkness" },
  { id: 15, category: 'Random', type: 'buzzer', question: "What is the chemical symbol for Gold?", answer: "Au" },
  { id: 16, category: 'Random', type: 'buzzer', question: "How many continents are there on Earth?", answer: "7" },
];

export const TriviaShowdown = ({ onBeat }: { onBeat?: () => void }) => {
  const [isRealGame, setIsRealGame] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [scores, setScores] = useState({ p1: 0, p2: 0 });
  const [buzzedPlayer, setBuzzedPlayer] = useState<number | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const questions = isRealGame ? REAL_QUESTIONS : DUMMY_QUESTIONS;
  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (buzzedPlayer !== null || gameOver || currentQuestion.type === 'mcq') return;
      if (e.key.toLowerCase() === 'z') setBuzzedPlayer(1);
      else if (e.key === '/') setBuzzedPlayer(2);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [buzzedPlayer, gameOver, currentQuestion.type]);

  const handleCorrect = () => { if (buzzedPlayer) { setScores(s => ({ ...s, [buzzedPlayer === 1 ? 'p1' : 'p2']: s[buzzedPlayer === 1 ? 'p1' : 'p2'] + 1 })); nextQuestion(); } };
  const handleWrong = () => { if (buzzedPlayer) { setScores(s => ({ ...s, [buzzedPlayer === 1 ? 'p1' : 'p2']: s[buzzedPlayer === 1 ? 'p1' : 'p2'] - 1 })); setBuzzedPlayer(null); } };
  const handleMCQAnswer = (option: string) => { if (option === currentQuestion.answer) { setScores(s => ({ ...s, p1: s.p1 + 1 })); nextQuestion(); } else setScores(s => ({ ...s, p1: s.p1 - 1 })); };
  const nextQuestion = () => { 
    setBuzzedPlayer(null); 
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1); 
    } else {
      setGameOver(true);
      if (onBeat) onBeat();
    }
  };

  return (
    <div className="relative min-h-[500px] flex flex-col items-center p-8 bg-white overflow-hidden">
      <button onClick={() => { setIsRealGame(true); setCurrentQuestionIndex(0); setScores({p1:0, p2:0}); }} className="absolute top-0 left-0 w-4 h-4 opacity-0 cursor-default" />
      <div className="flex justify-between w-full max-w-2xl mb-12">
        <div className="text-center"><p className="text-sm font-bold opacity-50">NIRAV</p><p className="text-5xl font-playfair text-accent">{scores.p1}</p></div>
        <div className="text-center"><p className="text-sm font-bold opacity-50">Q</p><p className="text-3xl">{currentQuestionIndex + 1}/{questions.length}</p></div>
        <div className="text-center"><p className="text-sm font-bold opacity-50">SHLOK</p><p className="text-5xl font-playfair text-slate-700">{scores.p2}</p></div>
      </div>
      {!gameOver ? (
        <motion.div key={currentQuestionIndex} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex flex-col items-center w-full max-w-3xl">
          <span className="px-4 py-1 bg-accent/10 text-accent text-sm rounded-full mb-4 uppercase font-bold">{currentQuestion.category}</span>
          <h3 className="text-3xl text-center font-playfair mb-12">{currentQuestion.question}</h3>
          {currentQuestion.type === 'buzzer' ? (
            <div className="flex gap-12">
              <div className={cn("w-32 h-32 rounded-full border-4 flex items-center justify-center text-4xl font-bold", buzzedPlayer === 1 ? "bg-accent border-accent text-white" : "text-gray-200")}>Z</div>
              <div className={cn("w-32 h-32 rounded-full border-4 flex items-center justify-center text-4xl font-bold", buzzedPlayer === 2 ? "bg-slate-700 border-slate-700 text-white" : "text-gray-200")}>/</div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 w-full">
              {currentQuestion.options?.map((o, i) => <button key={i} onClick={() => handleMCQAnswer(o)} className="p-4 border-2 rounded-xl hover:border-accent">{o}</button>)}
            </div>
          )}
          {buzzedPlayer && (
            <div className="mt-12 flex flex-col items-center gap-4">
              <p className="text-2xl font-bold text-accent">PLAYER {buzzedPlayer} ANSWER!</p>
              <div className="flex gap-4"><button onClick={handleCorrect} className="px-8 py-2 bg-green-600 text-white rounded-full">Correct</button><button onClick={handleWrong} className="px-8 py-2 bg-red-600 text-white rounded-full">Wrong</button></div>
            </div>
          )}
        </motion.div>
      ) : <div className="text-center"><h3 className="text-5xl font-playfair">GameOver</h3><p className="text-2xl">Nirav: {scores.p1} | Shlok: {scores.p2}</p></div>}
    </div>
  );
};
