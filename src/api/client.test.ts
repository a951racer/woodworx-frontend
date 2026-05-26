import { describe, it, expect, beforeEach, vi } from 'vitest';
import axios from 'axios';

// We need to test the interceptors in isolation, so we'll re-import the client fresh
// and mock localStorage + window.location

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyHandlers = any;

describe('API Client', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  describe('base configuration', () => {
    it('should use default base URL when env var is not set', async () => {
      const { default: client } = await import('./client');
      expect(client.defaults.baseURL).toBe('http://localhost:5000/api');
    });
  });

  describe('request interceptor', () => {
    it('should attach Authorization header when token exists in localStorage', async () => {
      localStorage.setItem('woodworx_token', 'test-jwt-token');
      const { default: client } = await import('./client');

      const handlers = (client.interceptors.request as AnyHandlers).handlers;
      const config = await handlers[0].fulfilled({
        headers: new axios.AxiosHeaders(),
      });

      expect(config.headers.Authorization).toBe('Bearer test-jwt-token');
    });

    it('should not attach Authorization header when no token in localStorage', async () => {
      const { default: client } = await import('./client');

      const handlers = (client.interceptors.request as AnyHandlers).handlers;
      const config = await handlers[0].fulfilled({
        headers: new axios.AxiosHeaders(),
      });

      expect(config.headers.Authorization).toBeUndefined();
    });
  });

  describe('response interceptor', () => {
    it('should pass through successful responses', async () => {
      const { default: client } = await import('./client');
      const mockResponse = { status: 200, data: { ok: true } };

      const handlers = (client.interceptors.response as AnyHandlers).handlers;
      const result = handlers[0].fulfilled(mockResponse);
      expect(result).toBe(mockResponse);
    });

    it('should clear token and redirect on 401 response', async () => {
      localStorage.setItem('woodworx_token', 'expired-token');

      // Mock window.location.href
      const hrefSetter = vi.fn();
      Object.defineProperty(window, 'location', {
        value: { ...window.location, href: '' },
        writable: true,
        configurable: true,
      });
      Object.defineProperty(window.location, 'href', {
        set: hrefSetter,
        get: () => '',
        configurable: true,
      });

      const { default: client } = await import('./client');

      const error = { response: { status: 401 } };
      const handlers = (client.interceptors.response as AnyHandlers).handlers;
      const rejectedHandler = handlers[0].rejected;

      await expect(rejectedHandler(error)).rejects.toEqual(error);
      expect(localStorage.getItem('woodworx_token')).toBeNull();
      expect(hrefSetter).toHaveBeenCalledWith('/login');
    });

    it('should reject non-401 errors without clearing token', async () => {
      localStorage.setItem('woodworx_token', 'valid-token');
      const { default: client } = await import('./client');

      const error = { response: { status: 500 } };
      const handlers = (client.interceptors.response as AnyHandlers).handlers;
      const rejectedHandler = handlers[0].rejected;

      await expect(rejectedHandler(error)).rejects.toEqual(error);
      expect(localStorage.getItem('woodworx_token')).toBe('valid-token');
    });
  });
});
