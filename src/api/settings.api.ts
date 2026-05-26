import client from './client';
import type { Settings, UpdateSettingsDTO } from '../types';

export async function get(): Promise<Settings> {
  const response = await client.get<Settings>('/settings');
  return response.data;
}

export async function update(data: UpdateSettingsDTO): Promise<Settings> {
  const response = await client.put<Settings>('/settings', data);
  return response.data;
}
