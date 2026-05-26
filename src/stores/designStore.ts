import { create } from 'zustand';
import type { Design, CreateDesignDTO, UpdateDesignDTO } from '../types';
import * as designsApi from '../api/designs.api';

export interface DesignStore {
  designs: Design[];
  loading: boolean;
  error: string | null;
  fetchDesigns: () => Promise<void>;
  createDesign: (data: CreateDesignDTO) => Promise<string | undefined>;
  updateDesign: (id: string, data: UpdateDesignDTO) => Promise<string | undefined>;
  deleteDesign: (id: string) => Promise<void>;
  uploadThumbnail: (id: string, file: File) => Promise<void>;
}

export const useDesignStore = create<DesignStore>((set, get) => ({
  designs: [],
  loading: false,
  error: null,

  fetchDesigns: async () => {
    set({ loading: true, error: null });
    try {
      const designs = await designsApi.list();
      set({ designs, loading: false });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch designs';
      set({ error: message, loading: false });
    }
  },

  createDesign: async (data: CreateDesignDTO) => {
    set({ error: null });
    try {
      const design = await designsApi.create(data);
      set({ designs: [...get().designs, design] });
      return design._id;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to create design';
      set({ error: message });
      return undefined;
    }
  },

  updateDesign: async (id: string, data: UpdateDesignDTO) => {
    set({ error: null });
    try {
      const updated = await designsApi.update(id, data);
      set({
        designs: get().designs.map((d) => (d._id === id ? updated : d)),
      });
      return updated._id;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to update design';
      set({ error: message });
      return undefined;
    }
  },

  deleteDesign: async (id: string) => {
    set({ error: null });
    try {
      await designsApi.remove(id);
      set({ designs: get().designs.filter((d) => d._id !== id) });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to delete design';
      set({ error: message });
    }
  },

  uploadThumbnail: async (id: string, file: File) => {
    set({ error: null });
    try {
      const updated = await designsApi.uploadThumbnail(id, file);
      set({
        designs: get().designs.map((d) => (d._id === id ? updated : d)),
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to upload thumbnail';
      set({ error: message });
    }
  },
}));
