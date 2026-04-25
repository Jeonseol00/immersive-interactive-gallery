import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { verifyAdminAuth, isAuthError } from "@/lib/auth-guard";

/**
 * ═══════════════════════════════════════════════════════
 * Admin Theme API — HARDENED
 * ═══════════════════════════════════════════════════════
 * 
 * PUT: Activate a theme preset by ID.
 * 
 * Security:
 *   ✅ Server-side authentication via verifyAdminAuth()
 *   ✅ UUID format validation
 *   ✅ Uses service_role key — bypasses RLS (only after auth)
 */
export async function PUT(request: Request) {
  // ─── AUTH CHECK ────────────────────────────────────────
  const auth = await verifyAdminAuth(request);
  if (isAuthError(auth)) return auth;

  try {
    const { themeId } = await request.json();
    if (!themeId || typeof themeId !== "string") {
      return NextResponse.json({ error: "themeId (string) is required" }, { status: 400 });
    }

    // Validate UUID format
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(themeId)) {
      return NextResponse.json({ error: "Invalid themeId format" }, { status: 400 });
    }

    const supabase = createServerClient();
    if (!supabase) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 });
    }

    // Deactivate all currently active themes
    await supabase.from("theme_presets").update({ is_active: false }).eq("is_active", true);

    // Activate selected theme
    const { error } = await supabase
      .from("theme_presets")
      .update({ is_active: true })
      .eq("id", themeId);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Theme API Error]", error);
    return NextResponse.json({ error: "Failed to update theme" }, { status: 500 });
  }
}
