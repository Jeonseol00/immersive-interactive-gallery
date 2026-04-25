import { NextResponse } from "next/server";
import { chatWithCurator } from "@/lib/gemini";
import { createServerClient } from "@/lib/supabase/server";
import { rateLimit, getClientIP } from "@/lib/rate-limit";

/**
 * ═══════════════════════════════════════════════════════
 * Public Chat API — HARDENED
 * ═══════════════════════════════════════════════════════
 * 
 * POST: Chat with the AI Art Curator (Oracle).
 * 
 * Security:
 *   ✅ IP-based rate limiting (10 requests per 60 seconds)
 *   ✅ Message length limit (1000 chars)
 *   ✅ Input type validation
 *   ✅ Slug format validation (prevents injection via activeSlug)
 *   ✅ Error responses don't leak internal details
 */

const CHAT_RATE_LIMIT = 10;       // max requests
const CHAT_RATE_WINDOW = 60_000;  // per 60 seconds
const MAX_MESSAGE_LENGTH = 1000;  // characters
const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export async function POST(request: Request) {
  // ─── RATE LIMITING ─────────────────────────────────────
  const clientIP = getClientIP(request);
  const { allowed, remaining, resetAt } = rateLimit(clientIP, CHAT_RATE_LIMIT, CHAT_RATE_WINDOW);

  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please wait before sending another message." },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((resetAt - Date.now()) / 1000)),
          "X-RateLimit-Limit": String(CHAT_RATE_LIMIT),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": String(Math.ceil(resetAt / 1000)),
        },
      }
    );
  }

  try {
    const body = await request.json();
    const { message, activeSlug } = body;

    // ─── INPUT VALIDATION ──────────────────────────────────
    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // Enforce message length limit
    const sanitizedMessage = message.trim().slice(0, MAX_MESSAGE_LENGTH);
    if (sanitizedMessage.length === 0) {
      return NextResponse.json({ error: "Message cannot be empty" }, { status: 400 });
    }

    // Validate activeSlug format if provided (prevent injection)
    let validatedSlug: string | null = null;
    if (activeSlug && typeof activeSlug === "string") {
      if (SLUG_REGEX.test(activeSlug) && activeSlug.length <= 100) {
        validatedSlug = activeSlug;
      }
      // Silently ignore invalid slugs — don't reveal validation details
    }

    const supabase = createServerClient();
    let galleryContext = "";
    let activeContext = "";

    if (supabase) {
      // 1. Fetch active item context if user is on a specific artwork page
      if (validatedSlug) {
        const { data: item } = await supabase
          .from("gallery_items")
          .select("title, category, description, author")
          .eq("slug", validatedSlug)
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

    const response = await chatWithCurator(sanitizedMessage, galleryContext, activeContext);

    return NextResponse.json(
      { response },
      {
        headers: {
          "X-RateLimit-Limit": String(CHAT_RATE_LIMIT),
          "X-RateLimit-Remaining": String(remaining),
          "X-RateLimit-Reset": String(Math.ceil(resetAt / 1000)),
        },
      }
    );
  } catch (error) {
    console.error("[Chat Error]", error);
    return NextResponse.json(
      { response: "Maaf, saya sedang tidak bisa merespon. Silakan coba lagi nanti." },
      { status: 200 }
    );
  }
}
