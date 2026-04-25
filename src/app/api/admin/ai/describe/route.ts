import { NextResponse } from "next/server";
import { generateArtDescription } from "@/lib/gemini";
import { verifyAdminAuth, isAuthError } from "@/lib/auth-guard";

/**
 * ═══════════════════════════════════════════════════════
 * Admin AI Describe API — HARDENED
 * ═══════════════════════════════════════════════════════
 * 
 * POST: Generate AI art description from an uploaded image.
 * 
 * Security:
 *   ✅ Server-side authentication via verifyAdminAuth()
 *   ✅ File size limit (10MB)
 *   ✅ MIME type allowlist
 *   ✅ Title string length limit
 *   ✅ Protects Gemini API from unauthorized usage/billing abuse
 */

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export async function POST(request: Request) {
  // ─── AUTH CHECK ────────────────────────────────────────
  const auth = await verifyAdminAuth(request);
  if (isAuthError(auth)) return auth;

  let title: string | null = null;

  try {
    const formData = await request.formData();
    title = formData.get("title") as string | null;
    const imageFile = formData.get("image") as File | null;
    
    if (!imageFile) {
      return NextResponse.json({ error: "Image is required for AI analysis" }, { status: 400 });
    }

    // ─── File validation ─────────────────────────────────
    if (imageFile.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `Image too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB` },
        { status: 400 }
      );
    }

    if (!ALLOWED_MIME_TYPES.has(imageFile.type)) {
      return NextResponse.json(
        { error: `Invalid file type: ${imageFile.type}. Allowed: ${[...ALLOWED_MIME_TYPES].join(", ")}` },
        { status: 400 }
      );
    }

    // ─── Title sanitization ──────────────────────────────
    const sanitizedTitle = title ? title.slice(0, 200) : undefined;

    // Convert file to base64 string
    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64String = buffer.toString("base64");
    const mimeType = imageFile.type;

    // AI Context
    const result = await generateArtDescription(base64String, mimeType, sanitizedTitle);
    return NextResponse.json(result);
  } catch (error) {
    console.error("[AI Describe Error]", error);
    return NextResponse.json(
      { 
        description: "Sebuah mahakarya visual yang memadukan elemen klasik dengan sentuhan kontemporer.",
        suggestedCategory: "Fine Art",
        suggestedTitle: title || "Untitled Work"
      },
      { status: 200 }
    );
  }
}
