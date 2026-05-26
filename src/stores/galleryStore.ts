import { create } from 'zustand';
import type { GalleryItem } from '../types';
import * as galleryApi from '../api/gallery.api';

export interface GalleryStore {
  items: GalleryItem[];
  loading: boolean;
  error: string | null;
  fetchItems: () => Promise<void>;
  uploadItem: (file: File, title: string, description: string, tags: string[]) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
}

export const useGalleryStore = create<GalleryStore>((set, get) => ({
  items: [],
  loading: false,
  error: null,

  fetchItems: async () => {
    set({ loading: true, error: null });
    try {
      const items = await galleryApi.list();
      set({ items, loading: false });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch gallery items';
      set({ error: message, loading: false });
    }
  },

  uploadItem: async (file: File, title: string, description: string, tags: string[]) => {
    set({ error: null });
    try {
      const item = await galleryApi.upload(file, title, description, tags);
      set({ items: [...get().items, item] });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to upload gallery item';
      set({ error: message });
    }
  },

  deleteItem: async (id: string) => {
    set({ error: null });
    try {
      await galleryApi.remove(id);
      set({ items: get().items.filter((item) => item._id !== id) });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to delete gallery item';
      set({ error: message });
    }
  },
}));
