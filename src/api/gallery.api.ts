import client from './client';
import type { GalleryItem } from '../types';

export async function list(): Promise<GalleryItem[]> {
  const response = await client.get<GalleryItem[]>('/gallery');
  return response.data;
}

export async function getById(id: string): Promise<GalleryItem> {
  const response = await client.get<GalleryItem>(`/gallery/${id}`);
  return response.data;
}

export async function upload(
  file: File,
  title: string,
  description: string,
  tags: string[]
): Promise<GalleryItem> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('title', title);
  formData.append('description', description);
  formData.append('tags', JSON.stringify(tags));

  const response = await client.post<GalleryItem>('/gallery', formData);
  return response.data;
}

export async function remove(id: string): Promise<void> {
  await client.delete(`/gallery/${id}`);
}

export async function update(
  id: string,
  file: File | null,
  title: string,
  description: string,
  tags: string[]
): Promise<GalleryItem> {
  const formData = new FormData();
  if (file) formData.append('file', file);
  formData.append('title', title);
  formData.append('description', description);
  formData.append('tags', JSON.stringify(tags));

  const response = await client.put<GalleryItem>(`/gallery/${id}`, formData);
  return response.data;
}

export function getGalleryFileUrl(galleryItemId: string): string {
  const baseURL = client.defaults.baseURL || '/api';
  const token = localStorage.getItem('woodworx_token');
  const url = `${baseURL}/gallery/${galleryItemId}/file`;
  return token ? `${url}?token=${encodeURIComponent(token)}` : url;
}
