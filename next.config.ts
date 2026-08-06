import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Разрешает открывать dev-сервер с других устройств в локальной сети
  // (например, с телефона по Wi-Fi) — иначе JS-чанки блокируются и форма
  // отправляется как обычная HTML-форма (GET с полями в URL) вместо fetch.
  // На проде (Vercel) это не нужно и не действует.
  allowedDevOrigins: ["192.168.0.180"],
};

export default nextConfig;
