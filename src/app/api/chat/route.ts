import { NextResponse } from "next/server";
import { chatWithCurator } from "@/lib/gemini";
import { createServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const { message, activeSlug } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const supabase = createServerClient();
    let galleryContext = "";
    let activeContext = "";

    if (supabase) {
      // 1. Fetch active item context if user is on a specific artwork page
      if (activeSlug) {
        const { data: item } = await supabase
          .from("gallery_items")
          .select("title, category, description, author")
          .eq("slug", activeSlug)
          .single();
          
        if (item) {
          activeContext = `KARYA YANG SEDANG DILIHAT PENGGUNA SAAT INI (Fokus Utama):\n- Judul: ${item.title}\n- Kategori: ${item.category}\n- Deskripsi: ${item.description}\n`;
        }
      }

      // 2. Fetch general gallery context
      const { data } = await supabase
        .from("gallery_items")
        .select("title, category") // Minimalized to save tokens
        .eq("is_published", true)
        .limit(20);

      if (data && data.length > 0) {
        galleryContext = "Karya lain di galeri:\n" + data
          .map((item) => `- ${item.title} (${item.category})`)
          .join("\n");
      }
    }

    if (!galleryContext && !activeContext) {
      galleryContext = "Galeri saat ini sedang dalam proses pembaruan data.";
    }

    const response = await chatWithCurator(message, galleryContext, activeContext);
    return NextResponse.json({ response });
  } catch (error) {
    console.error("[Chat Error]", error);
    return NextResponse.json(
      { response: "Maaf, saya sedang tidak bisa merespon. Silakan coba lagi nanti." },
      { status: 200 }
    );
  }
}
