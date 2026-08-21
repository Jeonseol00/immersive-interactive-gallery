"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface GalleryRow {
  id: string;
  title: string;
  category: string;
  image_url: string;
  is_published: boolean;
  is_featured_waterfall: boolean;
  sort_order: number;
}

export default function AdminWaterfallPage() {
  const [items, setItems] = useState<GalleryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [waterfallLimit, setWaterfallLimit] = useState(8);
  const router = useRouter();
  const supabase = createClient();

  const loadData = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { router.push("/admin/login"); return; }

    // Fetch gallery items
    const { data: galleryData } = await supabase
      .from("gallery_items")
      .select("id, title, category, image_url, is_published, is_featured_waterfall, sort_order")
      .eq("is_published", true)
      .order("sort_order", { ascending: true });

    // Fetch waterfall limit
    const { data: settingsRow } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "waterfall_limit")
      .single();

    setItems(galleryData || []);
    if (settingsRow) setWaterfallLimit(parseInt(settingsRow.value, 10));
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const activeCount = items.filter((i) => i.is_featured_waterfall).length;

  const toggleWaterfall = async (id: string, current: boolean) => {
    // Prevent enabling more than the limit
    if (!current && activeCount >= waterfallLimit) {
      alert(`Batas waterfall tercapai (${waterfallLimit}). Nonaktifkan item lain atau naikkan batas.`);
      return;
    }

    await fetch("/api/admin/waterfall", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, is_featured_waterfall: !current }),
    });
    loadData();
  };

  const saveLimit = async () => {
    setSaving(true);
    await fetch("/api/admin/waterfall", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ waterfall_limit: waterfallLimit }),
    });
    setSaving(false);
    loadData();
  };

  const batchAction = async (action: "enable_all" | "disable_all") => {
    const label = action === "enable_all" ? "mengaktifkan semua" : "menonaktifkan semua";
    if (!confirm(`Yakin ingin ${label} item waterfall?`)) return;

    await fetch("/api/admin/waterfall", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    loadData();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Kontrol Waterfall</h1>
          <p className="text-neutral-500 text-sm mt-1">
            Pilih karya yang tampil di animasi homepage
          </p>
        </div>
      </div>

      {/* Stats & Settings */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {/* Active Counter */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-2">
          <span className="text-2xl">🌊</span>
          <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Slot Terisi</span>
          <span className="text-2xl font-black text-white">
            <span className={activeCount >= waterfallLimit ? "text-red-400" : "text-amber-400"}>
              {activeCount}
            </span>
            <span className="text-neutral-500 text-lg"> / {waterfallLimit}</span>
          </span>
        </div>

        {/* Limit Setting */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-3">
          <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Batas Waterfall</span>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={3}
              max={20}
              value={waterfallLimit}
              onChange={(e) => setWaterfallLimit(parseInt(e.target.value))}
              className="flex-1 accent-amber-500 h-2"
            />
            <span className="text-white font-black text-lg min-w-[2rem] text-center">{waterfallLimit}</span>
          </div>
          <button
            onClick={saveLimit}
            disabled={saving}
            className="bg-amber-500 hover:bg-amber-400 text-black font-bold text-[10px] uppercase tracking-widest px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            {saving ? "Menyimpan..." : "Simpan Batas"}
          </button>
        </div>

        {/* Batch Actions */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-3">
          <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Aksi Massal</span>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => batchAction("enable_all")}
              className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 font-bold text-[10px] uppercase tracking-widest px-4 py-2 rounded-lg transition-colors"
            >
              ✅ Aktifkan Semua
            </button>
            <button
              onClick={() => batchAction("disable_all")}
              className="bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 font-bold text-[10px] uppercase tracking-widest px-4 py-2 rounded-lg transition-colors"
            >
              🚫 Nonaktifkan Semua
            </button>
          </div>
        </div>
      </div>

      {/* Gallery Grid with Waterfall Toggle */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {items.map((item) => {
          const isActive = item.is_featured_waterfall;
          return (
            <button
              key={item.id}
              onClick={() => toggleWaterfall(item.id, isActive)}
              className={`group relative aspect-[3/4] rounded-2xl overflow-hidden border-2 transition-all duration-300 text-left ${
                isActive
                  ? "border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.2)]"
                  : "border-white/10 hover:border-white/30 opacity-60 hover:opacity-100"
              }`}
            >
              {/* Image */}
              <Image
                src={item.image_url}
                alt={item.title}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              />

              {/* Overlay */}
              <div className={`absolute inset-0 transition-colors duration-300 ${
                isActive
                  ? "bg-gradient-to-t from-amber-900/80 via-amber-900/20 to-transparent"
                  : "bg-gradient-to-t from-neutral-900/80 via-neutral-900/30 to-transparent"
              }`} />

              {/* Waterfall Badge */}
              <div className={`absolute top-3 right-3 text-lg transition-transform duration-300 ${
                isActive ? "scale-100" : "scale-75 opacity-50"
              }`}>
                {isActive ? "🌊" : "💤"}
              </div>

              {/* Info */}
              <div className="absolute inset-x-0 bottom-0 p-4">
                <span className={`text-[9px] font-bold uppercase tracking-widest block mb-1 ${
                  isActive ? "text-amber-400" : "text-neutral-500"
                }`}>
                  {item.category}
                </span>
                <h3 className="text-sm font-black text-white leading-tight line-clamp-2">
                  {item.title}
                </h3>
              </div>
            </button>
          );
        })}
      </div>

      {items.length === 0 && (
        <div className="w-full py-20 flex flex-col items-center justify-center text-center">
          <p className="text-neutral-500 font-mono text-sm">Belum ada karya. Tambahkan karya di menu Galeri Karya.</p>
        </div>
      )}
    </div>
  );
}
