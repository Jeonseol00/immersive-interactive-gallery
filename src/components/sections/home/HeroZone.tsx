"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { GalleryItem } from "@/types";

interface HeroZoneProps {
  items: GalleryItem[];
}

export function HeroZone({ items }: HeroZoneProps) {
  const { scrollYProgress: blurProgress } = useScroll();

  // ZONA 1: Ken Burns Image Scaling
  const scale = useTransform(blurProgress, [0, 1], [1, 1.4]);
  // ZONA 1: Parallax Title
  const yTitle = useTransform(blurProgress, [0, 1], ["0%", "80%"]);
  const yImage = useTransform(blurProgress, [0, 1], ["0%", "40%"]);

  // Pre-kalkulasi gambar hero
  const heroScatteredPositions = [
    "top-[10%] left-[5%] w-[40vw] md:w-[25vw] h-[55vw] md:h-[35vw] opacity-40 rotate-[-6deg]",
    "bottom-[15%] right-[10%] w-[35vw] md:w-[20vw] h-[45vw] md:h-[25vw] opacity-30 rotate-[8deg]",
    "top-[45%] right-[5%] w-[30vw] md:w-[18vw] h-[40vw] md:h-[22vw] opacity-50 rotate-[12deg]",
  ];

  return (
    <div className="relative w-full h-[100dvh] flex items-center justify-center pointer-events-none sticky top-0 shrink-0">
      <motion.div 
         style={{ y: yImage }} 
         className="absolute inset-0 w-full h-full overflow-hidden mask-hero"
      >
         <motion.div
            initial={false}
            animate={{ y: "0%", scale: 1 }}
            transition={{ duration: 1.5, ease: [0.76, 0, 0.24, 1] }} 
            className="w-full h-full absolute inset-0"
            style={{ willChange: "transform" }}
         >
             <motion.div 
               initial={{ scale: 1 }}
               animate={{ scale: 1.05 }}
               transition={{ duration: 25, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
               className="w-full h-full relative origin-center"
             >
                <Image 
                  src={items[0].images.fullResolution} 
                  alt="IMGAL Hero"
                  fill
                  className="object-cover"
                  priority
                  sizes="100vw"
                />
             </motion.div>
         </motion.div>
         <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-neutral-950/40 mix-blend-multiply" />
         <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-transparent" />
      </motion.div>

      {/* Scattered Hero Cards Overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {items.slice(1, 4).map((item, index) => (
          <motion.div
            key={`hero-scatter-${item.id}`}
            style={{ y: useTransform(blurProgress, [0, 1], ["0%", `${(index + 1) * 20}%`]) }}
            className={cn(
              "scattered-image absolute overflow-hidden rounded-2xl border border-white/10",
              heroScatteredPositions[index]
            )}
          >
            <Image
              src={item.images.thumbnail}
              alt=""
              fill
              className="object-cover grayscale brightness-50 contrast-110"
              sizes="20vw"
              quality={40}
            />
          </motion.div>
        ))}
      </div>

      <motion.div 
         initial={{ opacity: 0, y: 50 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 1.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
         style={{ y: yTitle, willChange: "transform, opacity" }}
         className="flex flex-col items-center text-center relative z-20 pointer-events-none"
      >
        <h1 className="text-[12vw] font-black tracking-tighter text-white drop-shadow-2xl leading-none">IMGAL</h1>
        <p className="text-amber-500 font-bold uppercase tracking-[0.5em] text-sm mt-8 drop-shadow-md">Ruang Digital Mahakarya Abadi</p>
      </motion.div>

      <motion.button 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-12 flex flex-col items-center gap-6 group cursor-pointer pointer-events-auto z-20"
        onClick={() => {
          if(typeof window !== "undefined") {
            window.scrollTo({ top: window.innerHeight, behavior: "smooth" })
          }
        }}
      >
        <span className="text-[10px] font-black text-white/50 uppercase tracking-[0.3em] group-hover:text-amber-400 transition-colors">Jelajahi Koleksi</span>
        <div className="w-px h-16 bg-gradient-to-b from-white/50 to-transparent group-hover:from-amber-400 transition-colors" />
      </motion.button>
    </div>
  );
}
