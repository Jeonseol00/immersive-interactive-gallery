"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function GlobalBackground() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {/* Upgrade 4: Film Grain Overlay (Global) */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03] mix-blend-screen" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
      />

      {/* Upgrade 3: Ambient Gradient Orbs & Living Aurora (Global) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        
        {/* Base Layer: Global Topography */}
        <motion.div
           animate={{ rotate: [0, 360] }}
           transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
           className="absolute -inset-[100%] w-[300%] h-[300%] origin-[45%_55%] opacity-60"
           style={{ 
             backgroundImage: `repeating-radial-gradient(ellipse at center, transparent 0, transparent 35px, rgba(245, 158, 11, 0.25) 35px, rgba(245, 158, 11, 0.25) 36px)`
           }}
        />
        <motion.div
           animate={{ rotate: [360, 0] }}
           transition={{ duration: 140, repeat: Infinity, ease: "linear" }}
           className="absolute -inset-[100%] w-[300%] h-[300%] origin-[55%_45%] opacity-60"
           style={{ 
             backgroundImage: `repeating-radial-gradient(ellipse at center, transparent 0, transparent 38px, rgba(245, 158, 11, 0.15) 38px, rgba(245, 158, 11, 0.15) 39px)`
           }}
        />

        {/* Subtle Vignette Spotlight OVER Topography */}
        <div className="absolute inset-0 z-10" style={{ background: "radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.85) 100%)" }} />
        
        {/* Floating Dust Particles - Rendered Only On Client to prevent SSR Hydration Mismatch with Math.random() */}
        {mounted && Array.from({ length: 30 }).map((_, i) => {
          const size = Math.random() * 2 + 1;
          const left = Math.random() * 100;
          return (
            <motion.div
              key={`global-dust-${i}`}
              className="absolute bg-white rounded-full mix-blend-screen opacity-40 z-20"
              style={{ width: size, height: size, left: `${left}%`, top: "110%" }}
              animate={{ y: ["0vh", "-120vh"], x: [0, (Math.random() - 0.5) * 60] }}
              transition={{ duration: Math.random() * 20 + 20, repeat: Infinity, ease: "linear", delay: -(Math.random() * 40) }}
            />
          );
        })}

        {/* Orb 1: Amber Hangat (Kiri-Atas) */}
        <motion.div 
          animate={{ 
            x: ["-5%", "15%", "-5%"],
            y: ["-5%", "15%", "-5%"],
            scale: [1, 1.3, 1]
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[15%] -left-[5%] w-[65vw] md:w-[55vw] h-[65vw] md:h-[55vw] rounded-full bg-amber-800/40 blur-[100px] z-20"
        />
        {/* Orb 2: Cyan Dingin (Kanan-Bawah) */}
        <motion.div 
          animate={{ 
            x: ["10%", "-15%", "10%"],
            y: ["5%", "-10%", "5%"],
            scale: [1, 1.4, 1]
          }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-[15%] -right-[5%] w-[65vw] md:w-[55vw] h-[65vw] md:h-[55vw] rounded-full bg-cyan-800/25 blur-[100px] z-20"
        />
        {/* Orb 3: Rose Hangat (Tengah) */}
        <motion.div 
          animate={{ 
            x: ["-8%", "8%", "-8%"],
            y: ["8%", "-8%", "8%"],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-[30%] left-[25%] w-[50vw] md:w-[40vw] h-[50vw] md:h-[40vw] rounded-full bg-rose-900/15 blur-[120px] z-20"
        />
      </div>
    </>
  );
}
