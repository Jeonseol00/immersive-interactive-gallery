"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Preloader() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Hindari preloader muncu saat development refresh atau jika tidak di browser
    if (typeof window === "undefined") return;
    
    const hasLoaded = sessionStorage.getItem("preloader_done");
    if (hasLoaded) {
      setIsLoading(false);
      return;
    }

    // Hindari scroll saat loading
    document.body.style.overflow = "hidden";

    // Simulasi loading progress yang organik
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.floor(Math.random() * 10) + 2;
      if (currentProgress > 100) currentProgress = 100;
      setProgress(currentProgress);

      if (currentProgress === 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsLoading(false);
          sessionStorage.setItem("preloader_done", "true");
          document.body.style.overflow = "";
        }, 600); // Jeda sinematik sebentar pada angka 100%
      }
    }, 120);

    return () => {
      clearInterval(interval);
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="preloader"
          exit={{ y: "-100%", transition: { duration: 1.2, ease: [0.76, 0, 0.24, 1] } }}
          className="fixed inset-0 z-[100000] flex flex-col items-center justify-center bg-neutral-950 text-white"
        >
          {/* Logo dengan animasi split */}
          <div className="flex flex-col items-center overflow-hidden">
             <motion.div 
               initial={{ y: 50, opacity: 0, filter: "blur(10px)" }}
               animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
               transition={{ duration: 0.8 }}
               className="text-[15vw] md:text-[8vw] font-black tracking-tighter leading-none"
             >
               IMGAL
             </motion.div>
             
             {/* Progress Bar Tipis */}
             <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="flex items-center gap-4 mt-8 w-48 md:w-64"
              >
               <div className="h-[1px] w-full bg-white/20 relative overflow-hidden">
                 <motion.div 
                   className="absolute top-0 left-0 h-full bg-amber-500"
                   animate={{ width: `${progress}%` }}
                   transition={{ ease: "circOut" }}
                 />
               </div>
               <span className="font-mono text-xs w-8 text-right text-white/50">{progress}%</span>
             </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
