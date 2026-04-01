// Type Definitions for Immersive Gallery Data Models

export interface ImageDimensions {
  width: number;
  height: number;
  aspectRatio: string;
}

export interface GalleryImage {
  thumbnail: string;
  fullResolution: string;
  altText: string;
  dimensions: ImageDimensions;
  isLCP?: boolean;
}

export interface GalleryInteractions {
  parallaxSpeed: number;
  accordionDescription: string;
}

export interface GalleryMetadata {
  author: string;
  createdAt: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  slug: string;
  images: GalleryImage;
  interactions: GalleryInteractions;
  metadata: GalleryMetadata;
}

export interface GalleryResponse {
  galleryItems: GalleryItem[];
}
