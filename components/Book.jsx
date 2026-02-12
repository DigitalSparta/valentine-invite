'use client';
import React, { forwardRef, useRef, useState, useEffect } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// ==========================================
// 🛠️ ТВОИ НАСТРОЙКИ 🛠️
// ==========================================

// 1. НАСТРОЙКА ВИДЕО
// Номера файлов, которые являются ВИДЕО (video5.mp4 и т.д.)
const videosConfig = [5, 12, 18]; 

// 2. ТВОЙ ТЕКСТ
const customPageTexts = [
    "Наше самое первое фото... Помнишь этот день?",
    "Твоя улыбка освещает всё вокруг ✨",
    "Смешной момент, но такой родной 😂",
    "Просто люблю быть рядом с тобой ❤️",
    "Наши приключения только начинаются! 🌍",
    "Ты — мое вдохновение каждый день.",
    // ... добавляй текст дальше
];

// ==========================================

const Page = forwardRef((props, ref) => {
  
  const renderMedia = (pageIndex) => {
    const mediaId = props.mediaOffset + pageIndex; 
    const isVideo = videosConfig.includes(mediaId);

    if (isVideo) {
      return (
        <video controls playsInline className="w-full h-full object-contain rounded-lg bg-black/5 shadow-inner">
            <source src={`/images/video${mediaId}.mp4`} type="video/mp4" />
        </video>
      );
    }
    return (
        <img 
            src={`/images/photo${mediaId}.jpg`} 
            alt={`Memory ${mediaId}`} 
            className="w-full h-full object-contain rounded-lg shadow-sm" 
            onError={(e) => e.target.style.display='none'} 
        />
    );
  };

  return (
    <div className="demoPage bg-[#fffdf7] border-r border-pink-100 shadow-inner p-3 h-full" ref={ref}>
        <div className="h-full flex flex-col justify-between rounded-2xl relative border-2 border-dashed border-pink-200 p-2 bg-white/50">
            
            {/* ВЕРХНЕЕ ФОТО */}
            <div className="flex-1 w-full chibi-frame bg-pink-50/30 flex items-center justify-center p-1 overflow-hidden">
                {renderMedia(0)}
            </div>

            {/* ТЕКСТ ПОСЕРЕДИНЕ */}
            <div className="my-2 min-h-[50px] flex items-center justify-center">
                <div className="w-full bg-yellow-50/80 border border-yellow-200 rounded-lg p-2 shadow-sm rotate-[-1deg]">
                    <p className="font-nunito text-xs sm:text-sm text-[#5d4037] text-center italic leading-relaxed">
                        {props.text || "..."}
                    </p>
                </div>
            </div>

            {/* НИЖНЕЕ ФОТО */}
            <div className="flex-1 w-full chibi-frame bg-blue-50/30 flex items-center justify-center p-1 overflow-hidden">
                 {renderMedia(1)}
            </div>

            {/* Номер страницы */}
            <div className="absolute bottom-1 right-2 text-pink-300 text-[10px] font-bold opacity-50">
                ~ {props.number} ~
            </div>
        </div>
    </div>
  );
});

Page.displayName = 'Page';

export default function Book() {
    const bookRef = useRef();
    const [isMobile, setIsMobile] = useState(false);

    // Проверяем размер экрана
    useEffect(() => {
        const checkSize = () => {
            setIsMobile(window.innerWidth < 768); // Если меньше 768px, считаем телефоном
        };
        checkSize();
        window.addEventListener('resize', checkSize);
        return () => window.removeEventListener('resize', checkSize);
    }, []);

    const nextFlip = () => bookRef.current.pageFlip().flipNext();
    const prevFlip = () => bookRef.current.pageFlip().flipPrev();

    // 16 страниц (32 слота)
    const pagesData = Array.from({ length: 16 }).map((_, i) => ({
        mediaOffset: i * 2 + 1,
        text: customPageTexts[i] || ""
    }));

    return (
        <div className="flex flex-col items-center justify-center relative z-10 w-full max-w-6xl mx-auto my-4">
            <div className="w-full flex justify-center overflow-hidden px-2">
                <HTMLFlipBook 
                    width={400} 
                    height={600} 
                    size="stretch" 
                    minWidth={300} 
                    maxWidth={1000} 
                    minHeight={400} 
                    maxHeight={1533} 
                    showCover={true} 
                    // ГЛАВНОЕ ИЗМЕНЕНИЕ: 
                    // Если мобильник (isMobile=true), включаем портретный режим (одна страница).
                    // Если комп, выключаем (две страницы).
                    usePortrait={isMobile} 
                    maxShadowOpacity={0.5} 
                    className="shadow-2xl" 
                    ref={bookRef}
                >
                    {/* ОБЛОЖКА */}
                    <div className="bg-pink-100 h-full w-full relative border-r-4 border-pink-300 rounded-r-lg">
                        <img 
                            src="/images/обложка.jpg" alt="Cover" className="w-full h-full object-cover"
                            onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }}
                        />
                        <div className="hidden absolute inset-0 bg-red-400 text-white flex-col items-center justify-center text-center p-4">
                             <h2 className="text-4xl font-bold font-fredoka mb-2">Love Story</h2>
                             <p className="font-nunito text-lg">Нажми стрелку &rarr;</p>
                        </div>
                    </div>

                    {/* СТРАНИЦЫ */}
                    {pagesData.map((page, index) => (
                        <Page key={index} number={index + 1} {...page} />
                    ))}

                    {/* ЗАДНЯЯ ОБЛОЖКА */}
                    <div className="bg-gradient-to-bl from-pink-400 to-red-400 text-white flex items-center justify-center h-full font-bold text-2xl text-center p-6 border-l-4 border-pink-300 rounded-l-lg font-fredoka">
                        Я люблю тебя ❤️<br/>Бесконечно
                    </div>
                </HTMLFlipBook>
            </div>

            {/* СТРЕЛКИ */}
            <div className="flex gap-12 mt-6 z-20">
                <button onClick={prevFlip} className="bg-white/90 text-pink-500 p-4 rounded-full shadow-[0_4px_0_#ffc8dd] hover:scale-110 active:scale-95 active:translate-y-1 transition border-2 border-pink-100">
                    <ChevronLeft size={32} />
                </button>
                <button onClick={nextFlip} className="bg-white/90 text-pink-500 p-4 rounded-full shadow-[0_4px_0_#ffc8dd] hover:scale-110 active:scale-95 active:translate-y-1 transition border-2 border-pink-100">
                    <ChevronRight size={32} />
                </button>
            </div>
        </div>
    );
}