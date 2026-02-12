'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Heart, Gift } from 'lucide-react'; // Добавляем иконки

const Book = dynamic(() => import('../components/Book'), { ssr: false });

export default function Home() {
  const [noCount, setNoCount] = useState(0);
  const [yesPressed, setYesPressed] = useState(false);
  const [heartsCollected, setHeartsCollected] = useState(0);
  const [gameState, setGameState] = useState('idle'); 
  
  const HEARTS_TO_WIN = 15; 

  const handleNoClick = () => {
    if (noCount < 5) setNoCount(noCount + 1);
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

  // --- ЭКРАН ПОБЕДЫ (Финальный) ---
  if (yesPressed) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center overflow-hidden relative">
        {/* Фоновые элементы */}
        <div className="absolute top-10 left-10 text-pink-300 animate-pulse"><Heart size={60} /></div>
        <div className="absolute bottom-10 right-10 text-blue-300 animate-pulse delay-500"><Heart size={60} /></div>

        <motion.div initial={{ scale: 0, rotate: -10 }} animate={{ scale: 1, rotate: 0 }} className="text-5xl md:text-6xl text-red-500 font-fredoka font-bold mb-6 drop-shadow-[0_4px_0_#ffc8dd] flex items-center gap-3">
            <Heart fill="currentColor" size={48} className="animate-bounce"/> УРА! ТЫ СОГЛАСИЛАСЬ! <Heart fill="currentColor" size={48} className="animate-bounce delay-100"/>
        </motion.div>

        <div className="chibi-box p-8 max-w-lg w-full mx-4 relative mt-10">
             {/* Кот выглядывает сверху */}
            <img src="/images/cat-dance.gif" alt="Dancing" className="w-48 h-48 absolute -top-32 left-1/2 -translate-x-1/2 z-10 drop-shadow-2xl" />
            
            <h2 className="text-3xl font-fredoka font-bold mb-4 text-pink-600 mt-10">Приглашение на Свидание</h2>
            <p className="text-brown-600 mb-8 text-xl font-nunito bg-pink-50 p-4 rounded-xl border-2 border-pink-100 italic">
                Встретимся в нашем уютном мире. Я подготовил для нас особенную игру!
                <br/><br/>
                <span className="text-base text-gray-500 not-italic">👉 (Лучше заходить с компьютера)</span>
            </p>
            <a href="https://wa.me/77000000000" target="_blank" className="chibi-btn-primary w-full py-4 text-xl flex justify-center items-center gap-3 no-underline">
                <Gift size={24}/> Написать мне в WhatsApp
            </a>
        </div>
      </div>
    );
  }

  // --- ОСНОВНОЙ ЭКРАН ---
  return (
    <main className="min-h-screen flex flex-col items-center overflow-x-hidden relative pb-32 px-4">
      
      {/* Пухлый заголовок */}
      <h1 className="text-5xl md:text-7xl font-fredoka font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-red-400 mt-12 mb-2 text-center z-20 drop-shadow-[0_5px_0_#fff]">
        Наша История Любви
      </h1>
      <p className="font-nunito text-xl text-pink-400 mb-6 bg-white/60 px-6 py-2 rounded-full">Листай альбом воспоминаний 👇</p>

      {/* КНИГА */}
      <Book />

      {/* ИГРОВАЯ ЗОНА */}
      <div className="z-20 w-full max-w-2xl mt-10">
        
        {/* Начало игры */}
        {gameState === 'idle' && (
             <div className="chibi-box p-10 text-center relative">
                {/* Декор */}
                <div className="absolute -top-5 -left-5 text-yellow-400 rotate-[-20deg]"><Heart fill="currentColor" size={50}/></div>
                
                <p className="text-3xl text-brown-700 mb-8 font-fredoka">
                    Почувствовала тепло? <br/>Узнай, что дальше! 😻
                </p>
                <div className="flex gap-6 justify-center items-center flex-wrap">
                    <button 
                        onClick={startHeartGame} 
                        className="chibi-btn-primary px-8 py-4 text-xl animate-pulse flex items-center gap-2"
                    >
                        <Gift size={24}/> Собрать сердечки
                    </button>

                    {/* Кнопка НЕТ */}
                    {noCount < 5 ? (
                        <motion.button 
                            onClick={handleNoClick}
                            style={{ scale: noButtonSize }}
                            className="chibi-btn-secondary px-8 py-4 text-xl whitespace-nowrap"
                        >
                            {noCount === 0 ? "Нет" : 
                             noCount === 1 ? "Точно нет?" :
                             noCount === 2 ? "Ну подумай..." :
                             noCount === 3 ? "Серьезно?!" : "Разбиваешь сердце! 💔"}
                        </motion.button>
                    ) : (
                        <div className="flex flex-col items-center animate-bounce bg-red-100 p-4 rounded-2xl border-2 border-red-300">
                            <img src="/images/cat-cry.gif" alt="Cry" className="w-28 h-28" />
                            <span className="text-red-500 font-fredoka font-bold mt-2 text-xl">НУ ПОЖАЛУЙСТАААА!!! 😭</span>
                        </div>
                    )}
                </div>
             </div>
        )}

        {/* ИГРОВОЕ ПОЛЕ-ОБЛАКО */}
        {gameState === 'playing' && (
            <div className="relative w-full h-[500px] bg-gradient-to-b from-blue-100 to-pink-100 rounded-[3rem] border-[6px] border-white shadow-[0_10px_20px_rgba(160,196,255,0.5)] overflow-hidden cursor-crosshair">
                
                <div className="absolute top-6 left-1/2 -translate-x-1/2 text-center z-10 w-full">
                    <p className="text-pink-600 font-fredoka font-bold text-2xl bg-white/80 px-6 py-2 rounded-full shadow-sm border-2 border-pink-200 inline-flex items-center gap-2">
                        <Heart fill="currentColor" className="text-red-400"/> Поймай их все! ({heartsCollected}/{HEARTS_TO_WIN})
                    </p>
                </div>
                
                {/* Падающие милые сердечки */}
                {Array.from({ length: HEARTS_TO_WIN }).map((_, i) => (
                    <motion.button
                        key={i}
                        onClick={collectHeart}
                        initial={{ top: -150, left: `${Math.random() * 85 + 5}%` }}
                        animate={{ top: '120%', rotate: [0, 360] }} 
                        transition={{ duration: Math.random() * 5 + 4, repeat: Infinity, ease: "linear", delay: Math.random() * 3 }}
                        className="absolute p-4 filter drop-shadow-md hover:scale-110 transition select-none"
                        style={{ fontSize: `${Math.random() * 30 + 40}px` }}
                    >
                        {['💖', '💝', '💘', '💗'][Math.floor(Math.random() * 4)]}
                    </motion.button>
                ))}
                
                {/* Милая коробка внизу */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-8xl z-0 opacity-90 drop-shadow-xl animate-bounce">
                    🎁
                </div>
                {/* Облака на фоне */}
                 <div className="absolute bottom-0 left-0 w-full h-32 bg-white/40 rounded-t-[50%] blur-xl"></div>
            </div>
        )}
      </div>
    </main>
  );
}