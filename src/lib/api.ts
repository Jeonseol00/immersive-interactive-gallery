import { GalleryResponse, GalleryItem } from "@/types";

const IS_BROWSER = typeof window !== "undefined";
const API_BASE_URL = IS_BROWSER
  ? "/api/gallery"
  : `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/gallery`;

import { mockGalleryData } from "@/lib/data";

export async function fetchGalleryItems(
  page: number = 1,
  limit: number = 10
): Promise<GalleryItem[]> {
  try {
    // Di lingkungan produksi/build, bypass request HTTP absolut.
    if (typeof window === "undefined") {
      return mockGalleryData;
    }

    const res = await fetch(`${API_BASE_URL}?page=${page}&limit=${limit}`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch gallery items: ${res.statusText}`);
    }

    const data: GalleryResponse & { success: boolean; galleryItems: GalleryItem[] } = await res.json();
    return data.galleryItems || [];
  } catch (error) {
    console.error(error);
    return mockGalleryData;
  }
}

export async function fetchGalleryItemBySlug(
  slug: string
): Promise<GalleryItem | null> {
  try {
    if (typeof window === "undefined") {
      return mockGalleryData.find(item => item.slug === slug) || null;
    }

    const res = await fetch(`${API_BASE_URL}/${slug}`, {
      next: { revalidate: 60 },
    });
    
    if (res.ok) {
        const data = await res.json();
        return data.item || null;
    }
    
    // Fallback if [slug] route doesn't exist yet but we need it.
    console.warn("Falling back to fetching all items because slug route failed");
    return mockGalleryData.find(item => item.slug === slug) || null;

  } catch (error) {
    console.error(error);
    return mockGalleryData.find(item => item.slug === slug) || null;
  }
}
