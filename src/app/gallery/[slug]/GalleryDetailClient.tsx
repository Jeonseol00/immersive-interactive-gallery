"use client";

import { GalleryItem } from "@/types";
import { motion } from "framer-motion";
import Image from "next/image";
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
          {/* Header Metadata */}
          <header className="flex flex-col gap-3 md:gap-4 bg-black/70 md:bg-transparent backdrop-blur-xl md:backdrop-blur-none p-6 md:p-0 rounded-[1.5rem] md:rounded-none border border-white/10 md:border-none shadow-2xl md:shadow-none">
            <motion.span 
              className="text-amber-500 font-bold tracking-widest uppercase text-[10px] sm:text-xs"
              layoutId={`gallery-category-${item.id}`}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {item.category}
            </motion.span>
            <motion.h1 
              className="text-4xl md:text-6xl font-black tracking-tight leading-none"
              layoutId={`gallery-title-${item.id}`}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {item.title}
            </motion.h1>
          </header>

          {/* Upgrade: Editorial Metadata Grid (Menggantikan Accordion yang kosong) */}
          <main className="mt-4 md:mt-8 flex flex-col md:flex-row gap-12 md:gap-16 border-t border-white/10 pt-12 items-start">
             {/* Kiri: Deskripsi Utama / Narasi Konteks */}
             <div className="flex-[2]">
                <h2 className="text-xl font-bold mb-6 text-white flex items-center gap-3">
                  <span className="w-8 h-px bg-amber-500 block"></span>
                  Eksplorasi Konteks
                </h2>
                <p className="text-neutral-300 text-sm md:text-base leading-relaxed text-justify">
                  {item.interactions.accordionDescription}
                </p>
                <p className="text-neutral-500 text-sm mt-6 leading-relaxed text-justify">
                   Integrasi dimensi spasial {item.images.dimensions.aspectRatio} dikalibrasi secara presisi dengan lapisan parallax. Resolusi master {(item.images.dimensions.width * item.images.dimensions.height / 1000000).toFixed(1)} Megapiksel di-render sempurna menggunakan format ultra-kompresi.
                </p>
             </div>

             {/* Kanan: Label Eksibisi (Stat Cards) */}
             <div className="flex-1 w-full grid grid-cols-2 lg:grid-cols-1 gap-4 font-mono uppercase tracking-widest">
                <div className="bg-white/5 border border-white/10 p-4 md:p-5 rounded-2xl flex border-l-2 border-l-amber-500 flex-col gap-1">
                   <span className="text-[9px] text-neutral-500 font-bold">Kreator Digital</span>
                   <span className="text-xs text-white break-words">{item.metadata.author}</span>
                </div>
                <div className="bg-white/5 border border-white/10 p-4 md:p-5 rounded-2xl flex flex-col gap-1">
                   <span className="text-[9px] text-neutral-500 font-bold">Tanggal Publis</span>
                   <span className="text-xs text-white">{new Date(item.metadata.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric'})}</span>
                </div>
                <div className="bg-white/5 border border-white/10 p-4 md:p-5 rounded-2xl flex flex-col gap-1">
                   <span className="text-[9px] text-neutral-500 font-bold">Properti Lensa</span>
                   <span className="text-xs text-white">{item.images.dimensions.width} × {item.images.dimensions.height}px</span>
                </div>
                <div className="bg-white/5 border border-white/10 p-4 md:p-5 rounded-2xl flex flex-col gap-1">
                   <span className="text-[9px] text-neutral-500 font-bold">Rasio Aspek</span>
                   <span className="text-xs text-white">{item.images.dimensions.aspectRatio}</span>
                </div>
             </div>
          </main>

          {/* Related Works — Diupgrade Menjadi 3 Kolom yang Mengundang */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="mt-20 pt-16 border-t border-white/10"
          >
            <div className="flex justify-between items-end mb-8">
               <h3 className="text-2xl md:text-4xl font-black">Karya Serupa</h3>
               <Link href="/gallery" className="text-[10px] uppercase font-bold tracking-widest text-amber-500 hover:text-white transition-colors">Lihat Arsip →</Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {mockGalleryData
                .filter(g => g.id !== item.id)
                .slice(0, 3)
                .map((related) => (
                  <Link key={related.id} href={`/gallery/${related.slug}`} className="group relative aspect-[4/5] rounded-[1.5rem] overflow-hidden block shadow-lg border border-white/5">
                     <Image src={related.images.thumbnail} alt="" fill className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
                     <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent flex flex-col justify-end p-6 opacity-80 group-hover:opacity-100 transition-opacity duration-500">
                        <span className="text-[9px] text-amber-500 font-bold uppercase tracking-[0.2em] mb-2">{related.category}</span>
                        <h4 className="text-xl sm:text-2xl font-black text-white leading-tight">{related.title}</h4>
                     </div>
                  </Link>
              ))}
            </div>
          </motion.div>

          {/* Final Call to Action Balik Ke Arsip */}
          <div className="mt-20 pb-12 flex justify-center w-full">
            <Link 
              href="/gallery" 
              className="px-10 py-5 bg-white text-black font-bold text-xs tracking-widest uppercase rounded-full hover:scale-105 transition-transform duration-300 shadow-[0_0_40px_rgba(255,255,255,0.15)] hover:shadow-[0_0_60px_rgba(255,255,255,0.25)] flex items-center gap-3"
            >
              <ArrowLeft size={16} /> Kembali ke Galeri
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
