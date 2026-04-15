import { GoogleGenAI } from "@google/genai";

/**
 * Singleton Gemini AI client.
 * Lazily initialized to avoid errors if API key is missing.
 */
let aiClient: GoogleGenAI | null = null;

function getClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("[Gemini] GEMINI_API_KEY is not set");
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

/**
 * Generate an artistic description for an uploaded artwork image.
 * Used in the admin dashboard during upload flow.
 */
export async function generateArtDescription(
  imageBase64: string,
  mimeType: string,
  userTitle?: string
): Promise<{ description: string; suggestedCategory: string; suggestedTitle: string }> {
  const ai = getClient();

  const systemPrompt = `Kamu adalah seorang kurator seni digital profesional di galeri IMGAL.
Tugasmu: menganalisis gambar karya seni dan menghasilkan deskripsi artistik dalam Bahasa Indonesia.

Format output HARUS berupa JSON valid:
{
  "description": "Deskripsi artistik dan puitis 2-3 kalimat tentang karya ini",
  "suggestedCategory": "Salah satu dari: Portrait, Fine Art, Heritage, Landscape, Nature, Urban, Architecture",
  "suggestedTitle": "Judul artistik yang menggugah dalam Bahasa Inggris (2-3 kata)"
}

Jangan tambahkan teks lain selain JSON.`;

  const userPrompt = userTitle
    ? `Analisis karya seni visual ini. Judul sementara dari pembuat: "${userTitle}".`
    : `Analisis karya seni visual ini.`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      {
        role: "user",
        parts: [
          { inlineData: { data: imageBase64, mimeType } },
          { text: userPrompt },
        ],
      },
    ],
    config: {
      systemInstruction: systemPrompt,
      temperature: 0.7,
      responseMimeType: "application/json",
      responseSchema: {
        type: "OBJECT",
        properties: {
          description: { type: "STRING" },
          suggestedCategory: { type: "STRING" },
          suggestedTitle: { type: "STRING" }
        },
        required: ["description", "suggestedCategory", "suggestedTitle"]
      }
    },
  });

  try {
    const text = response.text ?? "{}";
    return JSON.parse(text);
  } catch (err) {
    console.error("[Gemini JSON Error]", err, "Raw response:", response?.text);
    return {
      description: "Sebuah mahakarya visual yang memadukan elemen klasik dengan sentuhan kontemporer.",
      suggestedCategory: "Fine Art",
      suggestedTitle: userTitle || "Untitled Work",
    };
  }
}

/**
 * Chat with the AI Art Curator.
 * The curator knows about all artworks in the gallery.
 */
export async function chatWithCurator(
  userMessage: string,
  galleryContext: string
): Promise<string> {
  const ai = getClient();

  const systemPrompt = `Kamu adalah "IMGAL Curator AI" — seorang kurator seni digital yang sangat berpengetahuan, ramah, dan puitis.

Konteks Galeri Seni (data karya yang tersedia):
${galleryContext}

Pedoman:
1. Jawab dalam Bahasa Indonesia kecuali diminta berbahasa Inggris.
2. Berikan insight mendalam tentang karya seni, teknik, sejarah, dan konteks budaya.
3. Jika ditanya tentang karya spesifik di galeri, rujuk data di atas.
4. Jika ditanya hal di luar seni, arahkan kembali ke topik seni dengan sopan.
5. Gunakan bahasa yang elegan dan puitis namun tetap mudah dipahami.
6. Jawab ringkas (maks 3-4 kalimat) kecuali diminta penjelasan detail.`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [{ role: "user", parts: [{ text: userMessage }] }],
    config: {
      systemInstruction: systemPrompt,
      temperature: 0.8,
      maxOutputTokens: 800,
    },
  });

  return response.text ?? "Maaf, saya tidak bisa memproses permintaan Anda saat ini.";
}
