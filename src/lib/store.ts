import { create } from "zustand";

interface GalleryState {
  activeGalleryId: string | null;
  setActiveGalleryId: (id: string | null) => void;
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
}

export const useStore = create<GalleryState>((set) => ({
  activeGalleryId: null,
  setActiveGalleryId: (id) => set({ activeGalleryId: id }),
  isMenuOpen: false,
  setIsMenuOpen: (isOpen) => set({ isMenuOpen: isOpen }),
}));
