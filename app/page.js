'use client';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

// Динамический импорт книги (чтобы не было ошибок при сборке)
const Book = dynamic(() => import('../components/Book'), { ssr: false });

export default function Home() {
  const [noCount, setNoCount] = useState(0);
  const [yesPressed, setYesPressed] = useState(false);
  const [heartsCollected, setHeartsCollected] = useState(0);
  const [gameState, setGameState] = useState('idle'); // idle, playing, won

  // Логика кнопки НЕТ
  const handleNoClick = () => {
    if (noCount < 3) setNoCount(noCount + 1);
  };

  // Логика "Собрать сердечки"
  const startHeartGame = () => {
    setGameState('playing');
  };

  const collectHeart = () => {
    const newCount = heartsCollected + 1;
    setHeartsCollected(newCount);
    if (newCount >= 5) { // Нужно собрать 5 сердечек
      triggerWin();
    }
  };

  const triggerWin = () => {
    setGameState('won');
    setYesPressed(true);
    // Салют
    const duration = 3000;
    const end = Date.now() + duration;
    (function frame() {
      confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 } });
      confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 } });
      if (Date.now() < end) requestAnimationFrame(frame);
    }());
  };

  // Размер кнопки НЕТ
  const noButtonSize = 1 - noCount * 0.3; 

  if (yesPressed) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-pink-100 p-4 text-center">
        <motion.div 
            initial={{ scale: 0 }} 
            animate={{ scale: 1 }} 
            className="text-4xl text-red-600 font-bold mb-4"
        >
            УРА! ТЫ СОГЛАСИЛАСЬ! ❤️
        </motion.div>
        
        {/* Танцующий кот */}
        <img src="/images/cat-dance.gif" alt="Dancing Cat" className="w-64 h-64 rounded-lg shadow-xl mb-6" />

        <div className="bg-white p-6 rounded-xl shadow-lg max-w-md">
            <h2 className="text-2xl font-bold mb-4 text-pink-600">Приглашение</h2>
            <p className="text-gray-700 mb-4">
                Жду тебя на свидании в нашей онлайн-игре. Я создал там особый мир для нас.
            </p>
            <p className="text-sm text-gray-500 mb-6">
                Можно зайти с ноутбука или ПК.
            </p>
            <a 
                href="https://wa.me/79000000000?text=Привет!%20Я%20готова%20встретиться%20в%20игре%20в..." 
                target="_blank"
                className="bg-green-500 text-white px-6 py-3 rounded-full font-bold hover:bg-green-600 transition"
            >
                Написать мне в WhatsApp время 🕒
            </a>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center bg-pink-50 overflow-hidden relative">
      {/* Музыка (скрытый автоплей часто блочат, лучше добавить кнопку, но пока так) */}
      <audio autoPlay loop src="/music/bg-music.mp3" />

      <h1 className="text-3xl md:text-5xl font-bold text-pink-600 mt-8 mb-4 text-center handwritten">
        Наша История Любви
      </h1>

      {/* Книга */}
      <div className="z-10 mb-8">
        <Book />
      </div>

      {/* Интерактивная зона */}
      <div className="z-20 flex flex-col items-center gap-4 mb-10 w-full max-w-2xl px-4">
        
        {/* ИГРА С СЕРДЕЧКАМИ */}
        {gameState === 'idle' && (
             <div className="text-center">
                <p className="text-lg text-gray-700 mb-4 font-semibold">
                    Ты почувствовала тепло? Интересно, что дальше?
                </p>
                <div className="flex gap-4 justify-center items-center">
                    <button 
                        onClick={startHeartGame}
                        className="bg-red-500 text-white px-6 py-2 rounded-full font-bold shadow-lg hover:scale-105 transition"
                    >
                        Собери сердечки в коробку ❤️
                    </button>

                    {/* Кнопка НЕТ */}
                    {noCount < 3 ? (
                        <motion.button 
                            onClick={handleNoClick}
                            style={{ scale: noButtonSize }}
                            className="bg-gray-400 text-white px-6 py-2 rounded-full font-bold shadow-lg"
                        >
                            НЕТ
                        </motion.button>
                    ) : (
                        <div className="flex flex-col items-center">
                            <img src="/images/cat-cry.gif" alt="Crying Cat" className="w-20 h-20" />
                            <span className="text-red-600 font-bold">НУ ПОЖАЛУЙСТАААА!!!</span>
                        </div>
                    )}
                </div>
             </div>
        )}

        {/* Процесс игры */}
        {gameState === 'playing' && (
            <div className="relative w-full h-40 bg-white/50 rounded-xl border-2 border-pink-300 p-4">
                <p className="text-center text-pink-600 mb-2">Кликай по сердечкам, чтобы собрать их! ({heartsCollected}/5)</p>
                {/* Генерация сердечек в случайных местах */}
                {Array.from({ length: 5 }).map((_, i) => (
                    heartsCollected <= i && (
                        <motion.button
                            key={i}
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={collectHeart}
                            initial={{ x: Math.random() * 200 - 100, y: Math.random() * 50 }}
                            animate={{ y: [0, -10, 0] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="absolute text-4xl cursor-pointer"
                            style={{ 
                                left: `${20 + i * 15}%`, 
                                top: '50%' 
                            }}
                        >
                            ❤️
                        </motion.button>
                    )
                ))}
                {/* Коробка */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-5xl">
                    📦
                </div>
            </div>
        )}

      </div>
    </main>
  );
}