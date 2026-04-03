"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

type PreloaderPhase = "loading" | "text" | "reel" | "exit";

export function Preloader() {
  const [phase, setPhase] = useState<PreloaderPhase>("loading");
  const [progress, setProgress] = useState(0);
  const [reelImages, setReelImages] = useState<string[]>([]);
  const timersRef = useRef<NodeJS.Timeout[]>([]);
  const phaseStartedRef = useRef(false);

  // Fetch gallery images for the reel phase
  useEffect(() => {
    fetch("/api/gallery?page=1&limit=10")
      .then((res) => res.json())
      .then((data) => {
        if (data.items) {
          const images = data.items.map((item: { images: { thumbnail: string } }) => item.images.thumbnail);
          setReelImages(images);
        }
      })
      .catch(() => {
        // Fallback: reel will just be skipped if images fail
      });
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Session check — only show once per tab session
    const SEEN_KEY = "preloader_complete_v6";
    try {
      const hasLoaded = sessionStorage.getItem(SEEN_KEY);
      if (hasLoaded) {
        setPhase("exit");
        return;
      }
    } catch { /* private browsing */ }

    // Guard against React Strict Mode double-fire
    if (phaseStartedRef.current) return;
    phaseStartedRef.current = true;

    document.body.style.overflow = "hidden";

    // Phase 1: Loading progress
    let currentProgress = 0;
    const interval = setInterval(() => {
      const step = currentProgress < 50 ? 5 : 18;
      currentProgress += Math.floor(Math.random() * step) + 1;
      if (currentProgress > 100) currentProgress = 100;
      setProgress(currentProgress);

      if (currentProgress === 100) {
        clearInterval(interval);

        // Hold at 100% for 600ms dramatic pause, then → text phase
        const t1 = setTimeout(() => {
          setPhase("text");
        }, 600);
        timersRef.current.push(t1);

        // Text phase lasts 3 seconds, then → reel phase
        const t2 = setTimeout(() => {
          setPhase("reel");
        }, 600 + 3000);
        timersRef.current.push(t2);

        // Reel phase lasts 2.5 seconds, then → exit
        const t3 = setTimeout(() => {
          setPhase("exit");
          try {
            sessionStorage.setItem(SEEN_KEY, "true");
            sessionStorage.setItem("preloader_done", "true");
          } catch {}
          document.body.style.overflow = "";
          if (typeof window !== "undefined") {
            window.dispatchEvent(new Event("preloader_finished"));
          }
        }, 600 + 3000 + 2500);
        timersRef.current.push(t3);
      }
    }, 100);

    return () => {
      if (!phaseStartedRef.current) {
        clearInterval(interval);
        timersRef.current.forEach(clearTimeout);
        document.body.style.overflow = "";
      }
    };
  }, []);

  const text = "IMGAL";
  const letters = text.split("");

  // Build reel pillar data
  const pillar1 = reelImages.length > 0 ? [...reelImages.slice(0, 5), ...reelImages.slice(0, 2)] : [];
  const pillar2 = reelImages.length > 0 ? [...reelImages.slice(3, 8).reverse(), ...reelImages.slice(3, 5)] : [];
  const pillar3 = reelImages.length > 0 ? [...reelImages.slice(6, 10), ...reelImages.slice(0, 3)] : [];

  return (
    <AnimatePresence>
      {phase !== "exit" && (
        <motion.div
          key="preloader-master"
          exit={{ y: "-100%", transition: { duration: 1.2, ease: [0.76, 0, 0.24, 1] } }}
          className="fixed inset-0 z-[100000] flex flex-col items-center justify-center bg-black text-white pointer-events-auto overflow-hidden"
        >
          {/* Film Grain Noise */}
          <div 
            className="absolute inset-0 z-0 opacity-[0.05]" 
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
          />

          {/* Phase Content — uses AnimatePresence mode="wait" for clean transitions */}
          <AnimatePresence mode="wait">
            
            {/* ━━━ PHASE 1: Loading ━━━ */}
            {phase === "loading" && (
              <motion.div
                key="phase-loading"
                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.4 } }}
                className="flex flex-col items-center z-10 relative w-full px-8"
              >
                {/* Staggered Letter Reveal */}
                <div className="flex overflow-hidden pb-4 mb-8">
                  {letters.map((char, index) => (
                    <motion.span
                      key={`loader-char-${index}`}
                      initial={{ y: "120%", rotate: 5, opacity: 0 }}
                      animate={{ y: 0, rotate: 0, opacity: 1 }}
                      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: index * 0.1 }}
                      className="text-[18vw] md:text-[10vw] font-black tracking-tighter leading-[0.85] inline-block"
                    >
                      {char}
                    </motion.span>
                  ))}
                </div>
                
                {/* Progress Bar */}
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
              </motion.div>
            )}

            {/* ━━━ PHASE 2: Golden Text ━━━ */}
            {phase === "text" && (
              <motion.div
                key="phase-text"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.3 } }}
                className="flex flex-col items-center justify-center gap-3 lg:gap-4 z-10 relative"
              >
                <div className="overflow-hidden px-4 py-2">
                  <motion.h2 
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
                    className="text-3xl md:text-5xl font-mono tracking-widest uppercase text-neutral-400"
                  >
                    Setiap Karya
                  </motion.h2>
                </div>
                <div className="overflow-hidden px-4 py-2">
                  <motion.h2 
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
                    className="text-5xl md:text-7xl font-black text-amber-500 tracking-tighter"
                  >
                    Punya Cerita.
                  </motion.h2>
                </div>
              </motion.div>
            )}

            {/* ━━━ PHASE 3: Image Reel (Waterfall) ━━━ */}
            {phase === "reel" && reelImages.length > 0 && (
              <motion.div
                key="phase-reel"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.8 }}
                exit={{ opacity: 0, transition: { duration: 0.4 } }}
                className="absolute inset-0 flex gap-4 md:gap-8 z-10 w-full h-full justify-center rotate-[-5deg] scale-110 pointer-events-none"
              >
                {/* Pillar 1 */}
                <motion.div 
                  initial={{ y: "100%" }} 
                  animate={{ y: "-100%" }} 
                  transition={{ duration: 2.2, ease: "linear" }}
                  className="flex flex-col gap-4"
                >
                  {pillar1.map((src, i) => (
                    <div key={`p1-${i}`} className="relative w-32 h-48 md:w-56 md:h-80 rounded-[1.5rem] shadow-2xl brightness-75 sepia-[.2] overflow-hidden border border-white/10 shrink-0">
                      <Image src={src} alt="" fill sizes="25vw" className="object-cover" priority quality={35} />
                    </div>
                  ))}
                </motion.div>

                {/* Pillar 2 */}
                <motion.div 
                  initial={{ y: "150%" }} 
                  animate={{ y: "-150%" }} 
                  transition={{ duration: 2.1, ease: "linear" }}
                  className="flex flex-col gap-4 z-[-1]"
                >
                  {pillar2.map((src, i) => (
                    <div key={`p2-${i}`} className="relative w-32 h-48 md:w-56 md:h-80 rounded-[1.5rem] shadow-2xl brightness-50 sepia-[.4] overflow-hidden border border-white/10 shrink-0">
                      <Image src={src} alt="" fill sizes="25vw" className="object-cover" priority quality={35} />
                    </div>
                  ))}
                </motion.div>

                {/* Pillar 3 — Desktop Only */}
                <motion.div 
                  initial={{ y: "80%" }} 
                  animate={{ y: "-100%" }} 
                  transition={{ duration: 2.3, ease: "linear" }}
                  className="hidden md:flex flex-col gap-4"
                >
                  {pillar3.map((src, i) => (
                    <div key={`p3-${i}`} className="relative w-32 h-48 md:w-56 md:h-80 rounded-[1.5rem] shadow-2xl brightness-75 sepia-[.2] overflow-hidden border border-white/10 shrink-0">
                      <Image src={src} alt="" fill sizes="25vw" className="object-cover" priority quality={35} />
                    </div>
                  ))}
                </motion.div>
                
                {/* Edge Gradients */}
                <div className="absolute inset-x-0 top-0 h-[25vh] bg-gradient-to-b from-black to-transparent z-20 pointer-events-none" />
                <div className="absolute inset-x-0 bottom-0 h-[25vh] bg-gradient-to-t from-black to-transparent z-20 pointer-events-none" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
