import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { GalleryItem } from '@/types';

/**
 * Endpoint for fetching the list of gallery items.
 * Source of Truth: Supabase only — no mock data fallback.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const start = (page - 1) * limit;

    const supabase = createServerClient();
    if (!supabase) {
      return NextResponse.json(
        { success: false, error: 'Database not configured' },
        { status: 503 }
      );
    }

    const { data, error, count } = await supabase
      .from('gallery_items')
      .select('*', { count: 'exact' })
      .eq('is_published', true)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false })
      .range(start, start + limit - 1);

    if (error) throw error;

    // Transform DB rows to GalleryItem format
    const galleryItems: GalleryItem[] = (data || []).map((row) => ({
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
      galleryItems,
      pagination: {
        total: count || galleryItems.length,
        page,
        limit,
        totalPages: Math.ceil((count || galleryItems.length) / limit),
      },
    });
  } catch (error) {
    console.error('[Gallery API Error]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch gallery items' },
      { status: 500 }
    );
  }
}
