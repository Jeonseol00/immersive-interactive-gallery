import type { NextConfig } from "next";

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
  // Disable X-Powered-By header — reduces information leakage
  poweredByHeader: false,

  images: {
    formats: ['image/avif', 'image/webp'],
    qualities: [30, 40, 75],
    minimumCacheTTL: 60,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'gpuihgbyzrrufkdzigwx.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },

  // Dev origins from environment — don't hardcode internal IPs in committed config
  allowedDevOrigins: process.env.ALLOWED_DEV_ORIGINS
    ? process.env.ALLOWED_DEV_ORIGINS.split(',').map(s => s.trim())
    : [],

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
