import { GalleryItem } from '@/types';

export const mockGalleryData: GalleryItem[] = [
  {
    id: "item-001",
    title: "Vivid Dimensions",
    category: "Architecture",
    slug: "vivid-dimensions",
    images: {
      thumbnail: "/images/adrianna-geo-1rBg5YSi00c-unsplash.jpg",
      fullResolution: "/images/adrianna-geo-1rBg5YSi00c-unsplash.jpg",
      altText: "Architectural structure with dynamic lighting",
      dimensions: { width: 800, height: 1200, aspectRatio: "2/3" },
      isLCP: true
    },
    interactions: {
      parallaxSpeed: 0.2,
      accordionDescription: "Eksplorasi ruang geometris yang melengkung dan garis simetris yang membias pada sudut penglihatan ganda."
    },
    metadata: { author: "Artelab", createdAt: "2026-04-02T00:00:00Z" }
  },
  {
    id: "item-002",
    title: "Classical Aura",
    category: "Fine Art",
    slug: "classical-aura",
    images: {
      thumbnail: "/images/birmingham-museums-trust-e0wBK0xJXYQ-unsplash.jpg",
      fullResolution: "/images/birmingham-museums-trust-e0wBK0xJXYQ-unsplash.jpg",
      altText: "Classical museum artifact painting",
      dimensions: { width: 1200, height: 800, aspectRatio: "3/2" },
      isLCP: false
    },
    interactions: {
      parallaxSpeed: 0.15,
      accordionDescription: "Sisa-sisa kemegahan era klasik dalam satu sapuan lukisan yang sarat akan guratan sejarah tak lekang oleh waktu."
    },
    metadata: { author: "Artelab", createdAt: "2026-04-01T15:30:00Z" }
  },
  {
    id: "item-003",
    title: "Eternal Gaze",
    category: "Portrait",
    slug: "eternal-gaze",
    images: {
      thumbnail: "/images/birmingham-museums-trust-sJr8LDyEf7k-unsplash.jpg",
      fullResolution: "/images/birmingham-museums-trust-sJr8LDyEf7k-unsplash.jpg",
      altText: "Historical expressive portrait",
      dimensions: { width: 900, height: 1200, aspectRatio: "3/4" },
      isLCP: false
    },
    interactions: {
      parallaxSpeed: 0.25,
      accordionDescription: "Sebuah tatapan masa lalu yang menembus lapisan kanvas dan kanon waktu menuju abad digital kita."
    },
    metadata: { author: "Artelab", createdAt: "2026-03-25T10:15:00Z" }
  },
  {
    id: "item-004",
    title: "Mythic Lore",
    category: "Fine Art",
    slug: "mythic-lore",
    images: {
      thumbnail: "/images/birmingham-museums-trust-zWE5pOLWkio-unsplash.jpg",
      fullResolution: "/images/birmingham-museums-trust-zWE5pOLWkio-unsplash.jpg",
      altText: "Large canvas depicting a mythological event",
      dimensions: { width: 1400, height: 900, aspectRatio: "14/9" },
      isLCP: false
    },
    interactions: {
      parallaxSpeed: 0.12,
      accordionDescription: "Kisah mitologi dan fragmen legenda tertuang padat dalam spektrum sinambung yang dramatis."
    },
    metadata: { author: "Artelab", createdAt: "2026-03-15T09:00:00Z" }
  },
  {
    id: "item-005",
    title: "Knowledge Vault",
    category: "Heritage",
    slug: "knowledge-vault",
    images: {
      thumbnail: "/images/boston-public-library-YoK5pBcSY8s-unsplash.jpg",
      fullResolution: "/images/boston-public-library-YoK5pBcSY8s-unsplash.jpg",
      altText: "Vintage historical archive from the library",
      dimensions: { width: 1000, height: 1400, aspectRatio: "5/7" },
      isLCP: false
    },
    interactions: {
      parallaxSpeed: 0.22,
      accordionDescription: "Rak-rak ingatan literatur dunia berpadu dengan jejak manuskrip antik; sebuah arsip kebijaksanaan universal."
    },
    metadata: { author: "Artelab", createdAt: "2026-03-10T12:00:00Z" }
  },
  {
    id: "item-006",
    title: "European Charm",
    category: "Heritage",
    slug: "european-charm",
    images: {
      thumbnail: "/images/europeana-5TK1F5VfdIk-unsplash.jpg",
      fullResolution: "/images/europeana-5TK1F5VfdIk-unsplash.jpg",
      altText: "An old European photograph or artifact",
      dimensions: { width: 1200, height: 1200, aspectRatio: "1/1" },
      isLCP: false
    },
    interactions: {
      parallaxSpeed: 0.1,
      accordionDescription: "Nostalgia peradaban terekam dalam bayangan monokromatis dan distorsi fotografi dari benua biru."
    },
    metadata: { author: "Artelab", createdAt: "2026-03-05T14:45:00Z" }
  },
  {
    id: "item-007",
    title: "Serene Passage",
    category: "Landscape",
    slug: "serene-passage",
    images: {
      thumbnail: "/images/francesco-bianco-TVsgRyKJDc0-unsplash.jpg",
      fullResolution: "/images/francesco-bianco-TVsgRyKJDc0-unsplash.jpg",
      altText: "A breathtaking landscape view",
      dimensions: { width: 1600, height: 1000, aspectRatio: "16/10" },
      isLCP: false
    },
    interactions: {
      parallaxSpeed: 0.3,
      accordionDescription: "Kedalaman panorama alam, menangkap interaksi bisu antara cahaya melankolis dan keheningan bumi."
    },
    metadata: { author: "Artelab", createdAt: "2026-02-28T08:30:00Z" }
  },
  {
    id: "item-008",
    title: "Winter Mirage",
    category: "Nature",
    slug: "winter-mirage",
    images: {
      thumbnail: "/images/henrik-donnestad-t2Sai-AqIpI-unsplash.jpg",
      fullResolution: "/images/henrik-donnestad-t2Sai-AqIpI-unsplash.jpg",
      altText: "Cold winter wilderness atmosphere",
      dimensions: { width: 800, height: 1000, aspectRatio: "4/5" },
      isLCP: false
    },
    interactions: {
      parallaxSpeed: 0.18,
      accordionDescription: "Angin dingin menyapu lapisan es, menceritakan rahasia alam di bawah langit perak."
    },
    metadata: { author: "Artelab", createdAt: "2026-02-20T16:20:00Z" }
  },
  {
    id: "item-009",
    title: "City Echoes",
    category: "Urban",
    slug: "city-echoes",
    images: {
      thumbnail: "/images/zeynep-sumer-lk3F07BN8T8-unsplash.jpg",
      fullResolution: "/images/zeynep-sumer-lk3F07BN8T8-unsplash.jpg",
      altText: "Minimalist urban setting or detail",
      dimensions: { width: 1200, height: 1600, aspectRatio: "3/4" },
      isLCP: false
    },
    interactions: {
      parallaxSpeed: 0.28,
      accordionDescription: "Gema dari kehidupan kota yang terekam dalam ritme cahaya senja, merefleksikan isolasi di antara keramaian."
    },
    metadata: { author: "Artelab", createdAt: "2026-02-15T18:00:00Z" }
  },
  {
    id: "item-010",
    title: "Urban Silhouette",
    category: "Portrait",
    slug: "urban-silhouette",
    images: {
      thumbnail: "/images/Potrait/clay-banks-mgLX9vQhxc8-unsplash.jpg",
      fullResolution: "/images/Potrait/clay-banks-mgLX9vQhxc8-unsplash.jpg",
      altText: "A striking portrait against an urban backdrop",
      dimensions: { width: 800, height: 1200, aspectRatio: "2/3" },
      isLCP: false
    },
    interactions: {
      parallaxSpeed: 0.22,
      accordionDescription: "Menangkap esensi manusia di tengah kerasnya struktur metropolitan. Bayangan yang bercerita lebih dari sekadar rupa."
    },
    metadata: { author: "Artelab", createdAt: "2026-04-03T10:00:00Z" }
  },
  {
    id: "item-011",
    title: "Ethereal Gaze",
    category: "Portrait",
    slug: "ethereal-gaze",
    images: {
      thumbnail: "/images/Potrait/download-1.jpg",
      fullResolution: "/images/Potrait/download-1.jpg",
      altText: "A classical or artistic portrait",
      dimensions: { width: 1000, height: 1333, aspectRatio: "3/4" },
      isLCP: false
    },
    interactions: {
      parallaxSpeed: 0.18,
      accordionDescription: "Tatapan yang menembus dimensi, membawa ketenangan melankolis yang tertuang dalam palet warna kontras."
    },
    metadata: { author: "Artelab", createdAt: "2026-04-02T12:00:00Z" }
  },
  {
    id: "item-012",
    title: "Vintage Aristocrat",
    category: "Heritage",
    slug: "vintage-aristocrat",
    images: {
      thumbnail: "/images/Potrait/europeana-VsnDYMWollM-unsplash.jpg",
      fullResolution: "/images/Potrait/europeana-VsnDYMWollM-unsplash.jpg",
      altText: "A historical vintage portrait of an aristocrat",
      dimensions: { width: 900, height: 1200, aspectRatio: "3/4" },
      isLCP: false
    },
    interactions: {
      parallaxSpeed: 0.15,
      accordionDescription: "Arsip visual kaum bangsawan masa lampau, membangkitkan pesona nostalgia zaman keemasan Eropa."
    },
    metadata: { author: "Artelab", createdAt: "2026-04-01T14:30:00Z" }
  },
  {
    id: "item-013",
    title: "Neon Pulse",
    category: "Portrait",
    slug: "neon-pulse",
    images: {
      thumbnail: "/images/Potrait/simon-lee-MnnDZX4gAw4-unsplash.jpg",
      fullResolution: "/images/Potrait/simon-lee-MnnDZX4gAw4-unsplash.jpg",
      altText: "A portrait illuminated by neon lights",
      dimensions: { width: 853, height: 1280, aspectRatio: "2/3" },
      isLCP: false
    },
    interactions: {
      parallaxSpeed: 0.28,
      accordionDescription: "Ketegangan cyberpunk terefleksi dalam pendaran cahaya buatan, merepresentasikan jiwa yang tersesat dalam lautan sirkuit."
    },
    metadata: { author: "Artelab", createdAt: "2026-03-30T20:00:00Z" }
  },
  {
    id: "item-014",
    title: "Silent Melody",
    category: "Portrait",
    slug: "silent-melody",
    images: {
      thumbnail: "/images/Potrait/tamara-menzi-n-vnWQmmVoY-unsplash.jpg",
      fullResolution: "/images/Potrait/tamara-menzi-n-vnWQmmVoY-unsplash.jpg",
      altText: "A serene and musical portrait",
      dimensions: { width: 1000, height: 1400, aspectRatio: "5/7" },
      isLCP: false
    },
    interactions: {
      parallaxSpeed: 0.2,
      accordionDescription: "Bentuk keanggunan yang tidak bersuara, setiap hembusan nafas dan ekspresi tergambar bagai alunan simfoni klasik."
    },
    metadata: { author: "Artelab", createdAt: "2026-03-28T09:15:00Z" }
  },
  {
    id: "item-015",
    title: "Raw Monochrome",
    category: "Fine Art",
    slug: "raw-monochrome",
    images: {
      thumbnail: "/images/Potrait/vojtech-bruzek-mCjA1I8SlS8-unsplash.jpg",
      fullResolution: "/images/Potrait/vojtech-bruzek-mCjA1I8SlS8-unsplash.jpg",
      altText: "A raw monochrome emotional portrait",
      dimensions: { width: 1200, height: 1600, aspectRatio: "3/4" },
      isLCP: false
    },
    interactions: {
      parallaxSpeed: 0.25,
      accordionDescription: "Eksplorasi emosi ekstrem dalam absennya warna, menyorot kekosongan dan sekaligus kepadatan jiwa subjek."
    },
    metadata: { author: "Artelab", createdAt: "2026-03-25T11:45:00Z" }
  }
];
