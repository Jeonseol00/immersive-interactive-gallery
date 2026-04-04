"use client";

import { motion, useScroll, useTransform, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef, useEffect, useState } from "react";

// Komponen penghitung angka pamer untuk stat block
function AnimatedCounter({ end, suffix = "" }: { end: number, suffix?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const duration = 2000;
      // Mencegah error pembagian by zero
      const stepTime = end > 0 ? Math.abs(Math.floor(duration / end)) : duration;
      
      const timer = setInterval(() => {
        start += 1;
        setValue(start);
        if (start >= end) {
          setValue(end);
          clearInterval(timer);
        }
      }, stepTime);
      return () => clearInterval(timer);
    }
  }, [isInView, end]);

  return (
    <span ref={ref}>
      {value}{suffix}
    </span>
  );
}

export default function AboutClient() {
  const heroRef = useRef(null);
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(heroScroll, [0, 1], ["0%", "40%"]);
  const heroOpacity = useTransform(heroScroll, [0, 1], [1, 0]);

  return (
    <div className="w-full flex flex-col font-sans relative z-10 overflow-hidden">
      
      {/* SECTION 1: Cinematic Hero */}
      <section ref={heroRef} className="relative w-full h-[100dvh] flex items-center justify-center overflow-hidden">
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="absolute inset-0 z-0">
          <Image 
            src="/images/birmingham-museums-trust-e0wBK0xJXYQ-unsplash.jpg" 
            alt="Museum Hall" 
            fill 
            className="object-cover opacity-30 mix-blend-luminosity grayscale"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-black" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-transparent" />
        </motion.div>
        
        <div className="relative z-10 flex flex-col items-center text-center px-6">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ willChange: "transform, opacity" }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="overflow-hidden"
          >
            <h1 className="text-5xl md:text-8xl lg:text-[10vw] font-black tracking-tighter text-white uppercase drop-shadow-2xl leading-none">
              Sebuah <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-200 block md:inline">Manifesto</span>
            </h1>
          </motion.div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.8 }}
            className="mt-6 text-neutral-400 md:text-lg tracking-[0.3em] uppercase font-bold"
          >
            Mahakarya Di Ujung Jari Anda
          </motion.p>
        </div>
        
        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] uppercase tracking-widest text-white/50">Gulir ke bawah</span>
          <div className="w-px h-12 bg-white/20 relative overflow-hidden">
             <motion.div 
               animate={{ y: ["-100%", "100%"] }}
               transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
               className="w-full h-full bg-amber-500 absolute top-0"
             />
          </div>
        </motion.div>
      </section>

      {/* SECTION 2: Sticky Philosophy */}
      <section className="relative w-full py-24 md:py-48 px-6 md:px-12 lg:px-24 max-w-screen-2xl mx-auto flex flex-col lg:flex-row gap-16 lg:gap-24">
        {/* Kolom Kiri: Sticky Title */}
        <div className="w-full lg:w-5/12 lg:sticky top-32 h-fit">
          <motion.h2 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-6xl font-black tracking-tight leading-none text-white"
          >
            Mendefinisikan Ulang<br/>
            <span className="text-amber-500">Ruang Eksibisi.</span>
          </motion.h2>
          <motion.div 
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3 }}
            className="h-1 w-32 bg-white/20 mt-8 origin-left relative"
          >
            <div className="absolute top-0 left-0 h-full bg-amber-500 w-1/3" />
          </motion.div>
        </div>

        {/* Kolom Kanan: Scrolling Story */}
        <div className="w-full lg:w-7/12 flex flex-col gap-12 md:gap-20 text-xl md:text-3xl text-neutral-300 font-light leading-relaxed">
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            Kami percaya bahwa karya seni luhur masa lalu <strong className="text-white">tidak seharusnya dikurung</strong> dalam keheningan arsip dan tumpukan piksel yang statis.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            Memanfaatkan ketangguhan web modern, IMGAL lahir sebagai sebuah jembatan—melebur pesona lukisan klasik ke dalam dimensi digital interaktif yang merespons langsung intuisi sentuhan Anda.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            style={{ willChange: "transform, opacity" }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2 }}
            className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden border border-white/10 mt-4 group"
          >
            <Image 
              src="/images/birmingham-museums-trust-sJr8LDyEf7k-unsplash.jpg" 
              alt="Art Detail" 
              fill 
              className="object-cover group-hover:scale-110 transition-transform duration-[2s] grayscale group-hover:grayscale-0"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-1000" />
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            Setiap sapuan kuas yang bertahan melintasi sekian abad, kini mendenyutkan nyawa baru. Kami tidak sekadar memajang gambar; kami <strong className="text-white font-bold">membangun realitas virtual</strong> di mana karya seni bernafas, hidup, dan dapat dirasakan.
          </motion.p>
        </div>
      </section>

      {/* SECTION 3: The Scale (Metrics) */}
      <section className="w-full py-24 md:py-40 bg-gradient-to-b from-transparent via-black/80 to-transparent relative z-10 border-y border-white/5">
        <div className="max-w-screen-xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col items-center text-center"
          >
            <h3 className="text-5xl md:text-7xl font-black text-amber-500 mb-2 font-mono"><AnimatedCounter end={50} suffix="+" /></h3>
            <p className="text-[10px] md:text-xs tracking-[0.2em] uppercase font-bold text-neutral-400">Koleksi Terkurasi</p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col items-center text-center"
          >
            <h3 className="text-5xl md:text-7xl font-black text-white mb-2 font-mono"><AnimatedCounter end={12} /></h3>
            <p className="text-[10px] md:text-xs tracking-[0.2em] uppercase font-bold text-neutral-400">Eksibisi Global</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col items-center text-center"
          >
            <h3 className="text-5xl md:text-7xl font-black text-white mb-2 font-mono"><AnimatedCounter end={8} suffix="M+" /></h3>
            <p className="text-[10px] md:text-xs tracking-[0.2em] uppercase font-bold text-neutral-400">Piksel Dirender</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col items-center text-center"
          >
            <h3 className="text-5xl md:text-7xl font-black text-amber-500 mb-2 font-mono"><AnimatedCounter end={1} /></h3>
            <p className="text-[10px] md:text-xs tracking-[0.2em] uppercase font-bold text-neutral-400">Visi Abadi</p>
          </motion.div>
        </div>
      </section>

      {/* SECTION 4: Vision CTA */}
      <section className="w-full py-40 flex flex-col items-center justify-center text-center px-6 relative z-10">
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-amber-500 font-bold uppercase tracking-[0.3em] text-sm mb-6"
        >
          Siap Memulai Perjalanan?
        </motion.p>
        <motion.h2 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-4xl md:text-7xl font-black tracking-tighter mb-12 text-white"
        >
          Masuki Ruang Pameran.
        </motion.h2>
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 1, delay: 0.4 }}
           className="relative"
        >
          <Link href="/gallery" className="group relative px-10 py-5 bg-white text-black rounded-full font-black uppercase tracking-widest text-sm overflow-hidden block hover:scale-105 active:scale-95 transition-all">
            <span className="relative z-10 group-hover:text-white transition-colors duration-500">Jelajahi Koleksi Utama</span>
            <div className="absolute inset-0 bg-amber-500 transform scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-bottom" />
          </Link>
        </motion.div>
      </section>

    </div>
  );
}
