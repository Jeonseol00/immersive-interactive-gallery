import { NextResponse } from "next/server";
import { chatWithCurator } from "@/lib/gemini";
import { createServerClient } from "@/lib/supabase/server";
import { mockGalleryData } from "@/lib/data";

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // Build gallery context from Supabase or fallback
    let galleryContext = "";
    const supabase = createServerClient();

    if (supabase) {
      const { data } = await supabase
        .from("gallery_items")
        .select("title, category, description, author")
        .eq("is_published", true)
        .limit(20);

      if (data && data.length > 0) {
        galleryContext = data
          .map((item) => `- "${item.title}" (${item.category}) oleh ${item.author}: ${item.description}`)
          .join("\n");
      }
    }

    // Fallback to mock data
    if (!galleryContext) {
      galleryContext = mockGalleryData
        .map((item) => `- "${item.title}" (${item.category}) oleh ${item.metadata.author}: ${item.interactions.accordionDescription}`)
        .join("\n");
    }

    const response = await chatWithCurator(message, galleryContext);
    return NextResponse.json({ response });
  } catch (error) {
    console.error("[Chat Error]", error);
    return NextResponse.json(
      { response: "Maaf, saya sedang tidak bisa merespon. Silakan coba lagi nanti." },
      { status: 200 }
    );
  }
}
