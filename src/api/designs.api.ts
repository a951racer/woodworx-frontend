import client from './client';
import type { Design, CreateDesignDTO, UpdateDesignDTO } from '../types';

export async function list(): Promise<Design[]> {
  const response = await client.get<Design[]>('/designs');
  return response.data;
}

export async function getById(id: string): Promise<Design> {
  const response = await client.get<Design>(`/designs/${id}`);
  return response.data;
}

export async function create(data: CreateDesignDTO): Promise<Design> {
  const response = await client.post<Design>('/designs', data);
  return response.data;
}

export async function update(id: string, data: UpdateDesignDTO): Promise<Design> {
  const response = await client.put<Design>(`/designs/${id}`, data);
  return response.data;
}

export async function remove(id: string): Promise<void> {
  await client.delete(`/designs/${id}`);
}

export async function uploadThumbnail(designId: string, file: File): Promise<Design> {
  const formData = new FormData();
  formData.append('thumbnail', file);
  const response = await client.post<Design>(`/designs/${designId}/thumbnail`, formData);
  return response.data;
}

export function getThumbnailUrl(designId: string): string {
  const baseURL = client.defaults.baseURL || '/api';
  const token = localStorage.getItem('woodworx_token');
  const url = `${baseURL}/designs/${designId}/thumbnail`;
  return token ? `${url}?token=${encodeURIComponent(token)}` : url;
}
