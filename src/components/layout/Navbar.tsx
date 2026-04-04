"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const { isMenuOpen, setIsMenuOpen } = useStore();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex h-16 md:h-20 items-center justify-between px-6 md:px-12 backdrop-blur-md bg-black/40 border-b border-white/10 text-white">
      <Link href="/" className="text-xl md:text-2xl font-black tracking-tighter hover:opacity-80 transition-opacity z-50">
        IMGAL
      </Link>

      {/* Desktop Menu */}
      <nav className="hidden md:flex gap-8 text-sm font-medium tracking-wide items-center">
        <Link href="/gallery" className="hover:text-amber-400 transition-colors">
          Galeri
        </Link>
        <Link href="/about" className="hover:text-amber-400 transition-colors">
          Tentang Kami
        </Link>
        <Link href="/contact" className="px-5 py-2.5 bg-white text-black rounded-full font-semibold hover:bg-neutral-200 transition-colors">
          Hubungi
        </Link>
      </nav>

      {/* Mobile Hamburger (Min height 48px for a11y) */}
      <button 
        className="md:hidden p-3 -mr-3 z-50 text-white mix-blend-difference"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Toggle Menu"
      >
        {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Mobile Menu Overlay - Upgrade: Full Screen Immersive */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, clipPath: "inset(100% 0 0 0)" }}
            animate={{ opacity: 1, clipPath: "inset(0% 0 0 0)" }}
            exit={{ opacity: 0, clipPath: "inset(100% 0 0 0)", transition: { delay: 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] } }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 top-0 bg-neutral-950 z-40 md:hidden flex flex-col pt-24 pb-10 px-6 h-[100dvh] overflow-y-auto"
          >
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={{
                open: {
                  transition: { staggerChildren: 0.1, delayChildren: 0.3 }
                },
                closed: {
                  transition: { staggerChildren: 0.05, staggerDirection: -1 }
                }
              }}
              className="flex flex-col w-full flex-grow mt-4"
            >
              {[
                { label: "Galeri", href: "/gallery", subtitle: "Eksplorasi Mahakarya" },
                { label: "Kampanye", href: "/campaigns", subtitle: "Acara & Pameran" },
                { label: "Tentang Kami", href: "/about", subtitle: "Cerita di Balik Galeri" },
                { label: "Hubungi", href: "/contact", subtitle: "Bekerja Sama" }
              ].map((link, i) => (
                <motion.div
                  key={i}
                  variants={{
                    open: { opacity: 1, y: 0 },
                    closed: { opacity: 0, y: 30 }
                  }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="border-b border-white/10 last:border-0"
                  style={{ willChange: "transform, opacity" }}
                >
                  <Link 
                    href={link.href}
                    className="flex flex-col py-6 group hover:pl-4 transition-all duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="text-[2.5rem] leading-none font-black tracking-tighter text-white uppercase">
                      {link.label}
                    </span>
                    <span className="text-xs text-amber-500 font-bold uppercase tracking-widest mt-2">
                        {link.subtitle}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </motion.div>

            {/* Menu Footer */}
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0 }}
               transition={{ delay: 0.8, duration: 0.5 }}
               className="flex flex-col gap-6 mt-12 mb-4"
            >
               <div className="flex gap-6 text-[10px] font-black tracking-[0.2em] text-neutral-500 uppercase">
                  <a href="#" className="hover:text-amber-500 transition-colors">Instagram</a>
                  <a href="#" className="hover:text-amber-500 transition-colors">Twitter</a>
                  <a href="#" className="hover:text-amber-500 transition-colors">Facebook</a>
               </div>
               <p className="text-neutral-700 font-mono text-[10px]">© {new Date().getFullYear()} IMGAL GALLERY. ALL RIGHTS RESERVED.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
