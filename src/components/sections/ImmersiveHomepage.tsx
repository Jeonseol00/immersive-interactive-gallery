"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GalleryItem as GalleryItemType } from "@/types";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ImmersiveHomepageProps {
  items: GalleryItemType[];
}

export function ImmersiveHomepage({ items }: ImmersiveHomepageProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(true);

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
      <section className="w-full flex flex-col pt-24 pb-20 items-center justify-start bg-black min-h-screen">
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

        <div className="container mx-auto px-6 w-full max-w-2xl flex flex-col gap-24 relative z-10">
          {items.map((item, idx) => (
            <div key={`mobile-feed-${item.id}`} className="flex flex-col gap-6 w-full">
              <Link 
                href={`/gallery/${item.slug}`} 
                className="w-full relative aspect-[3/4] rounded-[2rem] overflow-hidden shadow-2xl block group pointer-events-auto cursor-pointer border border-white/10"
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
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur text-white px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase opacity-80 pointer-events-none">
                  Tap to View
                </div>
              </Link>
              
              <div className="flex flex-col gap-2 px-2 pointer-events-none">
                <p className="text-amber-500 font-bold uppercase tracking-widest text-xs">{item.category}</p>
                <h2 className="text-3xl font-black tracking-tight leading-none text-white">{item.title}</h2>
                <p className="text-neutral-400 text-sm mt-2 leading-relaxed">
                  {item.interactions.accordionDescription}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // Desktop Render Mode
  return (
    <section 
      ref={containerRef}
      className="relative min-h-screen flex flex-col pt-24 pb-20 w-full overflow-hidden bg-black"
    >
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
