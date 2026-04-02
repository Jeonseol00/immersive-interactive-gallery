"use client";

import { GalleryItem } from "@/types";
import { motion } from "framer-motion";
import Image from "next/image";
import { HoverAccordion } from "@/components/ui/HoverAccordion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function GalleryDetailClient({ item }: { item: GalleryItem }) {
  const MotionImage = motion.create(Image);

  return (
    <div className="pb-24">
      {/* Hero Image transitioning from thumbnail */}
      <div className="relative w-full h-[60vh] md:h-[80vh] overflow-hidden bg-black py-4">
        <Link 
          href="/"
          className="absolute top-6 left-6 z-50 p-3 bg-black/50 hover:bg-black/80 backdrop-blur-md rounded-full text-white transition-colors"
        >
          <ArrowLeft size={24} />
        </Link>
        <MotionImage
          layoutId={`gallery-image-${item.id}`}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          src={item.images.fullResolution || item.images.thumbnail}
          alt={item.images.altText}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-neutral-950 to-transparent pointer-events-none" />
      </div>

      <div className="container mx-auto px-6 md:px-12 -mt-24 md:-mt-32 relative z-10">
        <div className="flex flex-col gap-6 md:gap-12 max-w-4xl mx-auto">
          {/* Upgrade: Floating Metadata Card untuk Mobile */}
          <header className="flex flex-col gap-3 md:gap-4 bg-black/70 md:bg-transparent backdrop-blur-xl md:backdrop-blur-none p-6 md:p-0 rounded-[1.5rem] md:rounded-none border border-white/10 md:border-none shadow-2xl md:shadow-none">
            <motion.span 
              className="text-amber-500 font-bold tracking-widest uppercase text-xs md:text-sm"
              layoutId={`gallery-category-${item.id}`}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {item.category}
            </motion.span>
            <motion.h1 
              className="text-3xl md:text-6xl font-black tracking-tight"
              layoutId={`gallery-title-${item.id}`}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {item.title}
            </motion.h1>
            
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-neutral-400 text-[10px] md:text-sm mt-2 md:mt-4 border-b border-white/5 md:border-white/10 pb-4 md:pb-8">
              <span>By {item.metadata.author}</span>
              <span className="hidden md:inline">•</span>
              <span>{new Date(item.metadata.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric'})}</span>
            </div>
          </header>

          <main className="mt-8">
            <h2 className="text-xl md:text-2xl font-bold mb-8">Eksplorasi Konteks</h2>
            <HoverAccordion 
              items={[
                {
                  id: "1",
                  title: "Manifesto",
                  description: item.interactions.accordionDescription
                },
                {
                  id: "2",
                  title: "Filosofi Desain",
                  description: "Sebuah perjalanan visual menggabungkan tata letak dinamis dan warna kontras untuk menciptakan pengalaman sensorik total."
                },
                {
                  id: "3",
                  title: "Teknik Visual",
                  description: "Rendered using advanced WebGL principles mapping standard JSON properties to GPU buffers with GSAP hijacking."
                }
              ]}
            />
          </main>
        </div>
      </div>
    </div>
  );
}
