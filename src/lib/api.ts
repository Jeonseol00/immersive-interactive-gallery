import { GalleryItem, GalleryResponse } from '@/types';
import { mockGalleryData } from './data';

const API_BASE = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

/**
 * Fetch gallery items with Supabase-first, mock-data fallback.
 * Used by Server Components and generateStaticParams.
 */
export async function fetchGalleryItems(): Promise<GalleryItem[]> {
  // During build time, use mock data directly
  if (process.env.NODE_ENV === 'production' && typeof window === 'undefined') {
    return mockGalleryData;
  }

  try {
    const res = await fetch(`${API_BASE}/api/gallery?page=1&limit=50`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error('API error');
    const data: GalleryResponse = await res.json();
    return data.galleryItems || [];
  } catch {
    console.warn('[API] fetchGalleryItems failed, using mock data');
    return mockGalleryData;
  }
}

/**
 * Fetch a single gallery item by slug.
 */
export async function fetchGalleryItemBySlug(slug: string): Promise<GalleryItem | null> {
  // During build time, use mock data directly
  if (process.env.NODE_ENV === 'production' && typeof window === 'undefined') {
    return mockGalleryData.find(item => item.slug === slug) || null;
  }

  try {
    const res = await fetch(`${API_BASE}/api/gallery/${slug}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error('API error');
    const data = await res.json();
    return data.item || null;
  } catch {
    console.warn('[API] fetchGalleryItemBySlug failed, using mock data');
    return mockGalleryData.find(item => item.slug === slug) || null;
  }
}
