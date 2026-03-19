import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
  images: {
    // Оптимизация для предотвращения проблем с кэшированием
    cacheDuration: 60,
    minimumCacheTTL: 60,
  },
};

export default nextConfig;
