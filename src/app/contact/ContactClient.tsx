"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function ContactClient() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulasi loading API
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 5000); // Reset form setelah 5 dtk
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-transparent pt-24 md:pt-32 pb-20 px-6 md:px-12 relative z-10 overflow-hidden flex flex-col justify-center">
      <div className="max-w-xl mx-auto relative z-10 w-full">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          style={{ willChange: "transform, opacity" }}
          className="text-center md:text-left mb-10 md:mb-12"
        >
           <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white mb-4">Mari Bicara</h1>
           <p className="text-neutral-400 text-base md:text-lg">Ruang terbuka untuk kolaborasi artistik, pertanyaan teknis, atau proposal pameran visual Anda.</p>
        </motion.div>
        
        {/* Floating Form Glassmorphism */}
        <motion.form 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          style={{ willChange: "transform, opacity" }}
          onSubmit={handleSubmit}
          className="bg-black/40 backdrop-blur-xl p-8 md:p-12 rounded-[2rem] border border-white/10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] flex flex-col gap-8 md:gap-10 relative overflow-hidden"
        >
           {/* Success Overlay state! */}
           <AnimatePresence>
             {isSuccess && (
               <motion.div 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 exit={{ opacity: 0 }}
                 className="absolute inset-0 bg-neutral-950/90 z-20 flex flex-col items-center justify-center p-8 text-center backdrop-blur-md"
               >
                 <motion.div
                   initial={{ scale: 0 }}
                   animate={{ scale: 1 }}
                   transition={{ type: "spring", stiffness: 200, damping: 20 }}
                   className="w-16 h-16 rounded-full bg-amber-500 text-black flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(245,158,11,0.6)]"
                 >
                   <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                 </motion.div>
                 <h3 className="text-3xl font-black text-white mb-2">Sinyal Diterima</h3>
                 <p className="text-neutral-400 text-sm">Pesan Anda sedang melintasi jaringan kami. Kurator kami akan segera menghubungi Anda kembali.</p>
               </motion.div>
             )}
           </AnimatePresence>

           <div className="flex flex-col gap-2 relative group">
              <label className="text-[10px] font-black tracking-widest text-neutral-500 uppercase group-focus-within:text-amber-500 transition-colors">Nama Lengkap</label>
              <input required type="text" className="w-full bg-transparent border-b border-white/10 pb-3 text-white placeholder-neutral-700 outline-none focus:border-amber-500 transition-colors" placeholder="Masukkan nama Anda" />
           </div>
           
           <div className="flex flex-col gap-2 relative group">
              <label className="text-[10px] font-black tracking-widest text-neutral-500 uppercase group-focus-within:text-amber-500 transition-colors">Alamat Email</label>
              <input required type="email" className="w-full bg-transparent border-b border-white/10 pb-3 text-white placeholder-neutral-700 outline-none focus:border-amber-500 transition-colors" placeholder="hello@galeri.com" />
           </div>

           <div className="flex flex-col gap-2 relative group">
              <label className="text-[10px] font-black tracking-widest text-neutral-500 uppercase group-focus-within:text-amber-500 transition-colors">Visi & Pesan</label>
              <textarea required rows={4} className="w-full bg-transparent border-b border-white/10 pb-3 text-white placeholder-neutral-700 outline-none focus:border-amber-500 transition-colors resize-none" placeholder="Ceritakan ide kolaborasi Anda..."></textarea>
           </div>

           <button 
             type="submit" 
             disabled={isSubmitting}
             className="mt-6 bg-white text-black py-4 rounded-full font-black text-sm uppercase tracking-widest hover:bg-amber-400 active:scale-95 transition-all w-full flex justify-center items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)]"
           >
              {isSubmitting ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-black border-t-transparent rounded-full"
                />
              ) : 'Kirim Sinyal'}
           </button>
        </motion.form>
      </div>
    </div>
  );
}
