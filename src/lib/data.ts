import { GalleryItem } from '@/types';

export const mockGalleryData: GalleryItem[] = [
  {
    id: "item-001",
    title: "Neon Dystopia",
    category: "Cyberpunk",
    slug: "neon-dystopia",
    images: {
      thumbnail: "/images/neon-dystopia-thumb.webp",
      fullResolution: "/images/neon-dystopia-full.webp",
      altText: "Cityscape in neon colors during heavy rain",
      dimensions: {
        width: 1920,
        height: 1080,
        aspectRatio: "16/9"
      },
      isLCP: true
    },
    interactions: {
      parallaxSpeed: 0.2,
      accordionDescription: "Sebuah eksplorasi visual tentang kehidupan urban di masa depan yang padat."
    },
    metadata: {
      author: "Fikri",
      createdAt: "2026-04-02T00:00:00Z"
    }
  },
  {
    id: "item-002",
    title: "Silent Monolith",
    category: "Abstract",
    slug: "silent-monolith",
    images: {
      thumbnail: "/images/silent-monolith-thumb.webp",
      fullResolution: "/images/silent-monolith-full.webp",
      altText: "A giant abstract structure in a foggy desert",
      dimensions: {
        width: 2560,
        height: 1440,
        aspectRatio: "16/9"
      },
      isLCP: false
    },
    interactions: {
      parallaxSpeed: 0.15,
      accordionDescription: "Monumen misterius yang memicu perenungan atas kesunyian absolut."
    },
    metadata: {
      author: "Fikri",
      createdAt: "2026-04-01T15:30:00Z"
    }
  },
  {
    id: "item-003",
    title: "Aetherial Blossom",
    category: "Nature",
    slug: "aetherial-blossom",
    images: {
      thumbnail: "/images/aetherial-blossom-thumb.webp",
      fullResolution: "/images/aetherial-blossom-full.webp",
      altText: "Bioluminescent flora glowing in the dark",
      dimensions: {
        width: 1440,
        height: 1920,
        aspectRatio: "3/4"
      },
      isLCP: false
    },
    interactions: {
      parallaxSpeed: 0.25,
      accordionDescription: "Keajaiban botani dengan kilau neon alami yang merespons sentuhan."
    },
    metadata: {
      author: "Fikri",
      createdAt: "2026-03-25T10:15:00Z"
    }
  }
];
