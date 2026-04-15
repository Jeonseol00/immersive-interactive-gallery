import { fetchGalleryItems, fetchWaterfallItems } from "@/lib/api";
import { ImmersiveHomepage } from "@/components/sections/ImmersiveHomepage";

export default async function Home() {
  const [items, waterfallItems] = await Promise.all([
    fetchGalleryItems(),
    fetchWaterfallItems(),
  ]);

  return (
    <div className="w-full min-h-screen bg-transparent">
      <ImmersiveHomepage items={items} waterfallItems={waterfallItems} />
    </div>
  );
}
