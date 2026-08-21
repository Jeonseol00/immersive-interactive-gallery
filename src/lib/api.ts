import { unstable_cache } from 'next/cache';
import { createServerClient } from '@/lib/supabase/server';
import { GalleryItem } from '@/types';

/**
 * Helper to map DB row to GalleryItem
 */
interface GalleryItemRow {
  id: string;
  title: string;
  category: string;
  slug: string;
  thumbnail_url: string | null;
  image_url: string;
  alt_text: string | null;
  width: number;
  height: number;
  aspect_ratio: string;
  parallax_speed: number | null;
  description: string | null;
  author: string | null;
  created_at: string;
}

function mapToGalleryItem(row: GalleryItemRow): GalleryItem {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    slug: row.slug,
    images: {
      thumbnail: row.thumbnail_url || row.image_url,
      fullResolution: row.image_url,
      altText: row.alt_text || row.title,
      dimensions: {
        width: row.width,
        height: row.height,
        aspectRatio: row.aspect_ratio,
      },
      isLCP: false,
    },
    interactions: {
      parallaxSpeed: row.parallax_speed || 0.2,
      accordionDescription: row.description || '',
    },
    metadata: {
      author: row.author || 'Artelab',
      createdAt: row.created_at,
    },
  };
}

/**
 * Fetch gallery items from Supabase via direct DB call.
 * Source of Truth: Database only — no mock data fallback.
 */
export const fetchGalleryItems = unstable_cache(
  async (): Promise<GalleryItem[]> => {
    try {
      const supabase = createServerClient();
      if (!supabase) return [];

      const { data, error } = await supabase
        .from('gallery_items')
        .select('*')
        .eq('is_published', true)
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return (data || []).map(mapToGalleryItem);
    } catch (err) {
      console.warn('[API] fetchGalleryItems failed:', err);
      return [];
    }
  },
  ['gallery-items'],
  { revalidate: 60 }
);

/**
 * Fetch a single gallery item by slug.
 */
export const fetchGalleryItemBySlug = unstable_cache(
  async (slug: string): Promise<GalleryItem | null> => {
    try {
      const supabase = createServerClient();
      if (!supabase) return null;

      const { data, error } = await supabase
        .from('gallery_items')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .single();

      if (error || !data) return null;
      return mapToGalleryItem(data);
    } catch (err) {
      console.warn('[API] fetchGalleryItemBySlug failed:', err);
      return null;
    }
  },
  ['gallery-item-by-slug'],
  { revalidate: 60 }
);

/**
 * Fetch waterfall-featured items for the homepage.
 */
export const fetchWaterfallItems = unstable_cache(
  async (): Promise<GalleryItem[]> => {
    try {
      const supabase = createServerClient();
      if (!supabase) return [];

      const { data: settingsRow } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'waterfall_limit')
        .single();

      const waterfallLimit = settingsRow ? parseInt(settingsRow.value, 10) : 8;

      const { data, error } = await supabase
        .from('gallery_items')
        .select('*')
        .eq('is_featured_waterfall', true)
        .eq('is_published', true)
        .order('sort_order', { ascending: true })
        .limit(waterfallLimit);

      if (error) throw error;
      return (data || []).map(mapToGalleryItem);
    } catch (err) {
      console.warn('[API] fetchWaterfallItems failed:', err);
      return [];
    }
  },
  ['waterfall-items'],
  { revalidate: 60 }
);
