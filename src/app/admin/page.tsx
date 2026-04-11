"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface Stats {
  totalWorks: number;
  totalCategories: number;
  featuredWorks: number;
  recentTitle: string;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadStats = async () => {
      const supabase = createClient();

      // Check auth
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/admin/login");
        return;
      }

      // Fetch stats
      const { data: items, error } = await supabase
        .from("gallery_items")
        .select("*")
        .order("created_at", { ascending: false });

      if (error || !items) {
        setStats({ totalWorks: 0, totalCategories: 0, featuredWorks: 0, recentTitle: "-" });
        setLoading(false);
        return;
      }

      const categories = new Set(items.map((i) => i.category));
      setStats({
        totalWorks: items.length,
        totalCategories: categories.size,
        featuredWorks: items.filter((i) => i.is_featured).length,
        recentTitle: items[0]?.title || "-",
      });
      setLoading(false);
    };

    loadStats();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const statCards = [
    { label: "Total Karya", value: stats?.totalWorks ?? 0, icon: "🖼️" },
    { label: "Kategori", value: stats?.totalCategories ?? 0, icon: "📂" },
    { label: "Karya Unggulan", value: stats?.featuredWorks ?? 0, icon: "⭐" },
    { label: "Karya Terbaru", value: stats?.recentTitle ?? "-", icon: "🕐" },
  ];

  return (
    <div>
      <div className="mb-10">
        <h1 className="text-3xl font-black tracking-tight">Dashboard</h1>
        <p className="text-neutral-500 text-sm mt-1">Kelola galeri seni digital Anda</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {statCards.map((card) => (
          <div key={card.label} className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-2">
            <span className="text-2xl">{card.icon}</span>
            <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">{card.label}</span>
            <span className="text-2xl font-black text-white">{card.value}</span>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-lg font-bold mb-4">Aksi Cepat</h2>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => router.push("/admin/gallery/new")}
            className="bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-xl transition-colors"
          >
            + Tambah Karya Baru
          </button>
          <button
            onClick={() => router.push("/admin/themes")}
            className="bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-xl transition-colors"
          >
            🎨 Ubah Tema Visual
          </button>
        </div>
      </div>
    </div>
  );
}
