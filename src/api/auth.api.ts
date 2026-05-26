import client from './client';
import type { UserInfo } from '../types';

export interface AuthResponse {
  token: string;
  user: UserInfo;
}

export interface MessageResponse {
  message: string;
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const response = await client.post<AuthResponse>('/auth/login', { email, password });
  return response.data;
}

export async function register(email: string, password: string): Promise<AuthResponse> {
  const response = await client.post<AuthResponse>('/auth/register', { email, password });
  return response.data;
}

export async function forgotPassword(email: string): Promise<MessageResponse> {
  const response = await client.post<MessageResponse>('/auth/forgot-password', { email });
  return response.data;
}

export async function resetPassword(token: string, newPassword: string): Promise<MessageResponse> {
  const response = await client.post<MessageResponse>('/auth/reset-password', { token, newPassword });
  return response.data;
}
