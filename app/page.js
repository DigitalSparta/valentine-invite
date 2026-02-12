'use client';
import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Heart, Gift, Music } from 'lucide-react';

const Book = dynamic(() => import('../components/Book'), { ssr: false });

export default function Home() {
  const [noCount, setNoCount] = useState(0);
  const [yesPressed, setYesPressed] = useState(false);
  const [heartsCollected, setHeartsCollected] = useState(0);
  const [gameState, setGameState] = useState('idle'); 
  const [isMobile, setIsMobile] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false); // Для музыки
  const audioRef = useRef(null);
  
  const HEARTS_TO_WIN = 15; 

  // ФРАЗЫ ДЛЯ КНОПКИ "НЕТ"
  const noPhrases = [
    "Нет",
    "Ты серьезно?",
    "Уверена?",
    "Не делай этого!",
    "Разбиваешь сердце! 💔",
    "Ну пожалуйста..." 
  ];

  // Получаем текущую фразу (если кликов больше, берем последнюю)
  const getNoText = () => {
    return noPhrases[Math.min(noCount, noPhrases.length - 1)];
  };

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Логика музыки
  const toggleMusic = () => {
    if (audioRef.current) {
        if (isPlaying) audioRef.current.pause();
        else audioRef.current.play();
        setIsPlaying(!isPlaying);
    }
  };

  const handleNoClick = () => {
     setNoCount(noCount + 1);
  };

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
    // Салют
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

  // --- ЭКРАН ПОБЕДЫ ---
  if (yesPressed) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center bg-pink-50">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-4xl md:text-6xl text-red-500 font-fredoka font-bold mb-6">
            УРА! ❤️
        </motion.div>
        <div className="chibi-box p-6 max-w-md w-full mx-auto relative mt-10">
            {/* СЧАСТЛИВЫЙ КОТ */}
            <img src="/images/Happy Happy Dancing GIF.gif" alt="Dancing" className="w-48 h-48 mx-auto mb-4 rounded-xl border-4 border-white shadow-lg object-cover" />
            
            <h2 className="text-2xl font-fredoka font-bold mb-2 text-pink-600">Свидание</h2>
            <p className="text-brown-600 mb-6 font-nunito">
                Встретимся в нашей игре! Скажи во сколько тебе будет удобно в 14 февраля встретится со мною в нашей онлайн игре.
            </p>
            <a href="https://wa.me/87066842110" className="chibi-btn-primary w-full py-3 text-lg flex justify-center items-center gap-2 no-underline">
                <Gift size={20}/> Написать мне
            </a>
        </div>
      </div>
    );
  }

  // --- ОСНОВНОЙ ЭКРАН ---
  return (
    <main className="min-h-screen flex flex-col items-center overflow-x-hidden relative pb-10 px-2 bg-[#fff0f5]">
      
      {/* МУЗЫКА (Скрытый плеер + Кнопка) */}
      <audio ref={audioRef} loop src="/music.mp3" />
      <button 
        onClick={toggleMusic}
        className="fixed top-4 right-4 z-50 bg-white/80 p-3 rounded-full shadow-lg border-2 border-pink-200 hover:scale-110 transition"
      >
        {isPlaying ? "🔇" : "🎵 Включить музыку"}
      </button>

      {isMobile && (
        <div className="w-full bg-blue-100 text-blue-600 text-xs text-center py-1 font-bold animate-pulse mt-12 md:mt-0">
            💡 Совет: Поверни телефон горизонтально! 🔄
        </div>
      )}

      <h1 className="text-4xl md:text-6xl font-fredoka font-black text-pink-500 mt-16 md:mt-4 mb-2 text-center drop-shadow-sm">
        Love Story
      </h1>

      <div className="w-full flex-1 flex items-center justify-center">
        <Book />
      </div>

      <div className="z-20 w-full max-w-xl mt-4 mb-8">
        {gameState === 'idle' && (
             <div className="chibi-box p-6 text-center">
                <p className="text-xl text-brown-700 mb-4 font-fredoka">
                    Почувствовала тепло❤️?
                </p>
                <div className="flex gap-4 justify-center items-center flex-wrap min-h-[60px]">
                    <button onClick={startHeartGame} className="chibi-btn-primary px-6 py-3 text-lg flex items-center gap-2">
                        <Heart size={20} fill="white"/> Да!
                    </button>
                    
                    {/* КНОПКА НЕТ */}
                    {noCount < 5 ? (
                        <motion.button 
                            onClick={handleNoClick}
                            style={{ scale: noButtonSize }}
                            className="chibi-btn-secondary px-6 py-3 text-lg transition-all"
                            whileTap={{ x: [0, -5, 5, -5, 5, 0] }}
                        >
                            {getNoText()}
                        </motion.button>
                    ) : (
                        // ПЛАЧУЩИЙ КОТ
                        <div className="flex flex-col items-center animate-bounce w-full">
                            <img src="/images/Sad Cat GIF.gif" alt="Cry" className="w-32 h-32 object-cover rounded-full border-4 border-red-300" />
                            <span className="text-red-500 font-fredoka font-bold mt-2 text-xl bg-white/80 px-4 py-1 rounded-full shadow">
                                нууу пожалуййста... 😭
                            </span>
                        </div>
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