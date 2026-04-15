import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

/**
 * PUT: Toggle is_featured_waterfall on a gallery item
 * POST: Update waterfall_limit in site_settings
 * PATCH: Batch update — set all items waterfall on/off
 * Uses service_role key — bypasses RLS.
 */

export async function PUT(request: Request) {
  try {
    const { id, is_featured_waterfall } = await request.json();
    if (!id || typeof is_featured_waterfall !== "boolean") {
      return NextResponse.json({ error: "id and is_featured_waterfall are required" }, { status: 400 });
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
  try {
    const { waterfall_limit } = await request.json();
    if (!waterfall_limit || isNaN(parseInt(waterfall_limit))) {
      return NextResponse.json({ error: "waterfall_limit is required" }, { status: 400 });
    }

    const supabase = createServerClient();
    if (!supabase) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 });
    }

    const { error } = await supabase
      .from("site_settings")
      .upsert({
        key: "waterfall_limit",
        value: String(waterfall_limit),
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
  try {
    const { action } = await request.json(); // "enable_all" | "disable_all"

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
