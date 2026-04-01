"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

interface ParallaxImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  layoutId?: string;
  parallaxSpeed?: number;
  isLCP?: boolean;
  className?: string;
  imageClassName?: string;
}

export function ParallaxImage({
  src,
  alt,
  width,
  height,
  layoutId,
  parallaxSpeed = 0.2,
  isLCP = false,
  className,
  imageClassName,
}: ParallaxImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || parallaxSpeed === 0) return;

    gsap.registerPlugin(ScrollTrigger);

    const container = containerRef.current;
    const image = imageRef.current;

    if (!container || !image) return;

    // Calculate parallax movement based on speed
    // Higher speed means more movement (e.g. 0.2 means it moves 20% of its height)
    const yPercent = parallaxSpeed * 50;

    const ctx = gsap.context(() => {
      // Set initial scale to allow for parallax movement without clipping edges
      gsap.set(image, { scale: 1.1, yPercent: -yPercent });

      gsap.to(image, {
        yPercent: yPercent,
        ease: "none",
        scrollTrigger: {
          trigger: container,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }, container);

    return () => ctx.revert();
  }, [parallaxSpeed, prefersReducedMotion]);

  // Use motion.img but with next/image inside, or just motion.div wrapping next/image? 
  // Custom framer-motion with next/image
  const MotionImage = motion.create(Image);

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden w-full h-full", className)}
    >
      <MotionImage
        ref={imageRef as any}
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={isLCP}
        className={cn("object-cover w-full h-full", imageClassName)}
        layoutId={layoutId}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      />
    </div>
  );
}
