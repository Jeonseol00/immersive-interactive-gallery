import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { verifyAdminAuth, isAuthError } from "@/lib/auth-guard";

/**
 * ═══════════════════════════════════════════════════════
 * Admin Waterfall API — HARDENED
 * ═══════════════════════════════════════════════════════
 * 
 * PUT:   Toggle is_featured_waterfall on a gallery item
 * POST:  Update waterfall_limit in site_settings
 * PATCH: Batch update — set all items waterfall on/off
 * 
 * Security:
 *   ✅ Server-side authentication via verifyAdminAuth()
 *   ✅ Input validation with type checking
 *   ✅ UUID format validation
 *   ✅ Numeric range clamping
 *   ✅ Action value allowlist for PATCH
 */

export async function PUT(request: Request) {
  // ─── AUTH CHECK ────────────────────────────────────────
  const auth = await verifyAdminAuth(request);
  if (isAuthError(auth)) return auth;

  try {
    const { id, is_featured_waterfall } = await request.json();
    if (!id || typeof id !== "string" || typeof is_featured_waterfall !== "boolean") {
      return NextResponse.json({ error: "id (string) and is_featured_waterfall (boolean) are required" }, { status: 400 });
    }

    // Validate UUID format
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
      return NextResponse.json({ error: "Invalid id format" }, { status: 400 });
    }

    const supabase = createServerClient();
    if (!supabase) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 });
    }

    const { error } = await supabase
      .from("gallery_items")
      .update({ is_featured_waterfall, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Waterfall Admin PUT Error]", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  // ─── AUTH CHECK ────────────────────────────────────────
  const auth = await verifyAdminAuth(request);
  if (isAuthError(auth)) return auth;

  try {
    const { waterfall_limit } = await request.json();
    const parsed = parseInt(waterfall_limit, 10);

    if (isNaN(parsed) || parsed < 1 || parsed > 50) {
      return NextResponse.json(
        { error: "waterfall_limit must be a number between 1 and 50" },
        { status: 400 }
      );
    }

    const supabase = createServerClient();
    if (!supabase) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 });
    }

    const { error } = await supabase
      .from("site_settings")
      .upsert({
        key: "waterfall_limit",
        value: String(parsed),
        updated_at: new Date().toISOString(),
      });

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Waterfall Admin POST Error]", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  // ─── AUTH CHECK ────────────────────────────────────────
  const auth = await verifyAdminAuth(request);
  if (isAuthError(auth)) return auth;

  try {
    const { action } = await request.json();

    // Allowlist valid actions — prevents arbitrary action injection
    const VALID_ACTIONS = ["enable_all", "disable_all"] as const;
    if (!action || !VALID_ACTIONS.includes(action)) {
      return NextResponse.json(
        { error: `action must be one of: ${VALID_ACTIONS.join(", ")}` },
        { status: 400 }
      );
    }

    const supabase = createServerClient();
    if (!supabase) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 });
    }

    const newValue = action === "enable_all";

    const { error } = await supabase
      .from("gallery_items")
      .update({ is_featured_waterfall: newValue, updated_at: new Date().toISOString() })
      .eq("is_published", true);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Waterfall Admin PATCH Error]", error);
    return NextResponse.json({ error: "Failed to batch update" }, { status: 500 });
  }
}
