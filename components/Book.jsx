'use client';
import React, { forwardRef, useRef } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Компонент страницы
const Page = forwardRef((props, ref) => {
  return (
    <div className="demoPage bg-[#fdfbf7] border-l border-gray-200 shadow-inner p-4 h-full" ref={ref}>
        <div className="h-full border-4 border-double border-pink-200 p-3 flex flex-col justify-between rounded-lg">
            
            {/* ВЕРХНИЙ БЛОК (Фото/Видео + Текст) */}
            <div className="flex flex-col items-center gap-2 h-1/2">
                <div className="w-full h-40 bg-pink-50 rounded-lg overflow-hidden border-[3px] border-white shadow-md relative group">
                    {/* Проверка: Видео или Картинка? */}
                    {props.media1Type === 'video' ? (
                        <video controls className="w-full h-full object-cover">
                            <source src={props.url1} type="video/mp4" />
                        </video>
                    ) : (
                        <img 
                            src={props.url1} 
                            alt="Memory 1" 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                            onError={(e) => e.target.style.display='none'} 
                        />
                    )}
                </div>
                <p className="font-serif text-sm text-gray-700 text-center italic w-full bg-white/50 p-1 rounded">
                    "{props.text1}"
                </p>
            </div>

            {/* Номер страницы */}
            <div className="text-center text-pink-300 text-xs font-bold">~ {props.number} ~</div>

            {/* НИЖНИЙ БЛОК (Текст + Фото/Видео) */}
            <div className="flex flex-col items-center gap-2 h-1/2 justify-end">
                 <p className="font-serif text-sm text-gray-700 text-center italic w-full bg-white/50 p-1 rounded">
                    "{props.text2}"
                </p>
                <div className="w-full h-40 bg-pink-50 rounded-lg overflow-hidden border-[3px] border-white shadow-md relative group">
                    {props.media2Type === 'video' ? (
                        <video controls className="w-full h-full object-cover">
                            <source src={props.url2} type="video/mp4" />
                        </video>
                    ) : (
                        <img 
                            src={props.url2} 
                            alt="Memory 2" 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                            onError={(e) => e.target.style.display='none'} 
                        />
                    )}
                </div>
            </div>
        </div>
    </div>
  );
});

Page.displayName = 'Page';

export default function Book() {
    const bookRef = useRef();

    // ФУНКЦИИ ДЛЯ СТРЕЛОК
    const nextFlip = () => bookRef.current.pageFlip().flipNext();
    const prevFlip = () => bookRef.current.pageFlip().flipPrev();

    // ДАННЫЕ СТРАНИЦ (Здесь ты меняешь текст, фото и выбираешь видео это или нет)
    const pagesData = [
        { 
            url1: '/images/photo1.jpg', media1Type: 'image', text1: 'Наше первое фото...',
            url2: '/images/photo2.jpg', media2Type: 'image', text2: 'Твоя улыбка здесь бесценна'
        },
        { 
            // ПРИМЕР С ВИДЕО (закинь video1.mp4 в папку public/images)
            url1: '/images/video1.mp4', media1Type: 'video', text1: 'Помнишь этот танец?',
            url2: '/images/photo3.jpg', media2Type: 'image', text2: 'Просто красивый момент'
        },
        // Создаем остальные страницы автоматически (или заполни вручную как выше)
        ...Array.from({ length: 8 }).map((_, i) => ({
            url1: `/images/photo${i + 4}.jpg`, media1Type: 'image', text1: 'Мои мысли о тебе...',
            url2: `/images/photo${i + 5}.jpg`, media2Type: 'image', text2: 'Ты делаешь меня счастливым'
        }))
    ];

    return (
        <div className="flex flex-col items-center justify-center relative z-10 w-full max-w-4xl mx-auto">
            {/* Сама КНИГА */}
            <HTMLFlipBook 
                width={320} 
                height={500} 
                showCover={true} 
                className="shadow-2xl"
                ref={bookRef}
                maxShadowOpacity={0.5}
            >
                {/* Обложка */}
                <div className="bg-red-500 text-white flex flex-col items-center justify-center h-full border-4 border-yellow-400 p-5 text-center shadow-xl rounded-r-lg">
                    <h2 className="text-5xl font-bold mb-4 font-serif text-yellow-300">Love Story</h2>
                    <p className="text-lg italic">Нажми стрелку внизу,<br/>чтобы открыть</p>
                    <div className="mt-10 text-7xl animate-pulse">❤️</div>
                </div>

                {/* Генерация страниц */}
                {pagesData.map((page, index) => (
                    <Page key={index} number={index + 1} {...page} />
                ))}

                {/* Задняя обложка */}
                <div className="bg-red-500 text-white flex items-center justify-center h-full border-4 border-yellow-400 p-10 font-bold text-3xl rounded-l-lg">
                    КОНЕЦ ❤️
                </div>
            </HTMLFlipBook>

            {/* СТРЕЛКИ УПРАВЛЕНИЯ (Снизу) */}
            <div className="flex gap-10 mt-6 z-20">
                <button 
                    onClick={prevFlip}
                    className="bg-white p-3 rounded-full shadow-lg text-pink-600 hover:bg-pink-100 hover:scale-110 transition flex items-center gap-2 font-bold"
                >
                    <ChevronLeft size={24} /> Назад
                </button>
                <button 
                    onClick={nextFlip}
                    className="bg-white p-3 rounded-full shadow-lg text-pink-600 hover:bg-pink-100 hover:scale-110 transition flex items-center gap-2 font-bold"
                >
                    Вперед <ChevronRight size={24} />
                </button>
            </div>
        </div>
    );
}