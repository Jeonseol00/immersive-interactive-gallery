"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface ThemePreset {
  id: string;
  name: string;
  slug: string;
  orb1_color: string;
  orb2_color: string;
  orb3_color: string;
  is_active: boolean;
}

export default function AdminThemesPage() {
  const [themes, setThemes] = useState<ThemePreset[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    loadThemes();
  }, []);

  const loadThemes = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { router.push("/admin/login"); return; }

    const { data } = await supabase.from("theme_presets").select("*").order("created_at");
    setThemes(data || []);
    setLoading(false);
  };

  const activateTheme = async (id: string) => {
    // Deactivate all first
    await supabase.from("theme_presets").update({ is_active: false }).neq("id", "none");
    // Activate selected
    await supabase.from("theme_presets").update({ is_active: true }).eq("id", id);
    loadThemes();
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
      <div className="mb-10">
        <h1 className="text-3xl font-black tracking-tight">Tema Visual</h1>
        <p className="text-neutral-500 text-sm mt-1">Ubah suasana latar belakang website secara instan</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {themes.map((theme) => (
          <div
            key={theme.id}
            className={`relative bg-neutral-900 border rounded-2xl overflow-hidden transition-all duration-300 ${
              theme.is_active ? "border-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.15)]" : "border-white/10 hover:border-white/20"
            }`}
          >
            {/* Mini Orb Preview */}
            <div className="relative h-40 overflow-hidden bg-black">
              <div
                className="absolute -top-[30%] -left-[10%] w-[60%] h-[60%] rounded-full blur-[40px]"
                style={{ background: theme.orb1_color }}
              />
              <div
                className="absolute -bottom-[30%] -right-[10%] w-[60%] h-[60%] rounded-full blur-[40px]"
                style={{ background: theme.orb2_color }}
              />
              <div
                className="absolute top-[20%] left-[30%] w-[40%] h-[40%] rounded-full blur-[50px]"
                style={{ background: theme.orb3_color }}
              />
              {/* Vignette */}
              <div className="absolute inset-0" style={{ background: "radial-gradient(circle, transparent 30%, rgba(0,0,0,0.8) 100%)" }} />
            </div>

            <div className="p-5 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-white">{theme.name}</h3>
                {theme.is_active && (
                  <span className="text-[9px] uppercase tracking-widest text-amber-500 font-bold">Aktif Sekarang</span>
                )}
              </div>
              {!theme.is_active && (
                <button
                  onClick={() => activateTheme(theme.id)}
                  className="bg-white/5 border border-white/10 hover:bg-amber-500 hover:text-black hover:border-amber-500 text-white font-bold text-[10px] uppercase tracking-widest px-4 py-2 rounded-xl transition-all"
                >
                  Aktifkan
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
