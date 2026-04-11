import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

/**
 * GET: Fetch the currently active theme preset.
 * Public endpoint — returns theme colors for GlobalBackground.
 */
export async function GET() {
  try {
    const supabase = createServerClient();
    if (!supabase) {
      return NextResponse.json({}, { status: 200 });
    }

    const { data } = await supabase
      .from("theme_presets")
      .select("orb1_color, orb2_color, orb3_color, grain_opacity")
      .eq("is_active", true)
      .single();

    return NextResponse.json(data || {});
  } catch {
    return NextResponse.json({}, { status: 200 });
  }
}
