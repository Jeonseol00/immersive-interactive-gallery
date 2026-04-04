"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full py-12 px-6 flex flex-col items-center justify-center relative z-20 bg-black/50 backdrop-blur-md border-t border-white/5 mt-auto">
       <div className="w-full max-w-screen-2xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
         
         <div className="flex flex-col items-center md:items-start gap-2">
            <Link href="/" className="text-2xl font-black tracking-widest text-white hover:text-amber-500 transition-colors">
              IMGAL
            </Link>
            <p className="text-neutral-500 text-[10px] font-mono tracking-widest uppercase">
              Ruang Eksibisi Digital
            </p>
         </div>

         <div className="flex gap-8 pointer-events-auto">
           <a href="#" className="text-neutral-500 hover:text-white text-[10px] font-bold uppercase tracking-widest transition-colors">Instagram</a>
           <a href="#" className="text-neutral-500 hover:text-white text-[10px] font-bold uppercase tracking-widest transition-colors">Behance</a>
           <a href="#" className="text-neutral-500 hover:text-white text-[10px] font-bold uppercase tracking-widest transition-colors">Dribbble</a>
         </div>

         <p className="text-neutral-600 text-[10px] font-mono uppercase tracking-widest text-center md:text-right">
           &copy; {new Date().getFullYear()} IMGAL. ALL RIGHTS RESERVED.
         </p>

       </div>
    </footer>
  );
}
