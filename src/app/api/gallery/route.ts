import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { mockGalleryData } from '@/lib/data';
import { GalleryItem } from '@/types';

/**
 * Endpoint for fetching the list of gallery items.
 * Primary: Supabase, Fallback: mockGalleryData
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const start = (page - 1) * limit;

    // Try Supabase first
    const supabase = createServerClient();
    if (supabase) {
      const { data, error, count } = await supabase
        .from('gallery_items')
        .select('*', { count: 'exact' })
        .eq('is_published', true)
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false })
        .range(start, start + limit - 1);

      if (!error && data && data.length > 0) {
        // Transform DB rows to GalleryItem format
        const galleryItems: GalleryItem[] = data.map((row) => ({
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
      }
    }

    // Fallback to mock data
    const paginatedItems = mockGalleryData.slice(start, start + limit);
    return NextResponse.json({
      success: true,
      galleryItems: paginatedItems,
      pagination: {
        total: mockGalleryData.length,
        page,
        limit,
        totalPages: Math.ceil(mockGalleryData.length / limit),
      },
    });
  } catch (error) {
    console.error('[Gallery API Error]', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
