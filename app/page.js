'use client';
import { useState, useEffect } from 'react'; // Добавил useEffect
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Heart, Gift } from 'lucide-react';

const Book = dynamic(() => import('../components/Book'), { ssr: false });

export default function Home() {
  const [noCount, setNoCount] = useState(0);
  const [yesPressed, setYesPressed] = useState(false);
  const [heartsCollected, setHeartsCollected] = useState(0);
  const [gameState, setGameState] = useState('idle'); 
  const [isMobile, setIsMobile] = useState(false); // Проверка на мобильник
  
  const HEARTS_TO_WIN = 15; 

  // Проверяем, с телефона ли сидят, чтобы повернуть экран (совет)
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleNoClick = () => { if (noCount < 5) setNoCount(noCount + 1); };

  const startHeartGame = () => {
    setGameState('playing');
    setHeartsCollected(0);
  };

  const collectHeart = (e) => {
    e.target.style.transform = "scale(1.5) rotate(20deg)";
    e.target.style.opacity = "0";
    setTimeout(() => { e.target.style.display = 'none'; }, 300);
    const newCount = heartsCollected + 1;
    setHeartsCollected(newCount);
    if (newCount >= HEARTS_TO_WIN) triggerWin();
  };

  const triggerWin = () => {
    setGameState('won');
    const duration = 3000;
    const end = Date.now() + duration;
    (function frame() {
      confetti({ colors: ['#ffc8dd', '#a0c4ff', '#caffbf'], particleCount: 5, angle: 60, spread: 55, origin: { x: 0 } });
      confetti({ colors: ['#ffc8dd', '#a0c4ff', '#caffbf'], particleCount: 5, angle: 120, spread: 55, origin: { x: 1 } });
      if (Date.now() < end) requestAnimationFrame(frame);
    }());
    setTimeout(() => setYesPressed(true), 1000);
  };

  const noButtonSize = 1 - noCount * 0.15; 

  if (yesPressed) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center bg-pink-50">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-4xl md:text-6xl text-red-500 font-fredoka font-bold mb-6">
            УРА! ❤️
        </motion.div>
        <div className="chibi-box p-6 max-w-md w-full mx-auto relative mt-10">
            <img src="/images/cat-dance.gif" alt="Dancing" className="w-40 h-40 mx-auto mb-4 rounded-xl border-4 border-white shadow-lg" />
            <h2 className="text-2xl font-fredoka font-bold mb-2 text-pink-600">Свидание</h2>
            <p className="text-brown-600 mb-6 font-nunito">
                Встретимся в нашей игре!
            </p>
            <a href="https://wa.me/77000000000" className="chibi-btn-primary w-full py-3 text-lg flex justify-center items-center gap-2 no-underline">
                <Gift size={20}/> Написать мне
            </a>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center overflow-x-hidden relative pb-10 px-2 bg-[#fff0f5]">
      
      {/* Если экран узкий, подскажем повернуть телефон для лучшего вида */}
      {isMobile && (
        <div className="w-full bg-blue-100 text-blue-600 text-xs text-center py-1 font-bold animate-pulse">
            💡 Совет: Поверни телефон горизонтально для лучшего вида! 🔄
        </div>
      )}

      {/* Заголовок */}
      <h1 className="text-4xl md:text-6xl font-fredoka font-black text-pink-500 mt-4 mb-2 text-center drop-shadow-sm">
        Love Story
      </h1>

      {/* КНИГА (Максимально широкая) */}
      <div className="w-full flex-1 flex items-center justify-center">
        <Book />
      </div>

      {/* ИГРОВАЯ ЗОНА */}
      <div className="z-20 w-full max-w-xl mt-4 mb-8">
        {gameState === 'idle' && (
             <div className="chibi-box p-6 text-center">
                <p className="text-xl text-brown-700 mb-4 font-fredoka">
                    Почувствовала тепло? 😻
                </p>
                <div className="flex gap-4 justify-center items-center flex-wrap">
                    <button onClick={startHeartGame} className="chibi-btn-primary px-6 py-3 text-lg flex items-center gap-2">
                        <Heart size={20} fill="white"/> Да!
                    </button>
                    {noCount < 5 && (
                        <motion.button 
                            onClick={handleNoClick}
                            style={{ scale: noButtonSize }}
                            className="chibi-btn-secondary px-6 py-3 text-lg"
                        >
                            Нет
                        </motion.button>
                    )}
                </div>
             </div>
        )}

        {gameState === 'playing' && (
            <div className="relative w-full h-[400px] bg-white/50 rounded-3xl border-4 border-pink-200 shadow-xl overflow-hidden">
                <div className="absolute top-4 left-0 w-full text-center z-10">
                    <p className="text-pink-600 font-fredoka font-bold bg-white/90 px-4 py-1 rounded-full inline-block">
                        Собери сердечки: {heartsCollected}/{HEARTS_TO_WIN}
                    </p>
                </div>
                {Array.from({ length: HEARTS_TO_WIN }).map((_, i) => (
                    <motion.button
                        key={i}
                        onClick={collectHeart}
                        initial={{ top: -100, left: `${Math.random() * 80 + 10}%` }}
                        animate={{ top: '120%', rotate: 360 }} 
                        transition={{ duration: Math.random() * 3 + 3, repeat: Infinity, ease: "linear", delay: Math.random() * 5 }}
                        className="absolute text-5xl cursor-pointer select-none p-2"
                    >
                        ❤️
                    </motion.button>
                ))}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-6xl animate-bounce">📦</div>
            </div>
        )}
      </div>
    </main>
  );
}