"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { GalleryItem as GalleryItemType } from "@/types";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface HeroSectionProps {
  items: GalleryItemType[];
}

export function HeroSection({ items }: HeroSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const router = useRouter();

  // Pick some scattered items based on active item to create variation
  // In a real app we'd have multiple images per project, here we just shuffle or pick adjacent items
  const scatteredItems = useMemo(() => {
    const list = [...items];
    const itemHole = list.splice(activeIndex, 1)[0];
    return [itemHole, ...list].slice(0, 4); // active item is always part of scattered + 3 others
  }, [items, activeIndex]);

  useEffect(() => {
    if (prefersReducedMotion || typeof window === "undefined") return;

    // We animate floating scattered items dynamically with GSAP
    const elements = document.querySelectorAll(".scattered-image");
    
    // Clear old tweens to prevent clashes when activeIndex changes
    gsap.killTweensOf(elements);

    const isMobile = window.innerWidth < 768;

    elements.forEach((el, index) => {
      // Different float settings per element
      if (!isMobile) {
        gsap.to(el, {
          y: `random(-30, 30)`,
          x: `random(-20, 20)`,
          rotation: `random(-8, 8)`,
          duration: `random(4, 7)`,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: index * 0.1
        });
      } else {
        // Mobile ambient floating (stronger than before, around 40px variance)
        gsap.to(el, {
          y: `random(-20, 20)`,
          x: `random(-10, 10)`,
          rotation: `random(-3, 3)`,
          duration: `random(5, 8)`,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        });
      }
    });

  }, [activeIndex, prefersReducedMotion]);

  const scatteredPositions = [
    "top-[15%] right-[5%] md:top-[10%] md:right-[15%] w-32 h-40 md:w-64 md:h-80 opacity-40 md:opacity-70",
    "bottom-[25%] left-[5%] md:bottom-[15%] md:right-[40%] w-28 h-36 md:w-56 md:h-72 opacity-30 md:opacity-60",
    "top-[50%] left-[8%] md:top-[40%] md:right-[10%] w-40 h-32 md:w-72 md:h-64 opacity-50 md:opacity-80",
    "top-[10%] left-[30%] md:top-[20%] md:right-[35%] w-24 h-24 md:w-48 md:h-48 opacity-20 md:opacity-50",
  ];

  const activeItem = items[activeIndex];

  return (
    <section 
      ref={containerRef}
      className="relative min-h-screen flex flex-col pt-24 md:pt-32 pb-20 w-full overflow-hidden"
    >
      {/* Animated Flowing Grid Background */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20 md:opacity-30 motion-safe:animate-flow-grid z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          backgroundPosition: "0 0"
        }}
      />
      
      {/* Scattered Ambient Background Images (Dynamic Parallax) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <AnimatePresence mode="popLayout">
          {scatteredItems.map((item, index) => (
            <motion.div
              key={`scatter-${activeIndex}-${item.id}-${index}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1, transition: { duration: 0.5 } }}
              transition={{ duration: 0.8, delay: index * 0.05 }}
              className={cn(
                "scattered-image absolute overflow-hidden rounded-xl border border-white/5 mix-blend-screen md:mix-blend-normal",
                scatteredPositions[index]
              )}
            >
              <Image
                src={item.images.thumbnail}
                alt={item.images.altText}
                fill
                className="object-cover grayscale brightness-[0.7] md:brightness-100 md:grayscale-0"
                sizes="(max-width: 768px) 33vw, 25vw"
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="container mx-auto px-6 relative z-10 flex flex-col md:flex-row min-h-[70vh] gap-8 md:gap-16">
        
        {/* Left Side (Desktop) / Top Side (Mobile): Interactive Index */}
        <div className="w-full md:w-1/3 flex flex-col shrink-0 gap-6">
          <div className="flex justify-between items-center text-xs tracking-widest text-neutral-500 font-mono uppercase mb-4 md:mb-8">
            <span>Works / Index</span>
            <span className="md:hidden">Scroll & Tap</span>
            <span className="hidden md:inline">Hover & Click</span>
          </div>

          <div className="flex flex-col gap-0 md:gap-1 max-h-[40vh] md:max-h-[70vh] overflow-y-auto no-scrollbar pr-4">
            {items.map((item, idx) => {
              const isActive = activeIndex === idx;
              return (
                <div key={`index-${item.id}`} className="flex flex-col">
                  {/* Title Button */}
                  <button
                    onMouseEnter={() => {
                        // Desktop Hover activates item instantly
                        if (window.innerWidth >= 768) {
                          setActiveIndex(idx);
                        }
                    }}
                    onClick={() => {
                       // Mobile Tap toggles item, Desktop Click navigates
                       if (window.innerWidth < 768) {
                          setActiveIndex(idx);
                       } else {
                          router.push(`/gallery/${item.slug}`);
                       }
                    }}
                    className={cn(
                      "text-left py-3 md:py-2 text-xl md:text-2xl lg:text-3xl font-bold uppercase transition-all duration-300 w-full truncate",
                      isActive 
                        ? "text-amber-400 opacity-100 pl-4 md:pl-8 border-l-2 border-amber-400 bg-white/5" 
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
                        className="md:hidden overflow-hidden w-full flex flex-col"
                      >
                         <Link href={`/gallery/${item.slug}`} className="block relative w-full aspect-[4/3] rounded-2xl overflow-hidden my-4 group shadow-2xl">
                           <motion.div layoutId={`gallery-image-${item.id}`} className="w-full h-full relative">
                             <Image 
                               src={item.images.fullResolution} 
                               alt={item.title} 
                               fill 
                               className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                               sizes="(max-width: 768px) 100vw"
                             />
                           </motion.div>
                           <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                             <span className="bg-amber-400 text-black px-4 py-2 font-bold rounded-full tracking-wider uppercase text-xs">
                               View Project
                             </span>
                           </div>
                         </Link>
                         <p className="text-sm text-neutral-400 mb-6 px-2">
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

        {/* Right Side (Desktop Only): Huge Focal Image & Details */}
        <div className="hidden md:flex flex-1 flex-col justify-center items-center relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={`desktop-focal-${activeItem.id}`}
              initial={{ opacity: 0, x: 50, filter: "blur(10px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: -50, filter: "blur(10px)" }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-2xl flex flex-col items-center"
            >
              <Link href={`/gallery/${activeItem.slug}`} className="group relative w-full aspect-[16/9] lg:aspect-[21/9] rounded-2xl overflow-hidden shadow-2xl mb-8 border border-white/10 block cursor-none">
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
                 {/* Desktop custom cursor hint overlay */}
                 <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 to-transparent flex items-end justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div>
                      <span className="text-amber-400 text-xs font-bold uppercase tracking-widest block mb-1">{activeItem.category}</span>
                      <h3 className="text-2xl font-bold">{activeItem.title}</h3>
                    </div>
                    <div className="bg-white text-black px-5 py-2 rounded-full font-bold text-sm tracking-wider uppercase">
                      Explore
                    </div>
                 </div>
              </Link>

              <div className="text-center w-full max-w-xl">
                 <p className="text-xl text-neutral-300 font-medium leading-relaxed">
                   {activeItem.interactions.accordionDescription}
                 </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
