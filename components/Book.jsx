'use client';
import React, { forwardRef, useRef } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// ==========================================
// 🛠️ ТВОИ НАСТРОЙКИ (РЕДАКТИРУЙ ЗДЕСЬ) 🛠️
// ==========================================

// 1. НАСТРОЙКА ВИДЕО
// Впиши сюда номера файлов, которые являются ВИДЕО.
const videosConfig = [5, 10, 15, 20]; 

// 2. ТВОЙ ТЕКСТ ДЛЯ СТРАНИЦ
// Просто пиши текст напротив номера страницы.
// Если текста нет, оставь пустые кавычки "".
const customPageTexts = [
    "I remember every moment, every encounter with you. Every encounter is a happiness for me that cannot be described in words.",  // Страница 1
    "None of our adventures would have been so memorable if you hadn't been there. You are literally my soulmate.✨",           // Страница 2
    "I remember the feeling I had when you stood up and sat down next to me for the first time. At that moment, I was happier than anyone else in the world. And I wanted to be a happy place for you, that safe green lawn where you could sleep peacefully and feel only joy. ",          // Страница 3
    "Each of our adventures is in my heart, and I cannot pretend that it is all over for us. I cannot accept it. My heart tells me to fight for my happiness. My brain insists that I should be the best for her.",           // Страница 4
    "I'm not asking you to forget all the hurt and disappointment. I remain your privileged suitor. I still love you very much, just as before. I still want to feel you and kiss you, just as before.",       // Страница 5
    "Looking back on our adventures, I feel nothing but happiness in my heart. Even when we argued and didn't understand each other, we always chose each other. And I can't just take what made me a very happy person and throw it away. After all, you are my happiness.",            // Страница 6
    "I can't imagine anyone else being with you except me. I can't imagine anyone else you could go hiking with, hold hands with, or hug. I can't imagine anyone else giving you flowers. It hurts me, I'm sorry for hurting you these past few days.", // Страница 7 (без текста)
    "I said at the airport that you had started comparing me to other men. I'm sorry I thought that. But I was afraid that I had become just another suitor you wouldn't look at. And then on Instagram, when I said you weren't paying attention to me, I was afraid again that I was becoming a stranger to you. ", // Страница 8
    "No matter what, I still choose you. Looking at our history, I can't end it like this. I will work on our relationship. I won't let you go.",
    "Everything that is connected with you makes sense to me and is interesting to me. Every letter you wrote to your uncle as a child, every line and letter in your storybook, every small and big victory in your life truly fills me with happiness. That is why I call you “my happiness.”",
    "I keep every gift you gave me not only in my home, but also in my heart and soul. My heart feels warmth and my soul feels peace when I look at your gifts. You have no idea how happy I am inside when you gave me gifts, even if I didn't show it on my face.",
    "I understand how difficult it was for you to write to me about your feelings, your anxious thoughts, and your words of love. But I appreciate every word you wrote, every “good morning,” every “good night,” because I understood that every word you wrote was a sign that you loved me. ",
    "Forgive me, Botakan. Forgive me, my happiness. Forgive me for all the promises I didn't keep. Forgive me for all the times you felt I wasn't listening to you. Forgive me for all the bad emotions I gave you. Forgive me for all the hurt I caused you.",
    "I love you to the moon and back. Yes, there have been times when we've argued. I believe that we will resolve everything and make things right. The most important thing in the world to me is that I found you, I love you, I value you, and I respect you. ",
    "If you're on this page, then I'm already the happiest person on the planet. ",
    "I love you my moonaround"// ... можешь добавить текст для остальных страниц ниже, код сам поймет
];

// ==========================================

const Page = forwardRef((props, ref) => {
  
  // Умный выбор: Фото или Видео?
  const renderMedia = (pageIndex) => {
    const mediaId = props.mediaOffset + pageIndex; // Считаем номер файла (1, 2...)
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
            
            {/* 📸 ВЕРХНЕЕ ФОТО */}
            <div className="flex-1 w-full chibi-frame bg-pink-50/30 flex items-center justify-center p-1 overflow-hidden">
                {renderMedia(0)}
            </div>

            {/* 📝 ТЕКСТ ПОСЕРЕДИНЕ */}
            <div className="my-2 min-h-[60px] flex items-center justify-center">
                <div className="w-full bg-yellow-50/80 border border-yellow-200 rounded-lg p-2 shadow-sm rotate-[-1deg]">
                    <p className="font-nunito text-xs sm:text-sm text-[#5d4037] text-center italic leading-relaxed">
                        {props.text || "..."}
                    </p>
                </div>
            </div>

            {/* 📸 НИЖНЕЕ ФОТО */}
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
    const nextFlip = () => bookRef.current.pageFlip().flipNext();
    const prevFlip = () => bookRef.current.pageFlip().flipPrev();

    // ГЕНЕРАЦИЯ 16 СТРАНИЦ (на 32 фото)
    const pagesData = Array.from({ length: 16 }).map((_, i) => ({
        mediaOffset: i * 2 + 1, // ID фото: 1, 3, 5...
        text: customPageTexts[i] || "Люблю тебя ❤️" // Берем твой текст или ставим заглушку
    }));

    return (
        <div className="flex flex-col items-center justify-center relative z-10 w-full max-w-6xl mx-auto my-4">
            <div className="w-full flex justify-center overflow-hidden px-2">
                <HTMLFlipBook 
                    width={400} height={600} size="stretch" 
                    minWidth={300} maxWidth={1000} minHeight={400} maxHeight={1533} 
                    showCover={true} usePortrait={false} 
                    maxShadowOpacity={0.5} className="shadow-2xl" ref={bookRef}
                >
                    {/* 📕 ОБЛОЖКА */}
                    <div className="bg-pink-100 h-full w-full relative border-r-4 border-pink-300 rounded-r-lg">
                        <img 
                            src="/images/обложка.jpg" alt="Cover" className="w-full h-full object-cover"
                            onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }}
                        />
                        {/* Запасная обложка, если картинки нет */}
                        <div className="hidden absolute inset-0 bg-red-400 text-white flex-col items-center justify-center text-center p-4">
                             <h2 className="text-4xl font-bold font-fredoka mb-2">Love Story</h2>
                             <p className="font-nunito text-lg">Нажми стрелку &rarr;</p>
                        </div>
                    </div>

                    {/* 📖 СТРАНИЦЫ */}
                    {pagesData.map((page, index) => (
                        <Page key={index} number={index + 1} {...page} />
                    ))}

                    {/* 📕 ЗАДНЯЯ ОБЛОЖКА */}
                    <div className="bg-gradient-to-bl from-pink-400 to-red-400 text-white flex items-center justify-center h-full font-bold text-2xl text-center p-6 border-l-4 border-pink-300 rounded-l-lg font-fredoka">
                        Я люблю тебя ❤️<br/>Бесконечно
                    </div>
                </HTMLFlipBook>
            </div>

            {/* ⬅️ СТРЕЛКИ ➡️ */}
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