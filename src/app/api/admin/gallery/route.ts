import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

/**
 * PUT: Update a gallery item (toggle publish, toggle featured, etc.)
 * DELETE: Remove a gallery item
 * Uses service_role key — bypasses RLS.
 */
export async function PUT(request: Request) {
  try {
    const { id, updates } = await request.json();
    if (!id || !updates) {
      return NextResponse.json({ error: "id and updates are required" }, { status: 400 });
    }

    const supabase = createServerClient();
    if (!supabase) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 });
    }

    const { error } = await supabase
      .from("gallery_items")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Gallery Admin API Error]", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
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
