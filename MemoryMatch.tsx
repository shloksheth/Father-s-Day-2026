'use client';

import React, { useState, useEffect, useRef } from 'react';

export const Pong = ({ onBeat }: { onBeat?: () => void }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState({ p1: 0, p2: 0 });
  const [winner, setWinner] = useState<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let ball = { x: 400, y: 200, dx: 4, dy: 4, radius: 8 };
    let p1 = { y: 150, width: 10, height: 80 };
    let p2 = { y: 150, width: 10, height: 80 };
    let keys: { [key: string]: boolean } = {};
    const handleKeyDown = (e: KeyboardEvent) => keys[e.key] = true;
    const handleKeyUp = (e: KeyboardEvent) => delete keys[e.key];
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    const update = () => {
      if (winner !== null) return;
      if (keys['w'] && p1.y > 0) p1.y -= 5;
      if (keys['s'] && p1.y < canvas.height - p1.height) p1.y += 5;
      if (keys['ArrowUp'] && p2.y > 0) p2.y -= 5;
      if (keys['ArrowDown'] && p2.y < canvas.height - p2.height) p2.y += 5;
      ball.x += ball.dx; ball.y += ball.dy;
      if (ball.y < 0 || ball.y > canvas.height) ball.dy *= -1;
      if ((ball.x < p1.width && ball.y > p1.y && ball.y < p1.y + p1.height) ||
          (ball.x > canvas.width - p2.width - ball.radius && ball.y > p2.y && ball.y < p2.y + p2.height)) {
        ball.dx *= -1.1;
      }
      if (ball.x < 0) {
        setScore(s => {
          const next = { ...s, p2: s.p2 + 1 };
          if (next.p2 >= 3) setWinner(2);
          return next;
        });
        resetBall();
      } else if (ball.x > canvas.width) {
        setScore(s => {
          const next = { ...s, p1: s.p1 + 1 };
          if (next.p1 >= 3) {
            setWinner(1);
            if (onBeat) onBeat();
          }
          return next;
        });
        resetBall();
      }
    };
    const resetBall = () => {
      ball.x = canvas.width / 2; ball.y = canvas.height / 2;
      ball.dx = (Math.random() > 0.5 ? 1 : -1) * 4;
      ball.dy = (Math.random() > 0.5 ? 1 : -1) * 4;
    };
    const draw = () => {
      ctx.fillStyle = '#1e293b'; ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = '#C9933A'; ctx.setLineDash([10, 10]);
      ctx.beginPath(); ctx.moveTo(canvas.width / 2, 0); ctx.lineTo(canvas.width / 2, canvas.height); ctx.stroke();
      ctx.fillStyle = 'white'; ctx.fillRect(0, p1.y, p1.width, p1.height);
      ctx.fillRect(canvas.width - p2.width, p2.y, p2.width, p2.height);
      ctx.beginPath(); ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2); ctx.fill();
    };
    let animationId: number;
    const loop = () => { update(); draw(); animationId = requestAnimationFrame(loop); };
    loop();
    return () => { window.removeEventListener('keydown', handleKeyDown); window.removeEventListener('keyup', handleKeyUp); cancelAnimationFrame(animationId); };
  }, [winner]);

  return (
    <div className="flex flex-col items-center gap-6 p-6">
      <div className="flex justify-between w-full max-w-lg text-4xl font-playfair text-accent"><span>{score.p1}</span><span>{score.p2}</span></div>
      <div className="relative">
        <canvas ref={canvasRef} width={800} height={400} className="border-4 border-accent/20 rounded shadow-2xl bg-slate-900" />
        {winner && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-white">
            <h3 className="text-5xl font-playfair mb-4 text-accent">Player {winner} Wins!</h3>
            <button onClick={() => { setScore({ p1: 0, p2: 0 }); setWinner(null); }} className="px-6 py-2 bg-accent text-white rounded hover:bg-accent/90">Play Again</button>
          </div>
        )}
      </div>
      <p className="text-gray-400 text-sm">P1: W/S | P2: Arrow Up/Down</p>
    </div>
  );
};
