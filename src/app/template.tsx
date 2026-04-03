"use client";

import { motion } from "framer-motion";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Animasi Curtain Wipe: Setiap halaman baru dimuat, layar akan tertutup hitam lalu perlahan terbuka ke atas */}
      <motion.div
        className="fixed inset-0 w-full bg-neutral-950 z-[8000] pointer-events-none origin-bottom"
        initial={{ height: "100vh" }}
        animate={{ height: "0vh", top: 0 }}
        transition={{ duration: 1, ease: [0.76, 0, 0.24, 1], delay: 0.1 }}
      />
      
      {/* Teks Logo yang ikut terangkat */}
      <motion.div
        className="fixed inset-0 flex items-center justify-center z-[8010] pointer-events-none"
        initial={{ opacity: 1, y: 0 }}
        animate={{ opacity: 0, y: -100 }}
        transition={{ duration: 1, ease: [0.76, 0, 0.24, 1], delay: 0.1 }}
      >
        <h2 className="text-4xl font-black tracking-[0.4em] text-white/50 mix-blend-overlay">IMGAL</h2>
      </motion.div>

      {/* Konten Halaman: Muncul perlahan dari blur */}
      <motion.div
        initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
        className="will-change-transform"
      >
        {children}
      </motion.div>
    </>
  );
}
