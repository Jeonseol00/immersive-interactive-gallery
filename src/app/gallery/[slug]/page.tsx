import { fetchGalleryItemBySlug } from "@/lib/api";
import { notFound } from "next/navigation";
import { GalleryDetailClient } from "./GalleryDetailClient";

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
