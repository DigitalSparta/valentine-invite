import { Fredoka, Nunito } from "next/font/google";
import "./globals.css";

// Пухлый шрифт для заголовков
const fredoka = Fredoka({
  weight: ['400', '600', '700'],
  subsets: ["latin"],
  variable: "--font-fredoka",
});

// Мягкий шрифт для основного текста
const nunito = Nunito({
  subsets: ["latin", "cyrillic"],
  variable: "--font-nunito",
});

export const metadata = {
  title: "Милое Приглашение",
  description: "Сделано с любовью",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body className={`${fredoka.variable} ${nunito.variable} font-nunito antialiased`}>
        {children}
      </body>
    </html>
  );
}