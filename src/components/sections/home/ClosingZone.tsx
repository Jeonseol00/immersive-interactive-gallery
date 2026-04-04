"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export function ClosingZone() {
  return (
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

    </motion.div>
  );
}
