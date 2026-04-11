import { GalleryGridClient } from "./GalleryGridClient";
import { fetchGalleryItems } from "@/lib/api";

export const metadata = {
  title: "Arsip Eksibisi | IMGAL",
  description: "Jelajahi seluruh spektrum mahakarya digital di Galeri Interaktif IMGAL.",
};

export default async function GalleryPage() {
  const items = await fetchGalleryItems();

  return <GalleryGridClient initialItems={items} />;
}
