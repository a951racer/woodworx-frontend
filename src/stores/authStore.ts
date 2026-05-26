import { create } from 'zustand';
import type { UserInfo } from '../types';
import * as authApi from '../api/auth.api';

const TOKEN_KEY = 'woodworx_token';

export interface AuthStore {
  token: string | null;
  user: UserInfo | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  requestPasswordReset: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
}

function parseToken(token: string): UserInfo | null {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return { id: payload.userId ?? payload.sub ?? '', email: payload.email ?? '' };
  } catch {
    return null;
  }
}

function hydrateFromStorage(): { token: string | null; user: UserInfo | null; isAuthenticated: boolean } {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    const user = parseToken(token);
    return { token, user, isAuthenticated: true };
  }
  return { token: null, user: null, isAuthenticated: false };
}

export const useAuthStore = create<AuthStore>((set) => ({
  ...hydrateFromStorage(),

  login: async (email: string, password: string) => {
    const response = await authApi.login(email, password);
    localStorage.setItem(TOKEN_KEY, response.token);
    set({ token: response.token, user: response.user, isAuthenticated: true });
  },

  register: async (email: string, password: string) => {
    const response = await authApi.register(email, password);
    localStorage.setItem(TOKEN_KEY, response.token);
    set({ token: response.token, user: response.user, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    set({ token: null, user: null, isAuthenticated: false });
  },

  requestPasswordReset: async (email: string) => {
    await authApi.forgotPassword(email);
  },

  resetPassword: async (token: string, newPassword: string) => {
    await authApi.resetPassword(token, newPassword);
  },
}));
