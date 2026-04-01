import { NextResponse } from 'next/server';
import { mockGalleryData } from '@/lib/data';

/**
 * Endpoint for fetching a specific gallery item by its slug.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    // Await params object as required by Next.js 15+ App Router
    const slug = (await params).slug;
    
    const item = mockGalleryData.find((g) => g.slug === slug);
    
    if (!item) {
      return NextResponse.json(
        { success: false, error: 'Item not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      item
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
