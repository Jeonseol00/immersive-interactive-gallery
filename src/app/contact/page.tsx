export const metadata = {
  title: "Hubungi Kami | Immersive Interactive Gallery",
  description: "Mari berkolaborasi dan wujudkan pameran spektakuler.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-neutral-950 pt-24 md:pt-32 pb-20 px-6 md:px-12 relative overflow-hidden flex flex-col justify-center">
      {/* Decorative Blur Object - Aesthetic Enhancement */}
      <div className="absolute top-1/4 -right-32 w-[600px] h-[600px] bg-amber-600/20 rounded-full blur-[140px] pointer-events-none mix-blend-screen"></div>

      <div className="max-w-xl mx-auto relative z-10 w-full">
        <div className="text-center md:text-left mb-10 md:mb-12">
           <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white mb-4">Mari Bicara</h1>
           <p className="text-neutral-400 text-base md:text-lg">Ruang terbuka untuk kolaborasi artistik, pertanyaan teknis, atau proposal pameran visual Anda.</p>
        </div>
        
        {/* Floating Form Glassmorphism */}
        <form className="bg-black/50 backdrop-blur-xl p-8 md:p-12 rounded-[2rem] border border-white/10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] flex flex-col gap-8 md:gap-10">
           <div className="flex flex-col gap-2 relative group">
              <label className="text-[10px] font-black tracking-widest text-neutral-500 uppercase">Nama Lengkap</label>
              <input type="text" className="w-full bg-transparent border-b border-white/10 pb-3 text-white placeholder-neutral-700 outline-none focus:border-amber-500 transition-colors rounded-none" placeholder="Masukkan nama Anda" />
           </div>
           
           <div className="flex flex-col gap-2 relative group">
              <label className="text-[10px] font-black tracking-widest text-neutral-500 uppercase">Alamat Email</label>
              <input type="email" className="w-full bg-transparent border-b border-white/10 pb-3 text-white placeholder-neutral-700 outline-none focus:border-amber-500 transition-colors rounded-none" placeholder="hello@galeri.com" />
           </div>

           <div className="flex flex-col gap-2 relative group">
              <label className="text-[10px] font-black tracking-widest text-neutral-500 uppercase">Visi & Pesan</label>
              <textarea rows={4} className="w-full bg-transparent border-b border-white/10 pb-3 text-white placeholder-neutral-700 outline-none focus:border-amber-500 transition-colors resize-none rounded-none" placeholder="Ceritakan ide kolaborasi Anda..."></textarea>
           </div>

           <button 
             type="submit" 
             className="mt-6 bg-white text-black py-4 rounded-full font-black text-sm uppercase tracking-widest hover:bg-amber-400 active:scale-95 transition-all w-full"
           >
              Kirim Sinyal
           </button>
        </form>
      </div>
    </div>
  );
}
