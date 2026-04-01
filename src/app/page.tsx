import { fetchGalleryItems } from "@/lib/api";
import { ImmersiveHomepage } from "@/components/sections/ImmersiveHomepage";

export default async function Home() {
  const items = await fetchGalleryItems(1, 10);

  return (
    <main className="w-full min-h-screen bg-black">
      <ImmersiveHomepage items={items} />
    </main>
  );
}
