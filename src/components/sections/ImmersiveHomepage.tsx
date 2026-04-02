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

const IntroOverlay = ({ introState, items }: { introState: "blank" | "text" | "reel" | "done", items: GalleryItemType[] }) => (
  <motion.div
    key="intro-overlay-stable"
    initial={false}
    animate={{ 
       y: introState === "done" ? "-100%" : "0%", 
    }}
    transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
    className={cn(
       "fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center overflow-hidden",
       introState === "done" ? "pointer-events-none" : "pointer-events-auto",
       introState === "blank" ? "opacity-0" : "opacity-100"
    )}
  >
     <AnimatePresence>
       {introState === "text" && (
         <motion.div
           key="intro-text"
           initial="hidden"
           animate="visible"
           exit={{ opacity: 0, scale: 1.1, filter: "blur(15px)", transition: { duration: 0.4 } }}
           variants={{
             hidden: { opacity: 0 },
             visible: { opacity: 1, transition: { staggerChildren: 0.6, delayChildren: 0.2 } }
           }}
           className="absolute inset-0 flex flex-col items-center justify-center gap-3 lg:gap-4 z-20"
         >
           <div className="overflow-hidden px-4 py-2">
              <motion.h2 
                 variants={{
                   hidden: { filter: "blur(12px)", opacity: 0, y: 30, scale: 0.95 },
                   visible: { filter: "blur(0px)", opacity: 1, y: 0, scale: 1 }
                 }}
                 transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                 className="text-3xl md:text-5xl font-mono tracking-widest uppercase text-neutral-400"
              >
                 Setiap Karya
              </motion.h2>
           </div>
           
           <div className="overflow-hidden px-4 py-2">
              <motion.h2 
                 variants={{
                   hidden: { filter: "blur(15px)", opacity: 0, y: 40, scale: 0.9 },
                   visible: { filter: "blur(0px)", opacity: 1, y: 0, scale: 1 }
                 }}
                 transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                 className="text-5xl md:text-7xl font-black text-amber-500 tracking-tighter"
              >
                 Punya Cerita.
              </motion.h2>
           </div>
         </motion.div>
       )}
     </AnimatePresence>

     <AnimatePresence>
       {introState === "reel" && (
          <motion.div
             key="intro-reel"
             initial={{ opacity: 0 }}
             animate={{ opacity: 0.8 }}
             exit={{ opacity: 0, transition: { duration: 0.5 } }} // Mengaburkan (fade out) perlahan saat tirai hero terangkat
             className="absolute flex gap-4 md:gap-8 z-10 w-full h-[150vh] justify-center rotate-[-5deg] scale-110 pointer-events-none"
          >
             {/* Pilar 1 - Laju Konstan */}
             <motion.div 
               initial={{ y: "100vh" }} 
               animate={{ y: "-130vh" }} 
               transition={{ duration: 2.2, ease: "circIn" }}
               className="flex flex-col gap-4 -translate-y-12"
             >
                {[...items.slice(0, 5), ...items.slice(0, 2)].map((item, i) => (
                  <div key={`c1-${i}`} className="relative w-32 h-48 md:w-56 md:h-80 rounded-[1.5rem] shadow-2xl brightness-75 sepia-[.2] overflow-hidden border border-white/10 shrink-0">
                    <Image src={item.images.thumbnail} alt="" fill sizes="25vw" className="object-cover" priority quality={35} />
                  </div>
                ))}
             </motion.div>

             {/* Pilar 2 - Laju Tertinggi & Kedalaman Visual (Parallax Jauh) */}
             <motion.div 
               initial={{ y: "120vh" }} 
               animate={{ y: "-180vh" }} 
               transition={{ duration: 2.1, ease: "circIn" }}
               className="flex flex-col gap-4 translate-y-32 z-[-1]"
             >
                {[...items.slice(3, 8).reverse(), ...items.slice(3, 5)].map((item, i) => (
                  <div key={`c2-${i}`} className="relative w-32 h-48 md:w-56 md:h-80 rounded-[1.5rem] shadow-2xl brightness-50 sepia-[.4] overflow-hidden border border-white/10 shrink-0">
                    <Image src={item.images.thumbnail} alt="" fill sizes="25vw" className="object-cover" priority quality={35} />
                  </div>
                ))}
             </motion.div>

             {/* Pilar 3 - Sedang (Dekstop Saja) */}
             <motion.div 
               initial={{ y: "80vh" }} 
               animate={{ y: "-150vh" }} 
               transition={{ duration: 2.3, ease: "circIn" }}
               className="flex flex-col gap-4 -translate-y-32 hidden md:flex"
             >
                {[...items.slice(6, 9), ...items.slice(0, 4)].map((item, i) => (
                  <div key={`c3-${i}`} className="relative w-32 h-48 md:w-56 md:h-80 rounded-[1.5rem] shadow-2xl brightness-75 sepia-[.2] overflow-hidden border border-white/10 shrink-0">
                    <Image src={item.images.thumbnail} alt="" fill sizes="25vw" className="object-cover" priority quality={35} />
                  </div>
                ))}
             </motion.div>
             
             {/* Masking Gradient agar gambar tidak merobek tepi layar seketika */}
             <div className="absolute inset-x-0 top-0 h-[25vh] bg-gradient-to-b from-black to-transparent z-20 pointer-events-none" />
             <div className="absolute inset-x-0 bottom-0 h-[25vh] bg-gradient-to-t from-black to-transparent z-20 pointer-events-none" />
          </motion.div>
       )}
     </AnimatePresence>
  </motion.div>
);

