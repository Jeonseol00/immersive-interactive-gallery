import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { verifyAdminAuth, isAuthError } from "@/lib/auth-guard";

/**
 * ═══════════════════════════════════════════════════════
 * Admin Gallery API — HARDENED
 * ═══════════════════════════════════════════════════════
 * 
 * PUT:    Update a gallery item (toggle publish, toggle featured, etc.)
 * POST:   Create a new gallery item
 * DELETE: Remove a gallery item
 * 
 * Security:
 *   ✅ Server-side authentication via verifyAdminAuth()
 *   ✅ Input validation with allowlisted fields
 *   ✅ String length limits to prevent storage abuse
 *   ✅ Service role key used only after auth verification
 */

// ─── Allowed fields for updates and inserts ──────────────
const ALLOWED_UPDATE_FIELDS = new Set([
  "title", "slug", "category", "description", "author",
  "parallax_speed", "image_url", "thumbnail_url", "alt_text",
  "width", "height", "aspect_ratio",
  "is_published", "is_featured", "is_featured_waterfall", "sort_order",
]);

const MAX_STRING_LENGTH = 2000;
const MAX_TITLE_LENGTH = 200;
const MAX_URL_LENGTH = 500;

/**
 * Sanitize and validate input fields against the allowlist.
 * Strips any unknown/dangerous fields and enforces length limits.
 */
function sanitizeFields(raw: Record<string, unknown>): Record<string, unknown> {
  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(raw)) {
    if (!ALLOWED_UPDATE_FIELDS.has(key)) continue;

    // Type-specific validation
    if (typeof value === "string") {
      const maxLen = key.includes("url") ? MAX_URL_LENGTH
        : key === "title" ? MAX_TITLE_LENGTH
        : MAX_STRING_LENGTH;
      sanitized[key] = value.slice(0, maxLen);
    } else if (typeof value === "boolean") {
      sanitized[key] = value;
    } else if (typeof value === "number") {
      // Prevent absurd values
      if (key === "width" || key === "height") {
        sanitized[key] = Math.max(1, Math.min(value, 10000));
      } else if (key === "sort_order") {
        sanitized[key] = Math.max(-1000, Math.min(value, 10000));
      } else if (key === "parallax_speed") {
        sanitized[key] = Math.max(0, Math.min(value, 2));
      } else {
        sanitized[key] = value;
      }
    }
  }

  return sanitized;
}

export async function PUT(request: Request) {
  // ─── AUTH CHECK ────────────────────────────────────────
  const auth = await verifyAdminAuth(request);
  if (isAuthError(auth)) return auth;

  try {
    const body = await request.json();
    const { id, updates } = body;

    if (!id || typeof id !== "string" || !updates || typeof updates !== "object") {
      return NextResponse.json({ error: "id (string) and updates (object) are required" }, { status: 400 });
    }

    // Validate UUID format
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
      return NextResponse.json({ error: "Invalid id format" }, { status: 400 });
    }

    const sanitizedUpdates = sanitizeFields(updates);
    if (Object.keys(sanitizedUpdates).length === 0) {
      return NextResponse.json({ error: "No valid update fields provided" }, { status: 400 });
    }

    const supabase = createServerClient();
    if (!supabase) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 });
    }

    const { error } = await supabase
      .from("gallery_items")
      .update({ ...sanitizedUpdates, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Gallery Admin API Error]", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  // ─── AUTH CHECK ────────────────────────────────────────
  const auth = await verifyAdminAuth(request);
  if (isAuthError(auth)) return auth;

  try {
    const raw = await request.json();
    
    // Validate required fields
    if (!raw.title || !raw.slug || !raw.image_url) {
      return NextResponse.json(
        { error: "title, slug, and image_url are required" },
        { status: 400 }
      );
    }

    const sanitizedData = sanitizeFields(raw);

    const supabase = createServerClient();
    if (!supabase) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 });
    }

    const { error } = await supabase.from("gallery_items").insert(sanitizedData);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Gallery Admin POST Error]", error);
    return NextResponse.json({ error: "Failed to insert gallery item" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  // ─── AUTH CHECK ────────────────────────────────────────
  const auth = await verifyAdminAuth(request);
  if (isAuthError(auth)) return auth;

  try {
    const { id } = await request.json();
    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "id (string) is required" }, { status: 400 });
    }

    // Validate UUID format — prevent wildcard deletion
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
      return NextResponse.json({ error: "Invalid id format" }, { status: 400 });
    }

    const supabase = createServerClient();
    if (!supabase) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 });
    }

    const { error } = await supabase.from("gallery_items").delete().eq("id", id);
    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Gallery Admin Delete Error]", error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
