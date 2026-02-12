'use client';
import React, { forwardRef, useRef } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { ChevronLeft, ChevronRight, Heart } from 'lucide-react';

// Компонент страницы в стиле скрапбукинга
const Page = forwardRef((props, ref) => {
  return (
    // Фон страницы как кремовая бумага
    <div className="demoPage bg-[#fffdf7] border-r-2 border-pink-100 shadow-inner p-5 h-full" ref={ref}>
        <div className="h-full flex flex-col justify-between rounded-xl relative">
            {/* Декоративные элементы (наклейки) */}
            <div className="absolute top-0 left-0 text-pink-200 opacity-50"><Heart size={20} fill="currentColor" /></div>
            <div className="absolute bottom-0 right-0 text-blue-200 opacity-50 rotate-45"><Heart size={24} fill="currentColor"/></div>

            {/* ВЕРХНИЙ БЛОК */}
            <div className="flex flex-col items-center gap-3 h-1/2 z-10">
                {/* Chibi-рамка для фото */}
                <div className="w-full h-40 chibi-frame bg-pink-50 group relative">
                    {props.media1Type === 'video' ? (
                        <video controls className="w-full h-full object-cover rounded-xl">
                            <source src={props.url1} type="video/mp4" />
                        </video>
                    ) : (
                        <img 
                            src={props.url1} 
                            alt="Memory 1" 
                            className="w-full h-full object-cover rounded-xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-2" 
                            onError={(e) => e.target.style.display='none'} 
                        />
                    )}
                </div>
                {/* Текст как заметка на стикере */}
                <p className="font-nunito text-sm text-brown-700 text-center italic w-[90%] bg-yellow-100/80 p-2 rounded-lg shadow-sm rotate-[-1deg]">
                    "{props.text1}"
                </p>
            </div>

            {/* Номер страницы в сердечке */}
            <div className="text-center text-pink-400 text-sm font-fredoka flex justify-center items-center gap-1">
                <Heart size={12} fill="currentColor"/> {props.number} <Heart size={12} fill="currentColor"/>
            </div>

            {/* НИЖНИЙ БЛОК */}
            <div className="flex flex-col items-center gap-3 h-1/2 justify-end z-10">
                 <p className="font-nunito text-sm text-brown-700 text-center italic w-[90%] bg-blue-100/80 p-2 rounded-lg shadow-sm rotate-[1deg]">
                    "{props.text2}"
                </p>
                <div className="w-full h-40 chibi-frame bg-blue-50 group relative">
                    {props.media2Type === 'video' ? (
                        <video controls className="w-full h-full object-cover rounded-xl">
                            <source src={props.url2} type="video/mp4" />
                        </video>
                    ) : (
                        <img 
                            src={props.url2} 
                            alt="Memory 2" 
                            className="w-full h-full object-cover rounded-xl transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-2" 
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
    const nextFlip = () => bookRef.current.pageFlip().flipNext();
    const prevFlip = () => bookRef.current.pageFlip().flipPrev();

    const pagesData = [
        { 
            url1: '/images/photo1.jpg', media1Type: 'image', text1: 'Наше первое фото...',
            url2: '/images/photo2.jpg', media2Type: 'image', text2: 'Твоя улыбка здесь бесценна'
        },
        // Добавь свои фото сюда...
        ...Array.from({ length: 8 }).map((_, i) => ({
            url1: `/images/photo${i + 4}.jpg`, media1Type: 'image', text1: 'Милый момент №' + (i+1),
            url2: `/images/photo${i + 5}.jpg`, media2Type: 'image', text2: 'Люблю тебя!'
        }))
    ];

    return (
        <div className="flex flex-col items-center justify-center relative z-10 w-full max-w-4xl mx-auto my-10">
            {/* Сама КНИГА в "мягкой обложке" */}
            <div className="p-4 bg-pink-200 rounded-[3rem] shadow-xl relative">
                 {/* Декоративные элементы вокруг книги */}
                 <div className="absolute -top-6 -left-6 text-yellow-300 animate-bounce"><Heart size={40} fill="currentColor"/></div>
                 <div className="absolute -bottom-6 -right-6 text-blue-300 animate-bounce delay-300"><Heart size={40} fill="currentColor"/></div>

                <HTMLFlipBook 
                    width={320} 
                    height={500} 
                    showCover={true} 
                    className="shadow-2xl rounded-2xl overflow-hidden border-4 border-white"
                    ref={bookRef}
                    maxShadowOpacity={0.3}
                    bgCheckerColor="#fffdf7"
                >
                    {/* ОБЛОЖКА (Красная) */}
                     <div className="bg-gradient-to-br from-red-400 to-pink-500 text-white flex flex-col items-center justify-center h-full p-5 text-center">
                        <div className="border-8 border-dashed border-yellow-200 p-8 rounded-3xl">
                            <h2 className="text-5xl font-fredoka mb-4 text-yellow-100 drop-shadow-md">Love Story</h2>
                            <p className="text-xl font-nunito italic bg-white/20 px-4 py-2 rounded-full">Альбом для тебя</p>
                            <div className="mt-10 text-8xl animate-pulse filter drop-shadow-lg">💖</div>
                        </div>
                        <p className="text-sm mt-4 opacity-80">(Нажми на стрелочку внизу)</p>
                    </div>

                    {/* Страницы */}
                    {pagesData.map((page, index) => (
                        <Page key={index} number={index + 1} {...page} />
                    ))}

                    {/* Задняя обложка */}
                    <div className="bg-gradient-to-bl from-red-400 to-pink-500 text-white flex items-center justify-center h-full p-10 font-fredoka text-3xl text-center">
                        <div className="border-8 border-dashed border-yellow-200 p-10 rounded-full bg-white/10 backdrop-blur-md transform rotate-[-5deg]">
                            Ты моё<br/>Счастье! 😻
                        </div>
                    </div>
                </HTMLFlipBook>
            </div>

            {/* СТРЕЛКИ-ЛЕДЕНЦЫ */}
            <div className="flex gap-8 mt-8 z-20">
                <button 
                    onClick={prevFlip}
                    className="bg-white text-pink-500 p-4 rounded-full shadow-[0_6px_0_#ffc8dd] hover:translate-y-1 hover:shadow-[0_2px_0_#ffc8dd] transition-all border-4 border-pink-200 flex items-center font-fredoka font-bold text-lg group"
                >
                    <ChevronLeft size={28} className="group-hover:-translate-x-1 transition" /> Туда
                </button>
                <button 
                    onClick={nextFlip}
                    className="bg-white text-pink-500 p-4 rounded-full shadow-[0_6px_0_#ffc8dd] hover:translate-y-1 hover:shadow-[0_2px_0_#ffc8dd] transition-all border-4 border-pink-200 flex items-center font-fredoka font-bold text-lg group"
                >
                    Сюда <ChevronRight size={28} className="group-hover:translate-x-1 transition" />
                </button>
            </div>
        </div>
    );
}