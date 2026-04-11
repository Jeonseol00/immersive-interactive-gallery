"use client";

import { motion } from "framer-motion";
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

export function GlobalBackground() {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<ThemeColors>(defaultTheme);
  
  useEffect(() => {
    setMounted(true);

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
        
        {/* Base Layer: Global Topography */}
        <motion.div
           animate={{ rotate: [0, 360] }}
           transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
           className="absolute -inset-[100%] w-[300%] h-[300%] origin-[45%_55%] opacity-60"
           style={{ 
             backgroundImage: `repeating-radial-gradient(ellipse at center, transparent 0, transparent 35px, rgba(245, 158, 11, 0.25) 35px, rgba(245, 158, 11, 0.25) 36px)`,
             willChange: "transform"
           }}
        />
        <motion.div
           animate={{ rotate: [360, 0] }}
           transition={{ duration: 140, repeat: Infinity, ease: "linear" }}
           className="absolute -inset-[100%] w-[300%] h-[300%] origin-[55%_45%] opacity-60"
           style={{ 
             backgroundImage: `repeating-radial-gradient(ellipse at center, transparent 0, transparent 38px, rgba(245, 158, 11, 0.15) 38px, rgba(245, 158, 11, 0.15) 39px)`,
             willChange: "transform"
           }}
        />

        {/* Subtle Vignette Spotlight */}
        <div className="absolute inset-0 z-10" style={{ background: "radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.85) 100%)" }} />
        
        {/* Floating Dust Particles */}
        {mounted && Array.from({ length: 30 }).map((_, i) => {
          const size = Math.random() * 2 + 1;
          const left = Math.random() * 100;
          return (
            <motion.div
              key={`global-dust-${i}`}
              className="absolute bg-white rounded-full mix-blend-screen opacity-40 z-20"
              style={{ width: size, height: size, left: `${left}%`, top: "110%", willChange: "transform" }}
              animate={{ y: ["0vh", "-120vh"], x: [0, (Math.random() - 0.5) * 60] }}
              transition={{ duration: Math.random() * 20 + 20, repeat: Infinity, ease: "linear", delay: -(Math.random() * 40) }}
            />
          );
        })}

        {/* Dynamic Orbs — Colors from Theme Preset */}
        <motion.div 
          animate={{ x: ["-5%", "15%", "-5%"], y: ["-5%", "15%", "-5%"], scale: [1, 1.3, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[15%] -left-[5%] w-[65vw] md:w-[55vw] h-[65vw] md:h-[55vw] rounded-full blur-[100px] z-20 transition-colors duration-[3000ms]"
          style={{ background: theme.orb1, willChange: "transform" }}
        />
        <motion.div 
          animate={{ x: ["10%", "-15%", "10%"], y: ["5%", "-10%", "5%"], scale: [1, 1.4, 1] }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-[15%] -right-[5%] w-[65vw] md:w-[55vw] h-[65vw] md:h-[55vw] rounded-full blur-[100px] z-20 transition-colors duration-[3000ms]"
          style={{ background: theme.orb2, willChange: "transform" }}
        />
        <motion.div 
          animate={{ x: ["-8%", "8%", "-8%"], y: ["8%", "-8%", "8%"], scale: [1, 1.2, 1] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-[30%] left-[25%] w-[50vw] md:w-[40vw] h-[50vw] md:h-[40vw] rounded-full blur-[120px] z-20 transition-colors duration-[3000ms]"
          style={{ background: theme.orb3, willChange: "transform" }}
        />
      </div>
    </>
  );
}
