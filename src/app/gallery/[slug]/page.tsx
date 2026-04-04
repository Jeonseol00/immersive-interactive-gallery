import { fetchGalleryItemBySlug } from "@/lib/api";
import { notFound } from "next/navigation";
import { GalleryDetailClient } from "./GalleryDetailClient";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const item = await fetchGalleryItemBySlug(resolvedParams.slug);
  
  if (!item) return { title: "Karya Tidak Ditemukan" };
  
  return {
    title: item.title,
    description: item.interactions.accordionDescription,
    openGraph: {
      title: `${item.title} | IMGAL Archive`,
      description: item.interactions.accordionDescription,
      images: [{ url: item.images.fullResolution, width: item.images.dimensions.width, height: item.images.dimensions.height }],
    },
    twitter: {
      card: "summary_large_image",
      title: item.title,
      description: item.interactions.accordionDescription,
      images: [item.images.fullResolution],
    }
  };
}

export default async function GalleryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const item = await fetchGalleryItemBySlug(resolvedParams.slug);

  if (!item) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <GalleryDetailClient item={item} />
    </div>
  );
}
