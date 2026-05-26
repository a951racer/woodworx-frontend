import { create } from 'zustand';
import type { Project, CreateProjectDTO, UpdateProjectDTO } from '../types';
import * as projectsApi from '../api/projects.api';

export interface ProjectStore {
  projects: Project[];
  loading: boolean;
  error: string | null;
  fetchProjects: () => Promise<void>;
  createProject: (data: CreateProjectDTO) => Promise<void>;
  updateProject: (id: string, data: UpdateProjectDTO) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
}

export const useProjectStore = create<ProjectStore>((set, get) => ({
  projects: [],
  loading: false,
  error: null,

  fetchProjects: async () => {
    set({ loading: true, error: null });
    try {
      const projects = await projectsApi.list();
      set({ projects, loading: false });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch projects';
      set({ error: message, loading: false });
    }
  },

  createProject: async (data: CreateProjectDTO) => {
    set({ error: null });
    try {
      const project = await projectsApi.create(data);
      set({ projects: [...get().projects, project] });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to create project';
      set({ error: message });
    }
  },

  updateProject: async (id: string, data: UpdateProjectDTO) => {
    set({ error: null });
    try {
      const updated = await projectsApi.update(id, data);
      set({
        projects: get().projects.map((p) => (p._id === id ? updated : p)),
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to update project';
      set({ error: message });
    }
  },

  deleteProject: async (id: string) => {
    set({ error: null });
    try {
      await projectsApi.remove(id);
      set({ projects: get().projects.filter((p) => p._id !== id) });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to delete project';
      set({ error: message });
    }
  },
}));
