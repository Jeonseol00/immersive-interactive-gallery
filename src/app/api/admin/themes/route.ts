import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

/**
 * PUT: Activate a theme preset by ID.
 * Uses service_role key — bypasses RLS.
 */
export async function PUT(request: Request) {
  try {
    const { themeId } = await request.json();
    if (!themeId) {
      return NextResponse.json({ error: "themeId is required" }, { status: 400 });
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
