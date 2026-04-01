import { NextResponse } from 'next/server';
import { mockGalleryData } from '@/lib/data';

/**
 * Endpoint for fetching the list of gallery items.
 * Supports basic pagination via 'page' and 'limit' search params.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    
    // Calculate slice indices
    const start = (page - 1) * limit;
    const end = start + limit;
    
    // Apply pagination
    const paginatedItems = mockGalleryData.slice(start, end);
    
    return NextResponse.json({
      success: true,
      galleryItems: paginatedItems,
      pagination: {
        total: mockGalleryData.length,
        page,
        limit,
        totalPages: Math.ceil(mockGalleryData.length / limit)
      }
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
