"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

export function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isPointerDevice, setIsPointerDevice] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    // Check if device has a fine pointer (mouse)
    if (!window.matchMedia("(pointer: fine)").matches) {
      setIsPointerDevice(false);
      return;
    }

    // Terapkan cursor none ke body pada Desktop
    document.body.style.cursor = "none";

    const moveCursor = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };
    
    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    
    // Function to attach hover listeners to all clickable elements
    const attachListeners = () => {
      const interactables = document.querySelectorAll("a, button, input, select, textarea, [data-cursor='pointer']");
      
      const handleMouseEnter = () => {
        setIsHovering(true);
        // Pastikan kursor bawaan tetap none saat menyentuh link
        document.body.classList.add("hovering-link");
      };
      const handleMouseLeave = () => {
        setIsHovering(false);
        document.body.classList.remove("hovering-link");
      };

      interactables.forEach((el) => {
        el.addEventListener("mouseenter", handleMouseEnter);
        el.addEventListener("mouseleave", handleMouseLeave);
        // Force css cursor none on elements
        (el as HTMLElement).style.cursor = "none";
      });

      return () => {
        interactables.forEach((el) => {
          el.removeEventListener("mouseenter", handleMouseEnter);
          el.removeEventListener("mouseleave", handleMouseLeave);
        });
      };
    };

    let cleanupListeners = attachListeners();

    // Re-attach listeners on DOM mutations (like after route changes/renders)
    const observer = new MutationObserver(() => {
      cleanupListeners();
      cleanupListeners = attachListeners();
    });
    
    observer.observe(document.body, { childList: true, subtree: true });

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    
    const handleMouseLeaveWindow = () => setIsVisible(false);
    const handleMouseEnterWindow = () => setIsVisible(true);

    document.addEventListener("mouseleave", handleMouseLeaveWindow);
    document.addEventListener("mouseenter", handleMouseEnterWindow);

    return () => {
      document.body.style.cursor = "auto";
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseLeaveWindow);
      document.removeEventListener("mouseenter", handleMouseEnterWindow);
      observer.disconnect();
      cleanupListeners();
    };
  }, [pathname]);

  if (!isPointerDevice || !isVisible) return null;

  return (
    <>
      {/* Dot Utama */}
      <motion.div
        className="fixed top-0 left-0 w-3 h-3 rounded-full pointer-events-none z-[10000]"
        animate={{
          x: position.x - 6,
          y: position.y - 6,
          scale: isClicking ? 0.7 : isHovering ? 2.5 : 1,
          backgroundColor: isHovering ? "rgba(245, 158, 11, 0.8)" : "rgba(255, 255, 255, 1)", // Amber 500 saat hover
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 28,
          mass: 0.5
        }}
      />
      
      {/* Cincin Luar Transparan */}
      <motion.div
        className="fixed top-0 left-0 w-10 h-10 border border-white/30 rounded-full pointer-events-none z-[9999]"
        animate={{
          x: position.x - 20,
          y: position.y - 20,
          scale: isClicking ? 0.9 : isHovering ? 1.5 : 1,
          opacity: isHovering ? 0 : 1, // Menghilang saat hover untuk fokus ke amber dot
        }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 20,
          mass: 0.8
        }}
      />
    </>
  );
}
