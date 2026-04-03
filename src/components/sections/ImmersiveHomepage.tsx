"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GalleryItem as GalleryItemType } from "@/types";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

const MotionLink = motion.create(Link);


interface ImmersiveHomepageProps {
  items: GalleryItemType[];
}

export function ImmersiveHomepage({ items }: ImmersiveHomepageProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(true);

  // Upgrade: Generate unique categories for mobile pill navigation
  const categories = useMemo(() => {
    const cats = items.map((i) => i.category);
    return Array.from(new Set(cats));
  }, [items]);

  // Upgrade: Scroll Progress for Mobile
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Measure window size solely on the client to avoid hydration mismatch, but default to mobile
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize(); // trigger once immediately on mount
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Prepare scattered items for Hero background (Desktop Only) — statis & tersebar penuh layar
  const heroScatteredItems = useMemo(() => {
    const result = [];
    for (let i = 0; i < 8; i++) {
      result.push(items[i % items.length]);
    }
    return result;
  }, [items]);

  // Prepare scattered items for Zone 2 Card Shuffle (Desktop Only) — dinamis berdasarkan activeIndex
  const zone2ScatteredItems = useMemo(() => {
    const list = [...items];
    const itemHole = list.splice(activeIndex, 1)[0];
    return [itemHole, ...list].slice(0, 4);
  }, [items, activeIndex]);

  useEffect(() => {
    if (prefersReducedMotion || typeof window === "undefined" || isMobile) return;

    gsap.registerPlugin(ScrollTrigger);
    
    // Animate scattered ambient images on Desktop
    const elements = document.querySelectorAll(".scattered-image");
    gsap.killTweensOf(elements);

    elements.forEach((el, index) => {
      gsap.to(el, {
        y: `random(-20, 20)`,
        x: `random(-20, 20)`,
        rotation: `random(-5, 5)`,
        duration: `random(4, 7)`,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: index * 0.1
      });
    });

  }, [activeIndex, prefersReducedMotion, isMobile]);

  // Posisi tersebar full-layar Hero (edge-to-edge)
  const heroScatteredPositions = [
    "top-[5%] left-[3%] w-[220px] h-[300px]",
    "top-[8%] left-[28%] w-[180px] h-[250px]",
    "top-[3%] right-[28%] w-[200px] h-[280px]",
    "top-[10%] right-[3%] w-[240px] h-[320px]",
    "bottom-[8%] left-[5%] w-[200px] h-[270px]",
    "bottom-[5%] left-[30%] w-[170px] h-[240px]",
    "bottom-[10%] right-[25%] w-[190px] h-[260px]",
    "bottom-[6%] right-[2%] w-[210px] h-[290px]",
  ];



  const activeItem = items[activeIndex];

  return (
    <>
      {isMobile ? (
        <main className="w-full flex flex-col items-center justify-start bg-transparent min-h-screen relative">

        {/* Upgrade 3: Scroll Progress Indicator */}
        <motion.div
          className="fixed top-16 md:top-20 left-0 right-0 h-[3px] bg-amber-500 origin-left z-50 shadow-[0_0_12px_rgba(245,158,11,0.6)]"
          style={{ scaleX }}
        />

        {/* Upgrade 6: Cinematic Hero Section (Lobi Galeri) */}
        <section className="relative w-full h-[100dvh] flex flex-col items-center justify-center overflow-hidden z-10 bg-transparent">

          <div 
             className="absolute inset-0 w-full h-full pointer-events-none z-[1]"
             style={{ maskImage: "linear-gradient(to bottom, black 0%, black 75%, transparent 100%)", WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 75%, transparent 100%)" }}
          >
             {/* THE DROP REVEALER: Focus pull dari atas ke bawah */}
             <motion.div
                initial={false}
                animate={{ y: "0%", scale: 1, filter: "blur(0px)" }}
                transition={{ duration: 1.5, ease: [0.76, 0, 0.24, 1] }} // Tersinkron dengan Curtain rise
                className="w-full h-full absolute inset-0"
             >
                 {/* THE ENDLESS BREATH: Ken burns berjalan paralel di dalamnya */}
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
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative z-20 flex flex-col items-center text-center px-6 mt-16"
          >
            <h1 className="text-7xl font-black tracking-tighter text-white/90 drop-shadow-2xl">IMGAL</h1>
            <p className="text-amber-500 font-bold uppercase tracking-[0.3em] text-[10px] mt-3">Ruang Digital Mahakarya Abadi</p>
          </motion.div>

          <motion.div 
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute bottom-16 z-20 flex flex-col items-center gap-3"
          >
            <span className="text-[9px] font-black text-neutral-500 uppercase tracking-widest">Jelajahi Galeri</span>
            <motion.div 
               initial={{ y: 0 }}
               animate={{ y: 8 }}
               transition={{ duration: 0.75, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
               className="w-4 h-7 border-2 border-white/20 rounded-full flex justify-center p-0.5 shadow-[0_0_15px_rgba(255,255,255,0.05)]"
            >
               <div className="w-1 h-1.5 bg-amber-500 rounded-full" />
            </motion.div>
          </motion.div>
        </section>

        {/* Zona 2: Feed "Ruang Pameran" */}
        <div className="w-full relative z-20 bg-black">
          {/* Upgrade 2: Category Pills Navigation */}
          <div className="w-full overflow-x-auto no-scrollbar py-4 px-6 mb-6 sticky top-16 md:top-20 z-40 bg-black/80 backdrop-blur-xl border-b border-t border-white/10">
            <div className="flex gap-3">
              <button 
                onClick={() => window.scrollTo({ top: window.innerHeight - 80, behavior: 'smooth' })}
                className="px-5 py-2.5 rounded-full border border-white/20 bg-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-white hover:bg-white hover:text-black hover:scale-105 active:scale-95 transition-all whitespace-nowrap"
              >
                All Works
              </button>
              {categories.map((cat, idx) => (
                <button 
                  key={idx}
                  onClick={() => {
                    const el = document.getElementById(`feed-category-${cat.toLowerCase().replace(/\s+/g, '-')}`);
                    if (el) {
                      const y = el.getBoundingClientRect().top + window.scrollY - 150;
                      window.scrollTo({ top: y, behavior: 'smooth' });
                    }
                  }}
                  className="px-5 py-2.5 rounded-full border border-white/20 bg-white/5 text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-400 hover:text-white hover:border-amber-500 hover:bg-amber-500/10 active:scale-95 transition-all whitespace-nowrap"
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="container mx-auto px-6 pb-20 w-full max-w-2xl flex flex-col gap-16 sm:gap-20 relative z-10">
          {items.map((item, idx) => (
            <motion.div 
              key={`mobile-feed-${item.id}`} 
              id={`feed-category-${item.category.toLowerCase().replace(/\s+/g, '-')}`}
              className="flex flex-col gap-5 sm:gap-6 w-full"
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Upgrade 4: Micro-interaction whileTap */}
              <MotionLink 
                href={`/gallery/${item.slug}`} 
                whileTap={{ scale: 0.96 }}
                className="w-full relative aspect-[4/5] sm:aspect-[3/4] rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden shadow-2xl block group pointer-events-auto cursor-pointer border border-white/10"
              >
                <motion.div layoutId={`gallery-image-${item.id}`} className="w-full h-full relative">
                  <Image
                    src={item.images.fullResolution}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    priority={idx === 0}
                    sizes="(max-width: 768px) 100vw"
                  />
                  {/* Internal Vignette */}
                  <div className="absolute inset-0 bg-neutral-900/10 mix-blend-overlay pointer-events-none"></div>
                </motion.div>
                
                {/* Touch Overlay Indicator */}
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur text-white px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase opacity-90 pointer-events-none ring-1 ring-white/20">
                  TAP TO VIEW
                </div>
              </MotionLink>
              
              {/* Upgrade 5: Typography & Spacing */}
              <div className="flex flex-col gap-1 sm:gap-2 px-1 pointer-events-none">
                <div className="flex items-center justify-between">
                  <p className="text-amber-500 font-bold uppercase tracking-widest text-[10px] sm:text-xs">{item.category}</p>
                  <span className="text-neutral-600 text-[10px] font-mono font-bold">{idx + 1} / {items.length}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-none text-white mt-1">{item.title}</h2>
                <p className="text-neutral-400 text-sm mt-1 leading-relaxed line-clamp-2">
                  {item.interactions.accordionDescription}
                </p>
              </div>
            </motion.div>
          ))}
          </div>
        </div>
        </main>
      ) : (
        <section 
          ref={containerRef}
          className="relative w-full bg-transparent flex flex-col font-sans"
        >

      {/* Latar Belakang Global telah di-refactor ke komponen GlobalBackground dalam layout.tsx */}

      {/* ZONA 1: Cinematic Hero Desktop */}
      <div className="relative w-full h-[100vh] flex flex-col items-center justify-center z-10 shrink-0 overflow-visible bg-transparent">

        {/* Hero Scattered Gallery — DITENGAH TEKS DAN TOPOGRAFI (z-2) */}
        <div className="absolute inset-0 z-[2] pointer-events-none">
          {heroScatteredItems.map((item, index) => (
            <motion.div
              key={`hero-scatter-${index}`}
              initial={{ opacity: 0, scale: 0.85, y: 30 }}
              animate={{ opacity: 0.35, scale: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.1 * index, ease: [0.22, 1, 0.36, 1] }}
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

        {/* Hero Typography — PALING DEPAN (Z-20) SESUAI TATA LETAK ZONA 1 PADA UMUMNYA */}
        <motion.div 
           initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
           animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
           transition={{ duration: 1.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
           className="flex flex-col items-center text-center relative z-20 pointer-events-none"
        >
          <h1 className="text-[12vw] font-black tracking-tighter text-white drop-shadow-2xl leading-none">IMGAL</h1>
          <p className="text-amber-500 font-bold uppercase tracking-[0.5em] text-sm mt-8">Ruang Digital Mahakarya Abadi</p>
        </motion.div>

        <motion.button 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-12 flex flex-col items-center gap-6 group cursor-pointer pointer-events-auto z-20"
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: "smooth" })}
        >
          <span className="text-[10px] font-black text-white/50 uppercase tracking-[0.3em] group-hover:text-amber-400 transition-colors">Jelajahi Koleksi</span>
          <div className="w-px h-16 bg-gradient-to-b from-white/50 to-transparent group-hover:from-amber-400 transition-colors" />
        </motion.button>
      </div>

      {/* ZONA 2: Interactive Gallery Index — Scroll-Triggered */}
      <motion.div 
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="container mx-auto px-12 relative z-10 flex flex-row min-h-screen gap-16 items-center shrink-0"
      >
        
        {/* Left Side: Interactive Text Index */}
        <div className="w-1/3 flex flex-col shrink-0 gap-8 h-full justify-center">
          <div className="flex justify-between items-center text-xs tracking-widest text-neutral-500 font-mono uppercase border-b border-white/10 pb-4 mb-4">
            <span>Works / Mirage</span>
            <span>Hover & Click</span>
          </div>

          <div className="flex flex-col gap-1 max-h-[60vh] overflow-y-auto no-scrollbar pointer-events-auto">
            {items.map((item, idx) => {
              const isActive = activeIndex === idx;
              return (
                <button
                  key={`index-${item.id}`}
                  onMouseEnter={() => setActiveIndex(idx)}
                  onClick={() => router.push(`/gallery/${item.slug}`)}
                  className={cn(
                    "text-left py-2 text-2xl lg:text-3xl font-black uppercase transition-all duration-300 w-full truncate tracking-tighter hover:cursor-pointer",
                    isActive 
                      ? "text-amber-400 opacity-100 pl-6 border-l-4 border-amber-400 bg-white/5" 
                      : "text-white opacity-40 hover:opacity-100 hover:pl-2"
                  )}
                >
                  {item.title}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Vast Central Focal Image & Zone 2 Scattered Ambient */}
        <div className="flex-1 flex flex-col justify-center items-center relative h-full pointer-events-none">
          
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
                const prop = transforms[index];

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
                initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)", zIndex: 10 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 w-full h-full pointer-events-auto"
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
                   <div className="absolute inset-0 p-10 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="translate-y-8 group-hover:translate-y-0 transition-transform duration-700 ease-[0.22,1,0.36,1]">
                        <span className="text-amber-400 text-xs font-bold uppercase tracking-widest block mb-3">{activeItem.category}</span>
                        <h3 className="text-4xl lg:text-5xl font-black tracking-tight leading-none text-white drop-shadow-lg">{activeItem.title}</h3>
                        <p className="text-white/80 text-sm mt-4 line-clamp-3 max-w-md">{activeItem.interactions.accordionDescription}</p>
                        <div className="bg-white text-black px-6 py-3 rounded-full font-bold text-xs tracking-wider uppercase shadow-[0_0_20px_rgba(255,255,255,0.2)] mt-6 inline-block w-fit hover:scale-105 active:scale-95 transition-transform">
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

      {/* ZONA 3: Closing Statement — Diperkaya */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 1 }}
        className="w-full py-24 flex flex-col items-center justify-center relative z-10 bg-transparent shrink-0"
      >
         {/* Decorative Line */}
         <motion.div 
           initial={{ scaleX: 0 }}
           whileInView={{ scaleX: 1 }}
           viewport={{ once: true }}
           transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
           className="w-24 h-px bg-amber-500 mb-12 origin-center"
         />

         <motion.h2 
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.8, delay: 0.2 }}
           className="text-4xl md:text-6xl font-mono tracking-widest uppercase text-neutral-600 mb-4 text-center"
         >
           Setiap Karya
         </motion.h2>
         <motion.h2 
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.8, delay: 0.4 }}
           className="text-5xl md:text-7xl font-black text-amber-500 tracking-tighter mb-12"
         >
           Punya Cerita.
         </motion.h2>

         <motion.div 
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.8, delay: 0.6 }}
           className="flex gap-4 pointer-events-auto mb-16"
         >
           <Link href="/about" className="px-8 py-4 rounded-full border border-white/20 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all duration-300">
              Tentang Kami
           </Link>
           <Link href="/contact" className="px-8 py-4 rounded-full bg-white text-black text-[10px] font-bold uppercase tracking-[0.2em] hover:scale-105 shadow-[0_0_30px_rgba(255,255,255,0.1)] transition-all duration-300">
              Hubungi Kami
           </Link>
         </motion.div>

         {/* Divider */}
         <div className="w-full max-w-xl h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-12" />

         {/* Social Links & Credits */}
         <motion.div 
           initial={{ opacity: 0 }}
           whileInView={{ opacity: 1 }}
           viewport={{ once: true }}
           transition={{ duration: 0.8, delay: 0.8 }}
           className="flex flex-col items-center gap-6"
         >
           <div className="flex gap-8 pointer-events-auto">
             <a href="#" className="text-neutral-600 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors">Instagram</a>
             <a href="#" className="text-neutral-600 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors">Behance</a>
             <a href="#" className="text-neutral-600 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors">Dribbble</a>
           </div>
           <p className="text-neutral-700 text-[10px] font-mono uppercase tracking-widest">
             &copy; {new Date().getFullYear()} IMGAL — All Rights Reserved
           </p>
         </motion.div>
      </motion.div>
    </section>
    )}
    </>
  );
}
