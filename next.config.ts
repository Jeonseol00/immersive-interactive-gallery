import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    formats: ['image/avif', 'image/webp'],
    qualities: [30, 40, 75],
    minimumCacheTTL: 60,
  },
  allowedDevOrigins: ['192.168.100.3'],
};

export default nextConfig;
