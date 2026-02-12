import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export', // <--- Это создаст папку 'out' с твоим сайтом
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true, // Игнорируем ошибки типов
  },
};

export default nextConfig;