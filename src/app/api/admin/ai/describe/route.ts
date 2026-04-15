import { NextResponse } from "next/server";
import { generateArtDescription } from "@/lib/gemini";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const title = formData.get("title") as string | null;
    const imageFile = formData.get("image") as File | null;
    
    if (!imageFile) {
      return NextResponse.json({ error: "Image is required for AI analysis" }, { status: 400 });
    }

    // Convert file to base64 string
    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64String = buffer.toString("base64");
    const mimeType = imageFile.type;

    // AI Context
    const result = await generateArtDescription(base64String, mimeType, title || undefined);
    return NextResponse.json(result);
  } catch (error) {
    console.error("[AI Describe Error]", error);
    return NextResponse.json(
      { description: "Sebuah mahakarya visual yang memadukan elemen klasik dengan sentuhan kontemporer.", suggestedCategory: "Fine Art", suggestedTitle: title || "Untitled Work" },
      { status: 200 }
    );
  }
}
