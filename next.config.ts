import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Dev-режим: без этого JS-чанки не грузятся при открытии по IP локальной сети.
  allowedDevOrigins: ["192.168.0.180"],
};

export default nextConfig;
