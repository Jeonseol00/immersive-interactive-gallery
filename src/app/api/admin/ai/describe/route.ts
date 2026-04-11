import { NextResponse } from "next/server";
import { generateArtDescription } from "@/lib/gemini";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const title = formData.get("title") as string | null;
    // For now, we use the title for AI context. Image analysis via URL would need the image to be uploaded first.
    const result = await generateArtDescription("", title || undefined);
    return NextResponse.json(result);
  } catch (error) {
    console.error("[AI Describe Error]", error);
    return NextResponse.json(
      { description: "Sebuah mahakarya visual yang memadukan elemen klasik dengan sentuhan kontemporer.", suggestedCategory: "Fine Art", suggestedTitle: "Untitled" },
      { status: 200 }
    );
  }
}
