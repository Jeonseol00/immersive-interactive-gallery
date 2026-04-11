"use client";

import { useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useDropzone } from "react-dropzone";
import Image from "next/image";

export default function AdminNewGalleryPage() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp"] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  // AI Auto-Describe
  const handleAIDescribe = async () => {
    if (!imageFile) return;
    setAiLoading(true);
    try {
      const formData = new FormData();
      formData.append("image", imageFile);
      if (title) formData.append("title", title);

      const res = await fetch("/api/admin/ai/describe", { method: "POST", body: formData });
      const data = await res.json();

      if (data.description) setDescription(data.description);
      if (data.suggestedCategory && !category) setCategory(data.suggestedCategory);
      if (data.suggestedTitle && !title) setTitle(data.suggestedTitle);
    } catch {
      setError("AI tidak dapat menganalisis gambar saat ini.");
    }
    setAiLoading(false);
  };

  // Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) { setError("Pilih gambar terlebih dahulu."); return; }
    if (!title.trim()) { setError("Judul wajib diisi."); return; }
    setUploading(true);
    setError("");

    try {
      const supabase = createClient();

      // 1. Upload image to Supabase Storage
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      const ext = imageFile.name.split(".").pop();
      const filePath = `artworks/${slug}-${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("gallery")
        .upload(filePath, imageFile, { cacheControl: "3600", upsert: false });

      if (uploadError) throw uploadError;

      // 2. Get public URL
      const { data: urlData } = supabase.storage.from("gallery").getPublicUrl(filePath);
      const imageUrl = urlData.publicUrl;

      // 3. Get image dimensions
      const img = new window.Image();
      img.src = imagePreview!;
      await new Promise((resolve) => { img.onload = resolve; });
      const width = img.naturalWidth;
      const height = img.naturalHeight;
      const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
      const d = gcd(width, height);
      const aspectRatio = `${width / d}/${height / d}`;

      // 4. Insert to database
      const { error: dbError } = await supabase.from("gallery_items").insert({
        title,
        slug,
        category: category || "Uncategorized",
        description: description || "",
        image_url: imageUrl,
        thumbnail_url: imageUrl,
        alt_text: title,
        width,
        height,
        aspect_ratio: aspectRatio,
        is_published: true,
        is_featured: false,
        sort_order: 0,
      });

      if (dbError) throw dbError;

      router.push("/admin/gallery");
      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Gagal menyimpan karya.";
      setError(message);
      setUploading(false);
    }
  };

  const categories = ["Architecture", "Fine Art", "Portrait", "Heritage", "Landscape", "Nature", "Urban"];

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight">Tambah Karya Baru</h1>
        <p className="text-neutral-500 text-sm mt-1">Upload gambar dan biarkan AI membantu mengisi deskripsi</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        {/* Image Upload */}
        <div>
          <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold mb-3 block">Gambar Karya</label>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors ${
              isDragActive ? "border-amber-500 bg-amber-500/5" : "border-white/10 hover:border-white/30"
            }`}
          >
            <input {...getInputProps()} />
            {imagePreview ? (
              <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden">
                <Image src={imagePreview} alt="Preview" fill className="object-contain" />
              </div>
            ) : (
              <div className="py-12">
                <p className="text-4xl mb-4">🖼️</p>
                <p className="text-sm text-neutral-400">Seret gambar ke sini atau klik untuk memilih</p>
                <p className="text-xs text-neutral-600 mt-2">JPG, PNG, WebP • Maks 10MB</p>
              </div>
            )}
          </div>

          {/* AI Describe Button */}
          {imageFile && (
            <button
              type="button"
              onClick={handleAIDescribe}
              disabled={aiLoading}
              className="mt-4 bg-purple-500/10 border border-purple-500/20 text-purple-400 hover:bg-purple-500/20 font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {aiLoading ? (
                <><div className="w-3 h-3 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" /> AI Menganalisis...</>
              ) : (
                <>✨ Minta AI Mendeskripsikan</>
              )}
            </button>
          )}
        </div>

        {/* Title */}
        <div>
          <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold mb-2 block">Judul Karya</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-500 transition-colors"
            placeholder="Contoh: Vivid Dimensions"
            required
          />
        </div>

        {/* Category */}
        <div>
          <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold mb-2 block">Kategori</label>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`text-xs font-bold px-4 py-2 rounded-full transition-all ${
                  category === cat
                    ? "bg-amber-500 text-black"
                    : "bg-white/5 text-neutral-400 hover:text-white border border-white/10"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold mb-2 block">
            Deskripsi Artistik
            {aiLoading && <span className="text-purple-400 ml-2">✨ AI sedang menulis...</span>}
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-500 transition-colors resize-none"
            placeholder="Deskripsi filosofis dan artistik tentang karya ini..."
          />
        </div>

        {error && (
          <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg py-3 px-4">{error}</p>
        )}

        {/* Submit */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={uploading}
            className="bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs uppercase tracking-widest px-8 py-4 rounded-xl transition-colors disabled:opacity-50"
          >
            {uploading ? "Mempublikasikan..." : "Publikasikan Karya"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-widest px-8 py-4 rounded-xl transition-colors"
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  );
}
