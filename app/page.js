'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

// Импорт книги (SSR отключен для корректной работы)
const Book = dynamic(() => import('../components/Book'), { ssr: false });

export default function Home() {
  const [noCount, setNoCount] = useState(0);
  const [yesPressed, setYesPressed] = useState(false);
  const [heartsCollected, setHeartsCollected] = useState(0);
  const [gameState, setGameState] = useState('idle'); 
  
  // ЦЕЛЬ ИГРЫ: Собрать 15 сердечек
  const HEARTS_TO_WIN = 15; 

  const handleNoClick = () => {
    if (noCount < 5) setNoCount(noCount + 1);
  };

  const startHeartGame = () => {
    setGameState('playing');
    setHeartsCollected(0);
  };

  const collectHeart = (e) => {
    // Исчезновение сердечка при клике
    e.target.style.transform = "scale(0)";
    e.target.style.opacity = "0";
    setTimeout(() => {
         e.target.style.display = 'none';
    }, 300);

    const newCount = heartsCollected + 1;
    setHeartsCollected(newCount);
    
    if (newCount >= HEARTS_TO_WIN) { 
      triggerWin();
    }
  };

  const triggerWin = () => {
    setGameState('won');
    // Запускаем конфетти и переключаем экран через 1 сек
    const duration = 3000;
    const end = Date.now() + duration;
    (function frame() {
      confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 } });
      confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 } });
      if (Date.now() < end) requestAnimationFrame(frame);
    }());
    
    setTimeout(() => setYesPressed(true), 1000);
  };

  const noButtonSize = 1 - noCount * 0.15; 

  // ЭКРАН ПОБЕДЫ (Свидание)
  if (yesPressed) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-pink-100 p-4 text-center overflow-hidden">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-4xl text-red-600 font-bold mb-6">
            УРА! ТЫ СОГЛАСИЛАСЬ! ❤️
        </motion.div>
        <img src="/images/cat-dance.gif" alt="Dancing" className="w-64 h-64 rounded-lg shadow-xl mb-6 object-cover border-4 border-white" />
        <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-lg w-full border-2 border-pink-200">
            <h2 className="text-3xl font-bold mb-4 text-pink-600 font-serif">Приглашение на Свидание</h2>
            <p className="text-gray-700 mb-6 text-lg">
                Встретимся в нашем мире. Это будет особенный вечер в онлайн-игре, которую я подготовил.
                <br/><br/>
                <span className="text-sm text-gray-500">(Заходи с ноутбука или ПК для полной атмосферы)</span>
            </p>
            <a href="https://wa.me/77000000000?text=Привет!%20Я%20собрала%20все%20сердечки!%20Давай%20встретимся%20в..." target="_blank" className="block w-full bg-green-500 text-white py-4 rounded-xl font-bold hover:bg-green-600 transition shadow-lg text-xl">
                Написать мне в WhatsApp 💬
            </a>
        </div>
      </div>
    );
  }

  // ЭКРАН КНИГИ И ИГРЫ
  return (
    <main className="min-h-screen flex flex-col items-center bg-[#ffe4e6] overflow-x-hidden relative pb-20">
      
      {/* Заголовок */}
      <h1 className="text-4xl md:text-6xl font-bold text-pink-600 mt-10 mb-6 text-center z-20 font-serif drop-shadow-sm">
        История Любви
      </h1>

      {/* КНИГА (Отступ снизу mb-20 чтобы не наезжала) */}
      <div className="z-10 mb-20 w-full flex justify-center scale-90 md:scale-100">
        <Book />
      </div>

      {/* ИГРОВАЯ ЗОНА (Контейнер) */}
      <div className="z-20 w-full max-w-2xl px-4 flex flex-col items-center">
        
        {/* Начало игры */}
        {gameState === 'idle' && (
             <div className="text-center bg-white/60 backdrop-blur-md p-8 rounded-3xl shadow-2xl border-2 border-white w-full">
                <p className="text-2xl text-gray-800 mb-8 font-serif italic">
                    Ты почувствовала тепло? <br/>Интересно, что будет дальше?
                </p>
                <div className="flex gap-6 justify-center items-center flex-wrap">
                    <button 
                        onClick={startHeartGame} 
                        className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-8 py-4 rounded-full font-bold shadow-xl hover:scale-105 transition animate-pulse text-lg"
                    >
                        Собрать сердечки в коробку ❤️
                    </button>

                    {/* Кнопка НЕТ */}
                    {noCount < 5 ? (
                        <motion.button 
                            onClick={handleNoClick}
                            style={{ scale: noButtonSize }}
                            className="bg-gray-400 text-white px-8 py-4 rounded-full font-bold shadow-xl whitespace-nowrap text-lg hover:bg-gray-500 transition"
                        >
                            {noCount === 0 ? "Нет" : "Точно нет?"}
                        </motion.button>
                    ) : (
                        <div className="flex flex-col items-center animate-bounce">
                            <img src="/images/cat-cry.gif" alt="Cry" className="w-24 h-24 rounded-full border-4 border-red-500" />
                            <span className="text-red-600 font-bold mt-2 bg-white px-2 py-1 rounded">НУ ПОЖАЛУЙСТАААА!!! 😭</span>
                        </div>
                    )}
                </div>
             </div>
        )}

        {/* Процесс игры (БОЛЬШОЕ ПОЛЕ) */}
        {gameState === 'playing' && (
            <div className="relative w-full h-[500px] bg-white/80 rounded-3xl border-4 border-pink-300 shadow-2xl overflow-hidden cursor-crosshair">
                <div className="absolute top-4 left-0 w-full text-center z-10">
                    <p className="text-pink-600 font-bold text-xl bg-white/80 inline-block px-4 py-1 rounded-full shadow-sm">
                        Собери их все! ({heartsCollected}/{HEARTS_TO_WIN})
                    </p>
                </div>
                
                {/* Генерация сердечек */}
                {Array.from({ length: HEARTS_TO_WIN }).map((_, i) => (
                    <motion.button
                        key={i}
                        onClick={collectHeart}
                        initial={{ 
                            top: -100, 
                            left: `${Math.random() * 90}%` // Случайная позиция по ширине
                        }}
                        animate={{ 
                            top: '110%', // Падают вниз до конца
                            rotate: 360 
                        }} 
                        transition={{ 
                            duration: Math.random() * 5 + 3, // Разная скорость (от 3 до 8 сек)
                            repeat: Infinity, 
                            ease: "linear",
                            delay: Math.random() * 5 // Разная задержка появления
                        }}
                        className="absolute text-5xl cursor-pointer hover:scale-125 active:scale-90 select-none p-2"
                    >
                        ❤️
                    </motion.button>
                ))}
                
                {/* Коробка внизу */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-7xl z-0 opacity-80 drop-shadow-lg">
                    📦
                </div>
            </div>
        )}
      </div>
    </main>
  );
}