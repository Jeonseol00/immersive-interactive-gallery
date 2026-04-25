import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

/**
 * ═══════════════════════════════════════════════════════
 * IMGAL Server-Side Auth Guard
 * ═══════════════════════════════════════════════════════
 * 
 * Verifies the caller's Supabase session via the Authorization header.
 * Used in ALL admin API routes to enforce server-side authentication.
 * 
 * This is the ONLY line of defense — client-side checks are cosmetic.
 * If this function returns null, the request MUST be rejected.
 */

const UNAUTHORIZED = () =>
  NextResponse.json(
    { error: "Unauthorized — valid admin session required" },
    { status: 401 }
  );

/**
 * Verify the request comes from an authenticated Supabase user.
 * 
 * Strategy: Extract the access token from either:
 *   1. Authorization header (Bearer token)
 *   2. Supabase auth cookies (sb-*-auth-token)
 * 
 * Then verify it against Supabase Auth to confirm it's a valid session.
 * 
 * @returns The authenticated user object, or a NextResponse 401 error.
 */
export async function verifyAdminAuth(
  request: Request
): Promise<{ userId: string; email: string } | NextResponse> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    console.error("[Auth Guard] Missing Supabase credentials");
    return UNAUTHORIZED();
  }

  // Extract access token from Authorization header or cookies
  let accessToken: string | null = null;

  // Strategy 1: Bearer token in Authorization header
  const authHeader = request.headers.get("Authorization");
  if (authHeader?.startsWith("Bearer ")) {
    accessToken = authHeader.slice(7);
  }

  // Strategy 2: Supabase auth cookies
  if (!accessToken) {
    const cookieHeader = request.headers.get("cookie") || "";
    // Supabase stores the session in sb-<ref>-auth-token cookies
    // The format may be a base64 JSON array across multiple cookie chunks
    const projectRef = url.replace("https://", "").split(".")[0];
    const cookieName = `sb-${projectRef}-auth-token`;
    
    // Try to extract the token from cookies
    const cookies = cookieHeader.split(";").map(c => c.trim());
    
    // Supabase SSR may chunk cookies: sb-<ref>-auth-token.0, sb-<ref>-auth-token.1, etc.
    const tokenChunks: { index: number; value: string }[] = [];
    
    for (const cookie of cookies) {
      // Exact match (non-chunked)
      if (cookie.startsWith(`${cookieName}=`)) {
        const value = cookie.slice(cookieName.length + 1);
        tokenChunks.push({ index: 0, value });
      }
      // Chunked match
      const chunkMatch = cookie.match(new RegExp(`^${cookieName}\\.([0-9]+)=(.+)$`));
      if (chunkMatch) {
        tokenChunks.push({ index: parseInt(chunkMatch[1], 10), value: chunkMatch[2] });
      }
    }

    if (tokenChunks.length > 0) {
      // Reassemble chunks in order
      tokenChunks.sort((a, b) => a.index - b.index);
      const rawToken = tokenChunks.map(c => c.value).join("");
      
      try {
        // Supabase stores session as base64-encoded JSON array: [access_token, refresh_token]
        const decoded = decodeURIComponent(rawToken);
        // Try parsing as JSON first (it could be base64 or direct JSON)
        let parsed: unknown;
        try {
          parsed = JSON.parse(decoded);
        } catch {
          // Try base64 decode
          try {
            parsed = JSON.parse(Buffer.from(decoded, "base64").toString("utf-8"));
          } catch {
            // Raw token
            parsed = null;
          }
        }

        if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === "string") {
          accessToken = parsed[0];
        } else if (typeof parsed === "string") {
          accessToken = parsed;
        }
      } catch {
        // Cookie parsing failed
      }
    }
  }

  if (!accessToken) {
    return UNAUTHORIZED();
  }

  // Verify the token against Supabase Auth
  try {
    const supabase = createSupabaseClient(url, anonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    });

    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      console.warn("[Auth Guard] Token verification failed:", error?.message);
      return UNAUTHORIZED();
    }

    // Optional: Restrict to specific admin email(s)
    const adminEmail = process.env.ADMIN_EMAIL;
    if (adminEmail && user.email !== adminEmail) {
      console.warn(`[Auth Guard] Non-admin user attempted access: ${user.email}`);
      return UNAUTHORIZED();
    }

    return { userId: user.id, email: user.email || "" };
  } catch (err) {
    console.error("[Auth Guard] Verification error:", err);
    return UNAUTHORIZED();
  }
}

/**
 * Helper: Check if verifyAdminAuth returned an error response.
 */
export function isAuthError(result: { userId: string; email: string } | NextResponse): result is NextResponse {
  return result instanceof NextResponse;
}
