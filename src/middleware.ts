import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * ═══════════════════════════════════════════════════════
 * IMGAL Edge Middleware — Authentication & Security Gate
 * ═══════════════════════════════════════════════════════
 * 
 * This middleware runs on EVERY matched request at the Edge.
 * It handles:
 *   1. Admin page protection (redirect unauthenticated users to login)
 *   2. Admin API protection (reject unauthenticated API calls with 401)
 *   3. Security headers injection on all responses
 * 
 * Without this file, the entire admin panel was accessible to anyone.
 */

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ─── Skip login page itself (avoid redirect loop) ──────────────
  if (pathname === "/admin/login") {
    return addSecurityHeaders(NextResponse.next());
  }

  // ─── Protect /admin/* pages and /api/admin/* endpoints ─────────
  const isAdminPage = pathname.startsWith("/admin");
  const isAdminAPI = pathname.startsWith("/api/admin");

  if (isAdminPage || isAdminAPI) {
    // Create a Supabase client that reads cookies from the request
    let response = NextResponse.next({
      request: { headers: request.headers },
    });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            // Update cookies on the request (for downstream)
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
            // Update cookies on the response (for the browser)
            response = NextResponse.next({
              request: { headers: request.headers },
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    // Verify the session
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      if (isAdminAPI) {
        // API routes: return 401 JSON
        return addSecurityHeaders(
          NextResponse.json(
            { error: "Unauthorized — valid admin session required" },
            { status: 401 }
          )
        );
      }
      // Admin pages: redirect to login
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/admin/login";
      loginUrl.searchParams.set("redirect", pathname);
      return addSecurityHeaders(NextResponse.redirect(loginUrl));
    }

    // Optional: Verify the user is the designated admin
    const adminEmail = process.env.ADMIN_EMAIL;
    if (adminEmail && user.email !== adminEmail) {
      if (isAdminAPI) {
        return addSecurityHeaders(
          NextResponse.json(
            { error: "Forbidden — insufficient privileges" },
            { status: 403 }
          )
        );
      }
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/admin/login";
      return addSecurityHeaders(NextResponse.redirect(loginUrl));
    }

    return addSecurityHeaders(response);
  }

  // ─── All other routes: just add security headers ───────────────
  return addSecurityHeaders(NextResponse.next());
}

/**
 * Inject security headers into every response.
 * These headers are the digital equivalent of a reinforced bunker wall.
 */
function addSecurityHeaders(response: NextResponse): NextResponse {
  // Prevent clickjacking
  response.headers.set("X-Frame-Options", "DENY");

  // Prevent MIME type sniffing
  response.headers.set("X-Content-Type-Options", "nosniff");

  // Control referrer information leakage
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  // Restrict browser features
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), interest-cohort=()"
  );

  // Force HTTPS (31536000 = 1 year)
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains; preload"
  );

  // Content Security Policy — restrictive but functional
  response.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      // Scripts: self + inline for Next.js hydration
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      // Styles: self + inline for Tailwind/CSS-in-JS
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      // Fonts from Google Fonts
      "font-src 'self' https://fonts.gstatic.com",
      // Images: self + Supabase storage + data URIs
      "img-src 'self' data: blob: https://gpuihgbyzrrufkdzigwx.supabase.co",
      // Media: Google TTS for AI Curator voice
      "media-src 'self' https://translate.googleapis.com data:",
      // API connections: self + Supabase + Gemini
      "connect-src 'self' https://gpuihgbyzrrufkdzigwx.supabase.co https://*.googleapis.com",
      // Frames: none
      "frame-src 'none'",
      // Objects: none
      "object-src 'none'",
      // Base URI: self only
      "base-uri 'self'",
      // Form actions: self only
      "form-action 'self'",
      // Upgrade insecure requests in production
      "upgrade-insecure-requests",
    ].join("; ")
  );

  return response;
}

/**
 * Matcher: Run middleware on admin routes, admin APIs, and public pages.
 * Exclude static assets, images, and Next.js internals.
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, sitemap.xml, robots.txt
     * - Public image files
     */
    "/((?!_next/static|_next/image|favicon\\.ico|sitemap\\.xml|robots\\.txt|images/).*)",
  ],
};
