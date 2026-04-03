"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Preloader() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    
    // Membaca Session Storage (agar hanya muncul sekali per tab sesi)
    // Jika Anda ingin menguji terus menerus, hapus pengecekan sessionStorage ini.
    const hasLoaded = sessionStorage.getItem("preloader_done");
    if (hasLoaded) {
      setIsLoading(false);
      return;
    }

    document.body.style.overflow = "hidden";

    // Simulasi loading progress gaya 'Odometer' lambat lalu cepat
    let currentProgress = 0;
    const interval = setInterval(() => {
      // Algoritma percepatan organik
      const step = currentProgress < 50 ? 5 : 18;
      currentProgress += Math.floor(Math.random() * step) + 1;
      
      if (currentProgress > 100) currentProgress = 100;
      setProgress(currentProgress);

      if (currentProgress === 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsLoading(false);
          sessionStorage.setItem("preloader_done", "true");
          document.body.style.overflow = "";
        }, 800); // Tahan persentase di 100% sebentar (dramatic pause 0.8s)
      }
    }, 100);

    return () => {
      clearInterval(interval);
      document.body.style.overflow = "";
    };
  }, []);

  // Split teks untuk menganimasi huruf satu per satu
  const text = "IMGAL";
  const letters = text.split("");

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="preloader"
          // Efek elevator naik seketika (Wipe out)
          exit={{ y: "-100%", transition: { duration: 1.2, ease: [0.76, 0, 0.24, 1] } }}
          className="fixed inset-0 z-[100000] flex flex-col items-center justify-center bg-black text-white pointer-events-auto"
        >
          {/* Detail Premium 1: Subtle Film Grain Noise pada latar belakang */}
          <div className="absolute inset-0 z-0 opacity-[0.05]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />

          <div className="flex flex-col items-center z-10 relative w-full px-8">
            
             {/* Detail Premium 2: Staggered Clip-path Letter Reveal */}
             <div className="flex overflow-hidden pb-4 mb-8">
               {letters.map((char, index) => (
                 <motion.span
                   key={`loader-char-${index}`}
                   initial={{ y: "120%", rotate: 5, opacity: 0 }}
                   animate={{ y: 0, rotate: 0, opacity: 1 }}
                   transition={{ 
                     duration: 1, 
                     ease: [0.22, 1, 0.36, 1], 
                     delay: index * 0.1 
                   }}
                   className="text-[18vw] md:text-[10vw] font-black tracking-tighter leading-[0.85] inline-block"
                 >
                   {char}
                 </motion.span>
               ))}
             </div>
             
             {/* Detail Premium 3: Architectural Progress Bar */}
             <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="flex flex-col items-center w-full max-w-sm gap-4"
              >
               <div className="flex justify-between w-full text-[9px] md:text-[10px] font-mono tracking-[0.3em] uppercase">
                 <span className="text-neutral-500">System Boot</span>
                 <motion.span 
                   animate={{
                      color: progress === 100 ? "#F59E0B" : "#FFFFFF",
                      scale: progress === 100 ? 1.1 : 1
                   }}
                   className="font-bold origin-right transition-colors"
                 >
                   {progress}%
                 </motion.span>
               </div>
               
               <div className="h-[2px] w-full bg-white/10 relative overflow-hidden">
                 <motion.div 
                   className="absolute top-0 left-0 h-full"
                   animate={{ 
                     width: `${progress}%`,
                     backgroundColor: progress === 100 ? "#F59E0B" : "#FFFFFF"
                   }}
                   transition={{ ease: "circOut", duration: 0.2 }}
                 />
               </div>
             </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
