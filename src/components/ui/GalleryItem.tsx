"use client";

import Link from "next/link";
import { GalleryItem as GalleryItemType } from "@/types";
import { ParallaxImage } from "./ParallaxImage";
import { motion } from "framer-motion";

interface Props {
  item: GalleryItemType;
  index: number;
}

export function GalleryItem({ item, index }: Props) {
  // Mobile-first rules: minimal hover.
  // Tap targets min 48px height.
  // Using Link to navigate to details.

  return (
    <Link href={`/gallery/${item.slug}`} className="block group">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        className="w-full h-full flex flex-col gap-3"
      >
        <div className="relative w-full rounded-2xl overflow-hidden bg-neutral-900 border border-white/5 group-hover:border-white/20 transition-all duration-700 ease-out group-hover:scale-[1.02]">
          <ParallaxImage
            src={item.images.thumbnail}
            alt={item.images.altText}
            width={item.images.dimensions.width}
            height={item.images.dimensions.height}
            layoutId={`gallery-image-${item.id}`}
            parallaxSpeed={item.interactions.parallaxSpeed}
            isLCP={item.images.isLCP}
            className="md:h-auto" // overrides forced full height if needed by ParallaxImage
          />
          {/* Overlay gradient for text legibility */}
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
          
          <div className="absolute bottom-0 left-0 p-6 flex flex-col gap-1 w-full">
             <motion.span 
               className="text-amber-400 text-xs font-semibold tracking-widest uppercase mb-1"
               layoutId={`gallery-category-${item.id}`}
             >
               {item.category}
             </motion.span>
             <motion.h2 
               className="text-2xl md:text-3xl font-bold text-white tracking-tight"
               layoutId={`gallery-title-${item.id}`}
             >
               {item.title}
             </motion.h2>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
