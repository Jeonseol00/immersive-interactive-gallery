"use client";

import { useState } from "react";
import { useScroll, useSpring, motion } from "framer-motion";
import { GalleryItem } from "@/types";
import { HeroZone } from "@/components/sections/home/HeroZone";
import { GalleryFeedZone } from "@/components/sections/home/GalleryFeedZone";
import { ClosingZone } from "@/components/sections/home/ClosingZone";

interface ImmersiveHomepageProps {
  items: GalleryItem[];
}

export function ImmersiveHomepage({ items }: ImmersiveHomepageProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeItem = items[activeIndex];
  
  const { scrollYProgress: blurProgress } = useScroll();
  const scaleX = useSpring(blurProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // Pengecekan safety mencegah error data kosong
  if (!items || items.length === 0) return null;

  return (
    <>
    <section className="relative w-full z-10 flex flex-col pt-0 pb-0 overflow-hidden">
      
      {/* Scroll Progress Indicator Inline */}
      <motion.div
        className="fixed top-16 md:top-20 left-0 right-0 h-[3px] bg-amber-500 origin-left z-50 shadow-[0_0_12px_rgba(245,158,11,0.6)]"
        style={{ scaleX, willChange: "transform" }}
      />

      <HeroZone items={items} />
      
      <GalleryFeedZone 
        items={items}
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex}
        activeItem={activeItem}
      />

      <ClosingZone />

    </section>
    </>
  );
}
