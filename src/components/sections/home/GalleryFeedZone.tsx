"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { GalleryItem } from "@/types";

interface GalleryFeedZoneProps {
  items: GalleryItem[];
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  activeItem: GalleryItem;
}

export function GalleryFeedZone({ items, activeIndex, setActiveIndex, activeItem }: GalleryFeedZoneProps) {
  const router = useRouter();

  // Pick some scattered items based on active item to create variation
  const zone2ScatteredItems = useMemo(() => {
    const list = [...items];
    const itemHole = list.splice(activeIndex, 1)[0];
    return [itemHole, ...list].slice(0, 4); // active item + 3 others
  }, [items, activeIndex]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 80 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      className="container mx-auto px-6 md:px-12 relative z-10 flex flex-col md:flex-row min-h-[70vh] md:min-h-screen gap-8 md:gap-16 items-center shrink-0 pt-32 pb-20 md:py-0"
    >
      
      {/* Left Side: Interactive Text Index */}
      <div className="w-full md:w-1/3 flex flex-col shrink-0 gap-6 md:gap-8 h-full justify-center">
        <div className="flex justify-between items-center text-xs tracking-widest text-neutral-500 font-mono uppercase border-b border-white/10 pb-4 mb-2 md:mb-4">
          <span>Works / Mirage</span>
          <span className="md:hidden">Scroll & Tap</span>
          <span className="hidden md:inline">Hover & Click</span>
        </div>

        <div className="flex flex-col gap-0 md:gap-1 max-h-[50vh] md:max-h-[60vh] overflow-y-auto no-scrollbar pointer-events-auto pr-4">
          {items.map((item, idx) => {
            const isActive = activeIndex === idx;
            return (
              <div key={`index-${item.id}`} className="flex flex-col">
                <button
                  onMouseEnter={() => {
                    if (window.innerWidth >= 768) {
                      setActiveIndex(idx);
                    }
                  }}
                  onClick={() => {
                     // Mobile Tap toggles active, Desktop Click navigates
                     if (window.innerWidth < 768) {
                        setActiveIndex(idx);
                     } else {
                        router.push(`/gallery/${item.slug}`);
                     }
                  }}
                  className={cn(
                    "text-left py-3 md:py-2 text-xl md:text-2xl lg:text-3xl font-black uppercase transition-all duration-300 w-full truncate tracking-tighter hover:cursor-pointer",
                    isActive 
                      ? "text-amber-400 opacity-100 pl-4 md:pl-6 border-l-4 border-amber-400 bg-white/5" 
                      : "text-white opacity-40 hover:opacity-100 hover:pl-2"
                  )}
                >
                  {item.title}
                </button>

                {/* Mobile Accordion Expansion (Mobile Only) */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      className="md:hidden overflow-hidden w-full flex flex-col mt-2 mb-6"
                    >
                       <Link href={`/gallery/${item.slug}`} className="block relative w-full aspect-[4/3] rounded-2xl overflow-hidden mb-4 group shadow-2xl border border-white/10">
                         <motion.div layoutId={`gallery-image-mobile-${item.id}`} className="w-full h-full relative">
                           <Image 
                             src={item.images.fullResolution} 
                             alt={item.title} 
                             fill 
                             className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                             sizes="(max-width: 768px) 100vw"
                           />
                         </motion.div>
                         <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                           <span className="bg-amber-400 text-black px-6 py-3 font-bold rounded-full tracking-wider uppercase text-xs">
                             Lihat Detail
                           </span>
                         </div>
                       </Link>
                       <p className="text-sm text-neutral-400 px-2 leading-relaxed">
                         {item.interactions.accordionDescription}
                       </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Side: Vast Central Focal Image & Zone 2 Scattered Ambient (Desktop Only) */}
      <div className="hidden md:flex flex-1 flex-col justify-center items-center relative h-full pointer-events-none">
        
        {/* Scattered Ambient Card Shuffle (Professional Dealing Cards Effect) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl aspect-[3/2] pointer-events-none z-0">
          <AnimatePresence>
            {zone2ScatteredItems.map((item, index) => {
              // Konfigurasi posisi untuk masing-masing urutan kartu (3D Parallax Shuffle)
              const transforms = [
                { rotate: 6, x: "25%", y: "-15%", scale: 0.9, opacity: 0.5, zIndex: 4 },
                { rotate: -8, x: "-30%", y: "20%", scale: 0.8, opacity: 0.35, zIndex: 3 },
                { rotate: -12, x: "-40%", y: "-10%", scale: 0.7, opacity: 0.25, zIndex: 2 },
                { rotate: 15, x: "35%", y: "25%", scale: 0.6, opacity: 0.15, zIndex: 1 },
              ];
              const prop = transforms[index] || transforms[0];

              return (
                <motion.div
                  key={`zone2-scatter-${item.id}`}
                  initial={{ opacity: 0, scale: 0.3, y: 150 }}
                  animate={{ 
                    opacity: prop.opacity, 
                    scale: prop.scale, 
                    rotate: prop.rotate, 
                    x: prop.x, 
                    y: prop.y,
                    zIndex: prop.zIndex
                  }}
                  exit={{ opacity: 0, scale: 0.4, y: 150, x: "50%", rotate: prop.rotate * 2 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 80, 
                    damping: 15, 
                    mass: 1 + index * 0.3 // Menciptakan efek serentak yang organik
                  }}
                  className="absolute inset-0 origin-center pointer-events-none"
                  style={{ willChange: "transform, opacity" }}
                >
                  <motion.div
                     animate={{ 
                       y: ["-4%", "4%"],
                       x: ["-2%", "2%"],
                       rotate: [-2, 2],
                     }}
                     transition={{
                       duration: 4 + index * 1.5, // varied duration for organic feel
                       repeat: Infinity,
                       repeatType: "reverse",
                       ease: "easeInOut"
                     }}
                     className="relative w-full h-full overflow-hidden rounded-[2rem] border border-white/20 mix-blend-luminosity shadow-2xl"
                     style={{ willChange: "transform" }}
                  >
                    <Image
                      src={item.images.thumbnail}
                      alt=""
                      fill
                      className="object-cover grayscale brightness-75 contrast-125"
                      sizes="20vw"
                      quality={30}
                    />
                  </motion.div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Upgrade 1: Crossfade Focal Image — Proporsi Diperkecil */}
        <div className="relative w-full max-w-xl aspect-[3/2] mb-8 z-10">
          <AnimatePresence mode="popLayout">
            <motion.div
              key={`desktop-focal-${activeItem.id}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05, zIndex: 10 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 w-full h-full pointer-events-auto"
              style={{ willChange: "transform, opacity" }}
            >
              <Link 
                href={`/gallery/${activeItem.slug}`} 
                className="group relative w-full h-full rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 block cursor-pointer transition-transform duration-500 hover:scale-[1.02]"
              >
                 <motion.div layoutId={`gallery-image-${activeItem.id}`} className="w-full h-full relative">
                  <Image 
                    src={activeItem.images.fullResolution} 
                    alt={activeItem.title} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                    priority
                    sizes="50vw"
                  />
                 </motion.div>

                 {/* Hover Discover Overlay Internal */}
                 <div className="absolute inset-0 bg-neutral-950/10 mix-blend-overlay pointer-events-none group-hover:bg-neutral-950/70 transition-colors duration-700"></div>
                 
                 {/* Metadata Muncul Saat Hover (Zone 2) */}
                 <div className="absolute inset-0 p-8 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="translate-y-8 group-hover:translate-y-0 transition-transform duration-700 ease-[0.22,1,0.36,1]">
                      <span className="text-amber-400 text-xs font-bold uppercase tracking-widest block mb-2">{activeItem.category}</span>
                      <h3 className="text-3xl lg:text-4xl font-black tracking-tight leading-none text-white drop-shadow-lg">{activeItem.title}</h3>
                      <p className="text-white/80 text-xs mt-3 line-clamp-2 max-w-sm">{activeItem.interactions.accordionDescription}</p>
                      <div className="bg-white text-black px-5 py-2 rounded-full font-bold text-[10px] tracking-wider uppercase shadow-[0_0_20px_rgba(255,255,255,0.2)] mt-4 inline-block w-fit hover:scale-105 active:scale-95 transition-transform">
                        Lihat Mahakarya
                      </div>
                    </div>
                 </div>
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

    </motion.div>
  );
}
