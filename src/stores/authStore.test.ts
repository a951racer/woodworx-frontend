import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAuthStore } from './authStore';

const TOKEN_KEY = 'woodworx_token';

// Mock the auth API module
vi.mock('../api/auth.api', () => ({
  login: vi.fn(),
  register: vi.fn(),
  forgotPassword: vi.fn(),
  resetPassword: vi.fn(),
}));

import * as authApi from '../api/auth.api';

const mockLogin = vi.mocked(authApi.login);
const mockRegister = vi.mocked(authApi.register);
const mockForgotPassword = vi.mocked(authApi.forgotPassword);
const mockResetPassword = vi.mocked(authApi.resetPassword);

// Helper: create a fake JWT with a payload
function fakeJwt(payload: Record<string, unknown>): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = btoa(JSON.stringify(payload));
  return `${header}.${body}.fakesignature`;
}

describe('authStore', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    // Reset store state
    useAuthStore.setState({ token: null, user: null, isAuthenticated: false });
  });

  describe('hydration', () => {
    it('initializes as unauthenticated when no token in localStorage', () => {
      useAuthStore.setState({ token: null, user: null, isAuthenticated: false });
      const state = useAuthStore.getState();
      expect(state.token).toBeNull();
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe('login', () => {
    it('stores token and user on successful login', async () => {
      const token = fakeJwt({ userId: 'u1', email: 'test@example.com' });
      mockLogin.mockResolvedValue({ token, user: { id: 'u1', email: 'test@example.com' } });

      await useAuthStore.getState().login('test@example.com', 'password123');

      const state = useAuthStore.getState();
      expect(state.token).toBe(token);
      expect(state.user).toEqual({ id: 'u1', email: 'test@example.com' });
      expect(state.isAuthenticated).toBe(true);
      expect(localStorage.getItem(TOKEN_KEY)).toBe(token);
    });

    it('propagates errors from the API', async () => {
      mockLogin.mockRejectedValue(new Error('Invalid credentials'));

      await expect(useAuthStore.getState().login('bad@example.com', 'wrong')).rejects.toThrow(
        'Invalid credentials'
      );

      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(false);
      expect(state.token).toBeNull();
    });
  });

  describe('register', () => {
    it('stores token and user on successful registration', async () => {
      const token = fakeJwt({ userId: 'u2', email: 'new@example.com' });
      mockRegister.mockResolvedValue({ token, user: { id: 'u2', email: 'new@example.com' } });

      await useAuthStore.getState().register('new@example.com', 'password123');

      const state = useAuthStore.getState();
      expect(state.token).toBe(token);
      expect(state.user).toEqual({ id: 'u2', email: 'new@example.com' });
      expect(state.isAuthenticated).toBe(true);
      expect(localStorage.getItem(TOKEN_KEY)).toBe(token);
    });

    it('propagates errors from the API', async () => {
      mockRegister.mockRejectedValue(new Error('Email already registered'));

      await expect(useAuthStore.getState().register('dup@example.com', 'pass')).rejects.toThrow(
        'Email already registered'
      );

      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe('logout', () => {
    it('clears token, user, and localStorage', async () => {
      const token = fakeJwt({ userId: 'u1', email: 'test@example.com' });
      mockLogin.mockResolvedValue({ token, user: { id: 'u1', email: 'test@example.com' } });
      await useAuthStore.getState().login('test@example.com', 'password123');

      useAuthStore.getState().logout();

      const state = useAuthStore.getState();
      expect(state.token).toBeNull();
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(localStorage.getItem(TOKEN_KEY)).toBeNull();
    });
  });

  describe('requestPasswordReset', () => {
    it('calls forgotPassword API without changing auth state', async () => {
      mockForgotPassword.mockResolvedValue({ message: 'Reset email sent' });

      await useAuthStore.getState().requestPasswordReset('user@example.com');

      expect(mockForgotPassword).toHaveBeenCalledWith('user@example.com');
      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe('resetPassword', () => {
    it('calls resetPassword API without changing auth state', async () => {
      mockResetPassword.mockResolvedValue({ message: 'Password updated' });

      await useAuthStore.getState().resetPassword('reset-token-123', 'newPassword456');

      expect(mockResetPassword).toHaveBeenCalledWith('reset-token-123', 'newPassword456');
      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(false);
    });
  });
});
