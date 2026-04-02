import Image from "next/image";

export const metadata = {
  title: "Kampanye | Immersive Interactive Gallery",
  description: "Jelajahi pameran eksklusif dan inisiatif seni kolaboratif kami.",
};

export default function CampaignsPage() {
  return (
    <div className="min-h-screen bg-black pt-24 md:pt-32 pb-20 px-6 md:px-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white mb-4">Kampanye</h1>
        <p className="text-neutral-400 text-lg mb-16 max-w-2xl">Jelajahi pameran eksklusif dan inisiatif seni kolaboratif kami sepanjang tahun.</p>
        
        <div className="flex flex-col gap-16 border-l border-white/10 pl-6 md:pl-10">
          {[
            { date: "Agt 2026", title: "Neo-Classical Revival", desc: "Instalasi interaktif seni klasik di era digital. Mengeksplorasi ulang warisan sejarah dengan visual komputasi terkini.", img: "/images/birmingham-museums-trust-zWE5pOLWkio-unsplash.jpg" },
            { date: "Okt 2026", title: "Urban Distortions", desc: "Menangkap realita kota metropolitan melalui lensa kontemporer dan refleksi cahaya neon eksperimental.", img: "/images/zeynep-sumer-lk3F07BN8T8-unsplash.jpg" },
            { date: "Des 2026", title: "Winter Mirage Gala", desc: "Pameran penutup tahun bernuansa es dan distorsi alam yang merekam fluktuasi iklim ekstrem Bumi.", img: "/images/henrik-donnestad-t2Sai-AqIpI-unsplash.jpg" }
          ].map((camp, i) => (
             <div key={i} className="relative group">
                <div className="absolute -left-[29px] md:-left-[45px] top-0.5 w-3 h-3 rounded-full bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.6)]"></div>
                <p className="text-amber-500 font-bold uppercase tracking-widest text-[10px] md:text-xs mb-3">{camp.date}</p>
                <div className="relative aspect-[4/3] md:aspect-[16/9] w-full rounded-[1.5rem] overflow-hidden mb-6 border border-white/5 group-hover:border-white/20 transition-colors">
                  <Image src={camp.img} alt={camp.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                </div>
                <h3 className="text-2xl md:text-4xl font-black tracking-tight text-white mb-3">{camp.title}</h3>
                <p className="text-neutral-400 text-sm md:text-base leading-relaxed max-w-2xl">{camp.desc}</p>
             </div>
          ))}
        </div>
      </div>
    </div>
  );
}
