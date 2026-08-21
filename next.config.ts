import type { NextConfig } from "next";
import "./src/env";

/**
 * ═══════════════════════════════════════════════════════
 * IMGAL Next.js Configuration — HARDENED
 * ═══════════════════════════════════════════════════════
 * 
 * Security changes:
 *   ✅ Comprehensive security headers (CSP, HSTS, X-Frame-Options, etc.)
 *   ✅ Internal IPs moved to env-based dev origins
 *   ✅ Powered-by header disabled (information leakage)
 *   ✅ Strict image remote patterns
 */

const nextConfig: NextConfig = {
  // Standalone output for Docker multi-stage builds
  output: "standalone",

  // Disable X-Powered-By header — reduces information leakage
  poweredByHeader: false,

  images: {
    formats: ['image/avif', 'image/webp'],
    qualities: [30, 40, 75],
    // Cache optimized images for 24 hours to reduce repeated upstream fetches
    minimumCacheTTL: 86400,
    // Reduce device sizes to minimize upstream fetch variants
    deviceSizes: [640, 1080, 1920],
    imageSizes: [128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'gpuihgbyzrrufkdzigwx.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },


  // Security headers as a defense-in-depth layer
  // (Primary headers are set in middleware.ts for full coverage)
  async headers() {
    return [
      {
        // Apply to all routes
        source: "/(.*)",
        headers: [
          { key: "X-DNS-Prefetch-Control", value: "on" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
