import { fetchGalleryItems } from "@/lib/api";
import { ImmersiveHomepage } from "@/components/sections/ImmersiveHomepage";

export default async function Home() {
  const items = await fetchGalleryItems();

  return (
    <div className="w-full min-h-screen bg-transparent">
      <ImmersiveHomepage items={items} />
    </div>
  );
}
