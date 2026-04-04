"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { GalleryItem } from "@/types";

export function GalleryGridClient({ initialItems }: { initialItems: GalleryItem[] }) {
  const [activeFilter, setActiveFilter] = useState("All");

  const categories = useMemo(() => {
    const cats = initialItems.map((i) => i.category);
    return ["All", ...Array.from(new Set(cats))];
  }, [initialItems]);

  const filteredItems = useMemo(() => {
    if (activeFilter === "All") return initialItems;
    return initialItems.filter(item => item.category === activeFilter);
  }, [initialItems, activeFilter]);

  return (
    <div className="min-h-screen bg-transparent pt-24 md:pt-32 pb-24 px-6 md:px-12 relative z-10 w-full">
      <div className="max-w-screen-2xl mx-auto w-full flex flex-col gap-12">
        
        {/* Header & Filter */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-white/10 pb-8">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-3"
          >
             <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white">Arsip<br/><span className="text-amber-500">Koleksi.</span></h1>
             <p className="text-neutral-400 max-w-md mt-2 leading-relaxed text-sm md:text-base">Mengeksplorasi jejak mahakarya tanpa batasan waktu. Filter ratusan komposisi visual sesuai kurasi yang Anda inginkan.</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-wrap gap-2 md:gap-3"
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-4 py-2 md:py-2.5 rounded-full border text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all duration-300 ${activeFilter === cat ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.3)]' : 'bg-white/5 text-neutral-400 border-white/10 hover:border-amber-500 hover:text-white hover:bg-amber-500/10'}`}
              >
                {cat}
              </button>
            ))}
          </motion.div>
        </div>

        {/* Masonry-Style Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, i) => (
              <motion.div
                layout
                key={item.id}
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                transition={{ duration: 0.6, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                className={`relative group rounded-3xl overflow-hidden block border border-white/5 shadow-xl bg-black/40 backdrop-blur-sm ${i % 4 === 0 || i % 7 === 0 ? 'md:row-span-2 aspect-[3/4]' : 'aspect-square md:aspect-[4/5]'}`}
                style={{ willChange: "transform, opacity" }}
              >
                <Link href={`/gallery/${item.slug}`} className="w-full h-full block">
                  <Image 
                    src={item.images.thumbnail}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  {/* Subtle Vignette */}
                  <div className="absolute inset-0 bg-neutral-900/10 mix-blend-overlay pointer-events-none group-hover:bg-neutral-900/40 transition-colors duration-700" />
                  
                  {/* Info Overlay */}
                  <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/40 to-transparent translate-y-4 group-hover:translate-y-0 opacity-80 group-hover:opacity-100 transition-all duration-500">
                    <span className="text-[10px] text-amber-500 font-bold uppercase tracking-widest mb-2">{item.category}</span>
                    <h3 className="text-2xl md:text-3xl font-black text-white leading-none">{item.title}</h3>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        
        {filteredItems.length === 0 && (
           <div className="w-full py-32 flex flex-col items-center justify-center text-center">
             <p className="text-neutral-500 font-mono tracking-widest uppercase">Kosong.</p>
           </div>
        )}

      </div>
    </div>
  );
}
