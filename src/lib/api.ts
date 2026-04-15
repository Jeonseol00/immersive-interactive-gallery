import { GalleryItem, GalleryResponse } from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

/**
 * Fetch gallery items from Supabase via API.
 * Source of Truth: Database only — no mock data fallback.
 */
export async function fetchGalleryItems(): Promise<GalleryItem[]> {
  try {
    const res = await fetch(`${API_BASE}/api/gallery?page=1&limit=50`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error('API error');
    const data: GalleryResponse = await res.json();
    return data.galleryItems || [];
  } catch (err) {
    console.warn('[API] fetchGalleryItems failed:', err);
    return [];
  }
}

/**
 * Fetch a single gallery item by slug.
 */
export async function fetchGalleryItemBySlug(slug: string): Promise<GalleryItem | null> {
  try {
    const res = await fetch(`${API_BASE}/api/gallery/${slug}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error('API error');
    const data = await res.json();
    return data.item || null;
  } catch (err) {
    console.warn('[API] fetchGalleryItemBySlug failed:', err);
    return null;
  }
}

/**
 * Fetch waterfall-featured items for the homepage.
 */
export async function fetchWaterfallItems(): Promise<GalleryItem[]> {
  try {
    const res = await fetch(`${API_BASE}/api/waterfall`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error('API error');
    const data = await res.json();
    return data.items || [];
  } catch (err) {
    console.warn('[API] fetchWaterfallItems failed:', err);
    return [];
  }
}
