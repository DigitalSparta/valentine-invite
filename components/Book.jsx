'use client';
import React, { forwardRef, useRef } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// --- НАСТРОЙКИ ВИДЕО ---
// Впиши сюда номера файлов, которые являются ВИДЕО.
// Например: [5, 12] значит, что video5.mp4 и video12.mp4 будут видео, а остальные - фото.
const videosConfig = [5, 10, 15, 20]; 

const Page = forwardRef((props, ref) => {
  
  // Функция, которая выбирает, показывать фото или видео
  const renderMedia = (pageIndex) => {
    // Вычисляем номер файла (1, 2, 3... 32)
    const mediaId = props.mediaOffset + pageIndex; 
    
    // Проверяем, есть ли этот номер в списке видео
    const isVideo = videosConfig.includes(mediaId);

    if (isVideo) {
      return (
        <video controls playsInline className="w-full h-full object-contain rounded-lg bg-black/5">
            {/* Код сам подставит video + номер */}
            <source src={`/images/video${mediaId}.mp4`} type="video/mp4" />
        </video>
      );
    }
    
    // Если не видео, то фото
    return (
        <img 
            src={`/images/photo${mediaId}.jpg`} 
            alt={`Memory ${mediaId}`} 
            className="w-full h-full object-contain rounded-lg" 
            onError={(e) => e.target.style.display='none'} 
        />
    );
  };

  return (
    <div className="demoPage bg-[#fffdf7] border-r border-pink-100 shadow-inner p-2 sm:p-4 h-full" ref={ref}>
        <div className="h-full flex flex-col justify-between rounded-xl relative border-2 border-dashed border-pink-200/50 p-1">
            
            {/* ВЕРХНИЙ БЛОК */}
            <div className="flex flex-col items-center gap-1 h-[48%] z-10">
                <div className="w-full h-full flex-1 chibi-frame bg-pink-50/50 flex items-center justify-center p-1">
                    {renderMedia(0)}
                </div>
                <p className="font-nunito text-[10px] sm:text-xs text-brown-700 text-center italic w-full bg-yellow-100/80 p-1 rounded shadow-sm leading-tight min-h-[20px] flex items-center justify-center">
                    {props.text1}
                </p>
            </div>

            {/* Номер страницы */}
            <div className="text-center text-pink-300 text-[10px] font-bold">~ {props.number} ~</div>

            {/* НИЖНИЙ БЛОК */}
            <div className="flex flex-col items-center gap-1 h-[48%] justify-end z-10">
                 <p className="font-nunito text-[10px] sm:text-xs text-brown-700 text-center italic w-full bg-blue-100/80 p-1 rounded shadow-sm leading-tight min-h-[20px] flex items-center justify-center">
                    {props.text2}
                </p>
                <div className="w-full h-full flex-1 chibi-frame bg-blue-50/50 flex items-center justify-center p-1">
                     {renderMedia(1)}
                </div>
            </div>
        </div>
    </div>
  );
});

Page.displayName = 'Page';

export default function Book() {
    const bookRef = useRef();
    const nextFlip = () => bookRef.current.pageFlip().flipNext();
    const prevFlip = () => bookRef.current.pageFlip().flipPrev();

    // ГЕНЕРАЦИЯ СТРАНИЦ
    // Ставим 16 страниц, чтобы вместить 32 фотографии (16 * 2 = 32)
    const pagesData = Array.from({ length: 16 }).map((_, i) => ({
        mediaOffset: i * 2 + 1, // Считает ID: 1, 3, 5...
        text1: `История №${i * 2 + 1}`,
        text2: `История №${i * 2 + 2}`
    }));

    return (
        <div className="flex flex-col items-center justify-center relative z-10 w-full max-w-6xl mx-auto my-4">
            <div className="w-full flex justify-center overflow-hidden">
                <HTMLFlipBook 
                    width={400} height={600} size="stretch" 
                    minWidth={300} maxWidth={1000} minHeight={400} maxHeight={1533} 
                    showCover={true} usePortrait={false} 
                    maxShadowOpacity={0.5} className="shadow-2xl" ref={bookRef}
                >
                    {/* ОБЛОЖКА */}
                    <div className="bg-pink-100 h-full w-full relative border-r-4 border-pink-300">
                        <img 
                            src="/images/обложка.jpg" alt="Cover" className="w-full h-full object-cover"
                            onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }}
                        />
                        <div className="hidden absolute inset-0 bg-red-400 text-white flex-col items-center justify-center text-center p-4">
                             <h2 className="text-3xl font-bold font-fredoka">Love Story</h2>
                             <p className="font-nunito">Нажми вперед &rarr;</p>
                        </div>
                    </div>

                    {/* СТРАНИЦЫ */}
                    {pagesData.map((page, index) => (
                        <Page key={index} number={index + 1} {...page} />
                    ))}

                    {/* ЗАДНЯЯ ОБЛОЖКА */}
                    <div className="bg-gradient-to-bl from-pink-400 to-red-400 text-white flex items-center justify-center h-full font-bold text-2xl text-center p-6 border-l-4 border-pink-300">
                        Я люблю тебя ❤️<br/>Бесконечно
                    </div>
                </HTMLFlipBook>
            </div>

            {/* КНОПКИ ЛИСТАНИЯ */}
            <div className="flex gap-12 mt-4 z-20">
                <button onClick={prevFlip} className="bg-white/90 text-pink-500 p-4 rounded-full shadow-xl hover:scale-110 active:scale-95 transition border-4 border-pink-200">
                    <ChevronLeft size={32} />
                </button>
                <button onClick={nextFlip} className="bg-white/90 text-pink-500 p-4 rounded-full shadow-xl hover:scale-110 active:scale-95 transition border-4 border-pink-200">
                    <ChevronRight size={32} />
                </button>
            </div>
        </div>
    );
}