interface ImmersiveHomepageProps {
  items: GalleryItemType[];
}

export function ImmersiveHomepage({ items }: ImmersiveHomepageProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(true);
  const [introState, setIntroState] = useState<"blank" | "text" | "reel" | "done">("blank");

  useEffect(() => {
    const hasSeenIntro = sessionStorage.getItem('hasSeenIntro');
    if (hasSeenIntro) {
      setIntroState("done");
    } else {
      setIntroState("text");
      sessionStorage.setItem('hasSeenIntro', 'true');
      
      const reelTimer = setTimeout(() => {
        setIntroState("reel");
      }, 2300); // Tunggu teks selesai memudar

      const doneTimer = setTimeout(() => {
        setIntroState("done");
      }, 4600); // 2.3 detik durasi reel ditenangkan (2.3s text + 2.3s reel = 4.6s)

      return () => {
        clearTimeout(reelTimer);
        clearTimeout(doneTimer);
      };
    }
  }, []);

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

  // Prepare scattered items relative to the currently active index (Desktop Only)
  const scatteredItems = useMemo(() => {
    const list = [...items];
    const itemHole = list.splice(activeIndex, 1)[0];
    // Return the active item + 3 subsequent items wrapped around
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

  const scatteredPositions = [
    "top-[10%] right-[10%] w-[300px] h-[400px] opacity-60",
    "bottom-[15%] right-[35%] w-[250px] h-[350px] opacity-40",
    "top-[45%] right-[5%] w-[350px] h-[250px] opacity-70",
    "top-[20%] right-[45%] w-[200px] h-[200px] opacity-30",
  ];

  const activeItem = items[activeIndex];

  // Mobile Render Mode
  if (isMobile) {
    return (
      <main className="w-full flex flex-col items-center justify-start bg-black min-h-screen relative">
        <IntroOverlay introState={introState} items={items} />
        
        {/* Mobile Animated Grid Background */}
        <div 
          className="fixed inset-0 pointer-events-none opacity-20 motion-safe:animate-flow-grid z-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
            backgroundPosition: "0 0"
          }}
        />

        {/* Upgrade 3: Scroll Progress Indicator */}
        <motion.div
          className="fixed top-16 md:top-20 left-0 right-0 h-[3px] bg-amber-500 origin-left z-50 shadow-[0_0_12px_rgba(245,158,11,0.6)]"
          style={{ scaleX }}
        />

        {/* Upgrade 6: Cinematic Hero Section (Lobi Galeri) */}
        <section className="relative w-full h-[100dvh] flex flex-col items-center justify-center overflow-hidden z-10">
          <div className="absolute inset-0 w-full h-full pointer-events-none">
             {/* THE DROP REVEALER: Focus pull dari atas ke bawah */}
             <motion.div
                initial={false}
                animate={introState === "done" ? { y: "0%", scale: 1, filter: "blur(0px)" } : { y: "-15%", scale: 1.1, filter: "blur(15px)" }}
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
             <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black" />
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
            animate={introState === "done" ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
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
    );
  }

  // Desktop Render Mode
  return (
    <section 
      ref={containerRef}
      className="relative min-h-screen flex flex-col pt-24 pb-20 w-full overflow-hidden bg-black"
    >
      <IntroOverlay introState={introState} items={items} />

      {/* Desktop Animated Grid Background */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20 motion-safe:animate-flow-grid z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          backgroundPosition: "0 0"
        }}
      />
      
      {/* Scattered Ambient Background Images (Interactive Index Mode) */}
      <div className="absolute inset-x-0 inset-y-0 right-0 w-2/3 ml-auto z-0 pointer-events-none">
        <AnimatePresence mode="popLayout">
          {scatteredItems.map((item, index) => (
            <motion.div
              key={`scatter-${activeIndex}-${item.id}-${index}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1, transition: { duration: 0.5 } }}
              transition={{ duration: 0.8, delay: index * 0.05 }}
              className={cn(
                "scattered-image absolute overflow-hidden rounded-xl mix-blend-screen pointer-events-none border border-white/5",
                scatteredPositions[index]
              )}
            >
              <Image
                src={item.images.thumbnail}
                alt={item.images.altText}
                fill
                className="object-cover grayscale-0 brightness-100"
                sizes="33vw"
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="container mx-auto px-12 relative z-10 flex flex-row min-h-[75vh] gap-16 items-center">
        
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

        {/* Right Side: Vast Central Focal Image */}
        <div className="flex-1 flex justify-center items-center relative h-full pointer-events-none">
          <AnimatePresence mode="wait">
            <motion.div
              key={`desktop-focal-${activeItem.id}`}
              initial={{ opacity: 0, x: 80, filter: "blur(15px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: -80, filter: "blur(15px)" }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-2xl flex flex-col items-center pointer-events-auto"
            >
              <Link 
                href={`/gallery/${activeItem.slug}`} 
                className="group relative w-full aspect-[16/10] rounded-[2rem] overflow-hidden shadow-2xl mb-8 border border-white/10 block cursor-pointer transition-transform duration-500 hover:scale-[1.02]"
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
                 
                 {/* Discover Overlay */}
                 <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex items-end justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div>
                      <span className="text-amber-400 text-xs font-bold uppercase tracking-widest block mb-2">{activeItem.category}</span>
                      <h3 className="text-3xl font-black tracking-tight">{activeItem.title}</h3>
                    </div>
                    <div className="bg-white text-black px-6 py-3 rounded-full font-bold text-xs tracking-wider uppercase shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                      Explorasi
                    </div>
                 </div>
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
