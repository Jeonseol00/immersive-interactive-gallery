import Image from "next/image";

export const metadata = {
  title: "Tentang Kami | Immersive Interactive Gallery",
  description: "Cerita di balik galeri seni digital kami yang imersif.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black pt-24 md:pt-32 pb-20 px-6 md:px-12 flex items-center">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-12 items-center w-full">
        {/* Gambar Pahlawan untuk Desktop */}
        <div className="w-full md:w-1/2 relative aspect-[4/5] md:aspect-[3/4] rounded-[2rem] overflow-hidden border border-white/10 hidden md:block">
           <Image src="/images/birmingham-museums-trust-sJr8LDyEf7k-unsplash.jpg" alt="Filosofi IMGAL" fill className="object-cover grayscale hover:grayscale-0 transition-all duration-1000" />
           <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        </div>
        
        {/* Konten Naratif */}
        <div className="w-full md:w-1/2 flex flex-col gap-8 md:pl-8">
           <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white leading-[1.1]">Lebih dari sekadar <br className="hidden md:block"/><span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-200">Galeri.</span></h1>
           
           {/* Mobile Image (Tampil hanya di layar kecil) */}
           <div className="w-full relative aspect-square rounded-[1.5rem] overflow-hidden border border-white/10 md:hidden my-2">
             <Image src="/images/birmingham-museums-trust-sJr8LDyEf7k-unsplash.jpg" alt="Filosofi IMGAL" fill className="object-cover grayscale" />
           </div>

           <p className="text-neutral-300 text-base md:text-lg leading-relaxed">IMGAL lahir dari gagasan bahwa ruang pameran seni digital tidak seharusnya terasa statis. Di era komputasi modern, mahakarya masa lalu dan visi masa depan berhak mendapatkan medium transisi yang memukau dan performansi interaktif yang tak tertandingi.</p>
           
           <div className="grid grid-cols-2 gap-8 border-t border-white/10 pt-8 mt-2">
              <div>
                 <h4 className="text-4xl md:text-5xl font-black text-white mb-2">50+</h4>
                 <p className="text-[10px] md:text-xs uppercase tracking-widest text-neutral-500 font-bold">Koleksi Premium</p>
              </div>
              <div>
                 <h4 className="text-4xl md:text-5xl font-black text-white mb-2">12</h4>
                 <p className="text-[10px] md:text-xs uppercase tracking-widest text-neutral-500 font-bold">Eksibisi Global</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
