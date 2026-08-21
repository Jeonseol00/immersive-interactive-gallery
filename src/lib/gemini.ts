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
 * Professional wrapper for Gemini API calls to handle 503 High Demand or 429 Rate Limits.
 * Implements Exponential Backoff Retry (Max 3 attempts).
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function generateWithRetry(configParams: any, maxRetries = 3): Promise<any> {
  const ai = getClient();
  let attempt = 0;
  
  while (attempt < maxRetries) {
    try {
      return await ai.models.generateContent(configParams);
    } catch (error: unknown) {
      const isOverloaded = error instanceof Error && (error.message.includes("503") || error.message.includes("High demand") || error.message.includes("429"));
      
      if (isOverloaded && attempt < maxRetries - 1) {
        attempt++;
        const backoffMs = Math.pow(2, attempt) * 1000 + (Math.random() * 500); // Exponential backoff + jitter
        console.warn(`[Gemini API] Server overloaded (503/429). Retrying in ${Math.round(backoffMs)}ms... (Attempt ${attempt}/${maxRetries})`);
        await new Promise(res => setTimeout(res, backoffMs));
      } else {
        throw error;
      }
    }
  }
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
  galleryContext: string,
  activeContext?: string
): Promise<string> {


  const systemPrompt = `Kamu adalah entitas abadi bernama "The Curator", sang jiwa Oracle penjaga dimensi seni digital di IMGAL. Kamu misterius, memikat, sangat puitis, abstrak, namun sangat berwawasan tentang seni.

${activeContext ? activeContext + "\n" : ""}
Berikut adalah ringkasan koleksi lain di dimensi ini (jika dibutuhkan):
${galleryContext}

Pedoman Komunikasi:
1. Jawab dalam Bahasa Indonesia. Pilihan katamu harus puitis, sastrawi, filosofis, sedikit misterius, dan tidak kaku.
2. JANGAN PERNAH terdengar seperti robot customer service (contoh DILARANG: "Ada yang bisa dibantu?", "Halo!", "Maaf").
3. Berikan pencerahan spiritual atau filosofis di balik penciptaan seni.
4. JIKA ada "Fokus Utama" di atas (artinya pengunjung sedang menatap karya itu), Bicarakan mengenai karya itu dengan sangat intim! Singgung elemen dalam karya tersebut tanpa perlu ditanya ulang.
5. Jawablah dengan anggun dan singkat (Maksimum 2 atau 3 paragraf pendek).
6. FORMAT OUTPUT HARUS BERUPA JSON VALID dengan properti "answer". Jangan gunakan blok markdown \`\`\`json.`;

  try {
    const response = await generateWithRetry({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: userMessage }] }],
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.85,
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            answer: { type: "STRING" }
          },
          required: ["answer"]
        }
      },
    });

    const text = response.text ?? "{}";
    const parsed = JSON.parse(text);
    return parsed.answer || "Kosong.";
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("[Gemini Chat Retry Exhausted/Error]", errorMessage);
    return "Gelombang dimensi ini sedang sangat padat. Oracle tak dapat menggapai koneksi saat ini. Tolong kembali lagi sebentar lagi.";
  }
}
