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
      <Link href="/" className="text-xl md:text-2xl font-bold tracking-tighter hover:opacity-80 transition-opacity">
        IMGAL
      </Link>

      {/* Desktop Menu */}
      <nav className="hidden md:flex gap-8 text-sm font-medium tracking-wide items-center">
        <Link href="/" className="hover:text-amber-400 transition-colors">
          Galeri
        </Link>
        <Link href="/about" className="hover:text-amber-400 transition-colors">
          Tentang Kami
        </Link>
        <button className="px-5 py-2.5 bg-white text-black rounded-full font-semibold hover:bg-neutral-200 transition-colors">
          Hubungi
        </button>
      </nav>

      {/* Mobile Hamburger (Min height 48px for a11y) */}
      <button 
        className="md:hidden p-3 -mr-3"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Toggle Menu"
      >
        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, transition: { delay: 0.3 } }}
            className="fixed inset-0 top-16 bg-black z-40 md:hidden flex flex-col items-center justify-center gap-8 text-3xl font-semibold"
          >
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={{
                open: {
                  transition: { staggerChildren: 0.1, delayChildren: 0.2 }
                },
                closed: {
                  transition: { staggerChildren: 0.05, staggerDirection: -1 }
                }
              }}
              className="flex flex-col items-center gap-8"
            >
              {[
                { label: "Galeri", href: "/" },
                { label: "Kampanye", href: "/campaigns" },
                { label: "Tentang Kami", href: "/about" },
                { label: "Hubungi", href: "/contact" }
              ].map((link, i) => (
                <motion.div
                  key={i}
                  variants={{
                    open: { opacity: 1, y: 0 },
                    closed: { opacity: 0, y: 20 }
                  }}
                >
                  <Link 
                    href={link.href}
                    className="hover:text-amber-400 transition-colors p-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
