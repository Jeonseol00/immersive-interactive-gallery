"use client";

import { useEffect, useState } from "react";

interface ThemeColors {
  orb1: string;
  orb2: string;
  orb3: string;
  grainOpacity: number;
}

const defaultTheme: ThemeColors = {
  orb1: "rgba(245,158,11,0.4)",
  orb2: "rgba(6,182,212,0.25)",
  orb3: "rgba(159,18,57,0.15)",
  grainOpacity: 0.03,
};

/**
 * Generate deterministic dust particle styles at build time.
 * Each particle gets unique CSS keyframe offsets via inline custom properties,
 * eliminating the need for Framer Motion JS calculations per frame.
 */
function generateDustParticles(count: number) {
  return Array.from({ length: count }, (_, i) => {
    const size = (i * 1.7 + 0.8) % 3 + 0.5; // deterministic pseudo-random 0.5-3.5px
    const left = ((i * 37 + 13) % 100);       // spread across viewport
    const duration = (i * 3.1 % 20) + 18;      // 18-38s cycle
    const delay = -(i * 2.7 % 35);             // stagger via negative delay
    const drift = ((i * 7 + 3) % 60) - 30;     // horizontal drift -30 to +30px
    return { size, left, duration, delay, drift };
  });
}

export function GlobalBackground() {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<ThemeColors>(defaultTheme);
  const [particleCount, setParticleCount] = useState(30);

  useEffect(() => {
    setMounted(true);

    // Adaptive Quality: detect low-end devices
    if (typeof navigator !== "undefined") {
      const cores = navigator.hardwareConcurrency || 4;
      const isMobile = /Mobi|Android|iPhone/i.test(navigator.userAgent);
      if (cores <= 4 || isMobile) {
        setParticleCount(12); // Reduce particles on weak devices
      }
    }

    // Fetch active theme from Supabase (with graceful fallback)
    const loadTheme = async () => {
      try {
        const res = await fetch("/api/theme");
        if (res.ok) {
          const data = await res.json();
          if (data.orb1_color) {
            setTheme({
              orb1: data.orb1_color,
              orb2: data.orb2_color,
              orb3: data.orb3_color,
              grainOpacity: data.grain_opacity ?? 0.03,
            });
          }
        }
      } catch {
        // Fallback to defaults — no problem
      }
    };

    loadTheme();
  }, []);

  const dustParticles = generateDustParticles(particleCount);

  return (
    <>
      {/* Film Grain Overlay (Global) */}
      <div className="fixed inset-0 pointer-events-none z-50 mix-blend-screen" 
           style={{ 
             opacity: theme.grainOpacity,
             backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` 
           }} 
      />

      {/* Ambient Gradient Orbs & Living Aurora (Global) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        
        {/* ═══════════════════════════════════════════════════════════ */}
        {/* Base Layer: Global Topography — Pure CSS (was Framer Motion) */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <div
           className="absolute -inset-[100%] w-[300%] h-[300%] origin-[45%_55%] opacity-60 animate-[spin_100s_linear_infinite]"
           style={{ 
             backgroundImage: `repeating-radial-gradient(ellipse at center, transparent 0, transparent 35px, rgba(245, 158, 11, 0.25) 35px, rgba(245, 158, 11, 0.25) 36px)`,
             willChange: "transform",
             backfaceVisibility: "hidden",
           }}
        />
        <div
           className="absolute -inset-[100%] w-[300%] h-[300%] origin-[55%_45%] opacity-60 animate-[spin_140s_linear_infinite_reverse]"
           style={{ 
             backgroundImage: `repeating-radial-gradient(ellipse at center, transparent 0, transparent 38px, rgba(245, 158, 11, 0.15) 38px, rgba(245, 158, 11, 0.15) 39px)`,
             willChange: "transform",
             backfaceVisibility: "hidden",
           }}
        />

        {/* Subtle Vignette Spotlight */}
        <div className="absolute inset-0 z-10" style={{ background: "radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.85) 100%)" }} />
        
        {/* ═══════════════════════════════════════════════════════════ */}
        {/* Floating Dust Particles — Pure CSS (was 30x Framer Motion) */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {mounted && dustParticles.map((p, i) => (
          <div
            key={`dust-${i}`}
            className="absolute bg-white rounded-full mix-blend-screen opacity-40 z-20 animate-[dust-rise_var(--dust-dur)_linear_var(--dust-delay)_infinite]"
            style={{
              width: p.size,
              height: p.size,
              left: `${p.left}%`,
              bottom: "-5%",
              "--dust-dur": `${p.duration}s`,
              "--dust-delay": `${p.delay}s`,
              "--dust-drift": `${p.drift}px`,
              willChange: "transform",
              backfaceVisibility: "hidden",
            } as React.CSSProperties}
          />
        ))}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* Dynamic Orbs — Pure CSS (was Framer Motion)                */}
        {/* Colors from Theme Preset                                   */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <div 
          className="absolute -top-[15%] -left-[5%] w-[65vw] md:w-[55vw] h-[65vw] md:h-[55vw] rounded-full blur-[100px] z-20 transition-colors duration-[3000ms] animate-[float-orb-1_18s_ease-in-out_infinite]"
          style={{ background: theme.orb1, willChange: "transform", backfaceVisibility: "hidden" }}
        />
        <div 
          className="absolute -bottom-[15%] -right-[5%] w-[65vw] md:w-[55vw] h-[65vw] md:h-[55vw] rounded-full blur-[100px] z-20 transition-colors duration-[3000ms] animate-[float-orb-2_22s_ease-in-out_infinite]"
          style={{ background: theme.orb2, willChange: "transform", backfaceVisibility: "hidden" }}
        />
        <div 
          className="absolute top-[30%] left-[25%] w-[50vw] md:w-[40vw] h-[50vw] md:h-[40vw] rounded-full blur-[120px] z-20 transition-colors duration-[3000ms] animate-[float-orb-3_25s_ease-in-out_infinite]"
          style={{ background: theme.orb3, willChange: "transform", backfaceVisibility: "hidden" }}
        />
      </div>
    </>
  );
}
