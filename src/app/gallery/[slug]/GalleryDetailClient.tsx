"use client";

import { GalleryItem } from "@/types";
import { motion } from "framer-motion";
import Image from "next/image";
import { HoverAccordion } from "@/components/ui/HoverAccordion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { mockGalleryData } from "@/lib/data";

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
                  title: "Narasi & Visi",
                  description: item.interactions.accordionDescription
                },
                {
                  id: "2",
                  title: "Detail Teknis Lensa",
                  description: `Diambil dengan mempertimbangkan komposisi visual kelas tinggi. Karya ini memprioritaskan asimetri rasio ${item.images.dimensions.aspectRatio} untuk membangkitkan dimensi spasial.`
                },
                {
                  id: "3",
                  title: "Metadata Render",
                  description: `Karya di-publish oleh ${item.metadata.author}. Menggunakan sinkronisasi parallax sebesar ${item.interactions.parallaxSpeed}x untuk menciptakan kedalaman semu di ruang eksibisi Zone 2.`
                }
              ]}
            />
          </main>

          {/* Related Works Dibuat Dinamis (MockUp) */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="mt-20 pt-16 border-t border-white/10"
          >
            <div className="flex justify-between items-end mb-8">
               <h3 className="text-2xl md:text-4xl font-black">Karya Serupa</h3>
               <Link href="/" className="text-[10px] uppercase font-bold tracking-widest text-amber-500 hover:text-white transition-colors">Lihat Semua</Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {mockGalleryData
                .filter(g => g.id !== item.id)
                .slice(0, 2)
                .map((related, i) => (
                  <Link key={related.id} href={`/gallery/${related.slug}`} className="group relative aspect-[4/3] rounded-2xl overflow-hidden block">
                     <Image src={related.images.thumbnail} alt="" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 opacity-80 group-hover:opacity-100 transition-opacity">
                        <span className="text-[10px] text-amber-500 font-bold uppercase tracking-widest mb-1">{related.category}</span>
                        <h4 className="text-xl font-bold text-white">{related.title}</h4>
                     </div>
                  </Link>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
