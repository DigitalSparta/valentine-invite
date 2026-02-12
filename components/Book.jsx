'use client';
import React, { forwardRef } from 'react';
import HTMLFlipBook from 'react-pageflip';

// Шаблон одной страницы
const Page = forwardRef((props, ref) => {
  return (
    <div className="demoPage bg-white border-l border-gray-200 shadow-inner p-4 h-full" ref={ref}>
        <div className="border-4 border-double border-red-200 h-full p-4 flex flex-col justify-between">
            {/* Верхнее фото и текст */}
            <div className="flex flex-col items-center">
                <div className="w-full h-32 bg-gray-100 rounded-lg overflow-hidden border-2 border-pink-300 relative">
                     {/* Заглушка для фото. Замени src на свои картинки */}
                    <img src={props.img1} alt="Memory" className="object-cover w-full h-full" />
                </div>
                <p className="handwritten text-xl text-pink-600 mt-2 text-center">{props.text1}</p>
            </div>

            <div className="text-center text-gray-300 text-xs">~ {props.number} ~</div>

            {/* Нижнее фото и текст */}
            <div className="flex flex-col items-center">
                 <p className="handwritten text-xl text-pink-600 mb-2 text-center">{props.text2}</p>
                <div className="w-full h-32 bg-gray-100 rounded-lg overflow-hidden border-2 border-pink-300 relative">
                    <img src={props.img2} alt="Memory" className="object-cover w-full h-full" />
                </div>
            </div>
        </div>
    </div>
  );
});

Page.displayName = 'Page';

export default function Book() {
    // Данные для 10 страниц (20 слотов)
    // Замени '/images/photoX.jpg' на свои файлы в папке public
    const pagesData = Array.from({ length: 10 }).map((_, i) => ({
        id: i,
        img1: `/images/photo${i * 2 + 1}.jpg`, 
        text1: `Момент №${i * 2 + 1}: Как мы...`,
        img2: `/images/photo${i * 2 + 2}.jpg`,
        text2: `Момент №${i * 2 + 2}: А помнишь...`
    }));

    return (
        <div className="flex justify-center items-center h-[600px] w-full mt-10">
            {/* Размеры книги */}
            <HTMLFlipBook width={350} height={500} showCover={true}>
                <div className="bg-red-500 text-white flex items-center justify-center text-3xl font-bold border-4 border-yellow-400 p-10 text-center">
                    Наша История<br/><span className="text-sm font-normal">Открой меня</span>
                </div>
                {pagesData.map((page, index) => (
                    <Page key={index} number={index + 1} {...page} />
                ))}
                <div className="bg-red-500 text-white flex items-center justify-center text-3xl font-bold">
                    Продолжение следует...
                </div>
            </HTMLFlipBook>
        </div>
    );
}