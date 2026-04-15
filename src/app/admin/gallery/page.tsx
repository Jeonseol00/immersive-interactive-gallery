"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

interface GalleryRow {
  id: string;
  title: string;
  slug: string;
  category: string;
  image_url: string;
  is_published: boolean;
  is_featured: boolean;
  is_featured_waterfall: boolean;
  created_at: string;
}

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { router.push("/admin/login"); return; }

    const { data } = await supabase
      .from("gallery_items")
      .select("*")
      .order("sort_order", { ascending: true });

    setItems(data || []);
    setLoading(false);
  };

  const togglePublish = async (id: string, current: boolean) => {
    await fetch("/api/admin/gallery", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, updates: { is_published: !current } }),
    });
    loadItems();
  };

  const toggleFeatured = async (id: string, current: boolean) => {
    await fetch("/api/admin/gallery", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, updates: { is_featured: !current } }),
    });
    loadItems();
  };

  const toggleWaterfall = async (id: string, current: boolean) => {
    await fetch("/api/admin/waterfall", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, is_featured_waterfall: !current }),
    });
    loadItems();
  };

  const deleteItem = async (id: string, title: string) => {
    if (!confirm(`Hapus karya "${title}"? Aksi ini tidak bisa dibatalkan.`)) return;
    await fetch("/api/admin/gallery", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    loadItems();
  };

  const filtered = items.filter((i) =>
    i.title.toLowerCase().includes(search.toLowerCase()) ||
    i.category.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Galeri Karya</h1>
          <p className="text-neutral-500 text-sm mt-1">{items.length} karya terdaftar</p>
        </div>
        <Link
          href="/admin/gallery/new"
          className="bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-xl transition-colors shrink-0"
        >
          + Tambah Karya
        </Link>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Cari judul atau kategori..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
        />
      </div>

      {/* Table */}
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left">
                <th className="px-4 py-3 text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Gambar</th>
                <th className="px-4 py-3 text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Judul</th>
                <th className="px-4 py-3 text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Kategori</th>
                <th className="px-4 py-3 text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Status</th>
                <th className="px-4 py-3 text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-neutral-800">
                      <Image src={item.image_url} alt="" fill className="object-cover" sizes="48px" />
                    </div>
                  </td>
                  <td className="px-4 py-3 font-bold text-white">{item.title}</td>
                  <td className="px-4 py-3 text-neutral-400">{item.category}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => togglePublish(item.id, item.is_published)}
                        className={`text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-full ${item.is_published ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}
                      >
                        {item.is_published ? "Publik" : "Draft"}
                      </button>
                      <button
                        onClick={() => toggleFeatured(item.id, item.is_featured)}
                        className={`text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-full ${item.is_featured ? "bg-amber-500/10 text-amber-400" : "bg-neutral-500/10 text-neutral-500"}`}
                      >
                        {item.is_featured ? "⭐" : "☆"}
                      </button>
                      <button
                        onClick={() => toggleWaterfall(item.id, item.is_featured_waterfall)}
                        className={`text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-full ${item.is_featured_waterfall ? "bg-cyan-500/10 text-cyan-400" : "bg-neutral-500/10 text-neutral-500"}`}
                        title="Toggle Waterfall"
                      >
                        {item.is_featured_waterfall ? "🌊" : "💤"}
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/gallery/${item.id}/edit`}
                        className="text-[10px] font-bold uppercase tracking-widest text-amber-500 hover:text-amber-300 transition-colors"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => deleteItem(item.id, item.title)}
                        className="text-[10px] font-bold uppercase tracking-widest text-red-500 hover:text-red-300 transition-colors"
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-neutral-500">
                    {search ? "Tidak ditemukan karya yang cocok." : "Belum ada karya. Klik \"+Tambah Karya\" untuk memulai."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
