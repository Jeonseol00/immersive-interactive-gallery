import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { GalleryItem } from '@/types';

/**
 * GET /api/waterfall
 * Fetches gallery items marked as featured for the homepage waterfall animation.
 * Respects the `waterfall_limit` setting from site_settings.
 */
export async function GET() {
  try {
    const supabase = createServerClient();
    if (!supabase) {
      return NextResponse.json(
        { success: false, error: 'Database not configured' },
        { status: 503 }
      );
    }

    // 1. Get the waterfall limit from site_settings
    const { data: settingsRow } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'waterfall_limit')
      .single();

    const waterfallLimit = settingsRow ? parseInt(settingsRow.value, 10) : 8;

    // 2. Fetch waterfall-featured items
    const { data, error } = await supabase
      .from('gallery_items')
      .select('*')
      .eq('is_featured_waterfall', true)
      .eq('is_published', true)
      .order('sort_order', { ascending: true })
      .limit(waterfallLimit);

    if (error) throw error;

    // 3. Transform to GalleryItem format
    const items: GalleryItem[] = (data || []).map((row) => ({
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
    }));

    return NextResponse.json({
      success: true,
      items,
      limit: waterfallLimit,
      total: items.length,
    });
  } catch (error) {
    console.error('[Waterfall API Error]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch waterfall items' },
      { status: 500 }
    );
  }
}
