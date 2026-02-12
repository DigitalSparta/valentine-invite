'use client';
import React, { forwardRef, useRef } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { ChevronLeft, ChevronRight, Heart } from 'lucide-react';

const Page = forwardRef((props, ref) => {
  // Функция для отрисовки контента
  const renderMedia = (url, type) => {
    if (type === 'video') {
      return (
        // playsInline важно для iPhone
        <video controls playsInline className="w-full h-full object-contain rounded-lg bg-black/5">
            <source src={url} type="video/mp4" />
        </video>
      );
    }
    // По умолчанию - картинка
    return (
        <img 
            src={url} 
            alt="Memory" 
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
                {/* Рамка 1 */}
                <div className="w-full h-full flex-1 chibi-frame bg-pink-50/50 flex items-center justify-center p-1">
                    {renderMedia(props.url1, props.media1Type)}
                </div>
                {/* Текст 1 */}
                <p className="font-nunito text-[10px] sm:text-xs text-brown-700 text-center italic w-full bg-yellow-100/80 p-1 rounded shadow-sm leading-tight min-h-[20px] flex items-center justify-center">
                    {props.text1}
                </p>
            </div>

            {/* Номер страницы */}
            <div className="text-center text-pink-300 text-[10px] font-bold">~ {props.number} ~</div>

            {/* НИЖНИЙ БЛОК */}
            <div className="flex flex-col items-center gap-1 h-[48%] justify-end z-10">
                {/* Текст 2 */}
                 <p className="font-nunito text-[10px] sm:text-xs text-brown-700 text-center italic w-full bg-blue-100/80 p-1 rounded shadow-sm leading-tight min-h-[20px] flex items-center justify-center">
                    {props.text2}
                </p>
                {/* Рамка 2 */}
                <div className="w-full h-full flex-1 chibi-frame bg-blue-50/50 flex items-center justify-center p-1">
                     {renderMedia(props.url2, props.media2Type)}
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

    // ДАННЫЕ СТРАНИЦ
    const pagesData = [
        { 
            // Страница 1
            url1: '/images/photo1.jpg', media1Type: 'image', text1: 'Наше начало...',
            url2: '/images/photo2.jpg', media2Type: 'image', text2: 'Первая улыбка'
        },
        { 
            // Страница 2 (ВИДЕО)
            url1: '/images/video1.mp4', media1Type: 'video', text1: 'Живой момент',
            url2: '/images/photo3.jpg', media2Type: 'image', text2: 'Тепло рядом'
        },
        // ... генерируем остальные страницы
        ...Array.from({ length: 8 }).map((_, i) => ({
            url1: `/images/photo${i + 4}.jpg`, media1Type: 'image', text1: 'Воспоминание ' + (i+1),
            url2: `/images/photo${i + 5}.jpg`, media2Type: 'image', text2: 'Счастье ' + (i+1)
        }))
    ];

    return (
        <div className="flex flex-col items-center justify-center relative z-10 w-full max-w-6xl mx-auto my-4">
            {/* Обертка для адаптивности */}
            <div className="w-full flex justify-center overflow-hidden">
                <HTMLFlipBook 
                    width={400}     // Ширина одной страницы (разворот будет 800)
                    height={600}    // Высота
                    size="stretch"  // Растягивать под контейнер
                    minWidth={300}  // Минимальная ширина
                    maxWidth={1000} 
                    minHeight={400} 
                    maxHeight={1533} 
                    showCover={true} 
                    usePortrait={false} // <--- ВАЖНО: Всегда 2 страницы (разворот)
                    maxShadowOpacity={0.5}
                    className="shadow-2xl"
                    ref={bookRef}
                >
                    {/* ОБЛОЖКА (Теперь она тоже часть разворота справа, слева пусто) */}
                    <div className="bg-pink-100 h-full w-full relative border-r-4 border-pink-300">
                        <img 
                            src="/images/обложка.jpg" 
                            alt="Cover" 
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }}
                        />
                        <div className="hidden absolute inset-0 bg-red-400 text-white flex-col items-center justify-center text-center p-4">
                             <h2 className="text-3xl font-bold font-fredoka">Love Story</h2>
                             {/* ВОТ ТУТ БЫЛА ОШИБКА, Я ИСПРАВИЛ НА &rarr; */}
                             <p className="font-nunito">Нажми вперед &rarr;</p>
                        </div>
                    </div>

                    {/* ГЕНЕРАЦИЯ СТРАНИЦ */}
                    {pagesData.map((page, index) => (
                        <Page key={index} number={index + 1} {...page} />
                    ))}

                    {/* ЗАДНЯЯ ОБЛОЖКА */}
                    <div className="bg-gradient-to-bl from-pink-400 to-red-400 text-white flex items-center justify-center h-full font-bold text-2xl text-center p-6 border-l-4 border-pink-300">
                        Я люблю тебя ❤️<br/>Бесконечно
                    </div>
                </HTMLFlipBook>
            </div>

            {/* СТРЕЛКИ (Большие и удобные) */}
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