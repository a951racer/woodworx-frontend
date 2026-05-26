import client from './client';
import type { Project, CreateProjectDTO, UpdateProjectDTO } from '../types';

export async function list(): Promise<Project[]> {
  const response = await client.get<Project[]>('/projects');
  return response.data;
}

export async function getById(id: string): Promise<Project> {
  const response = await client.get<Project>(`/projects/${id}`);
  return response.data;
}

export async function create(data: CreateProjectDTO): Promise<Project> {
  const response = await client.post<Project>('/projects', data);
  return response.data;
}

export async function update(id: string, data: UpdateProjectDTO): Promise<Project> {
  const response = await client.put<Project>(`/projects/${id}`, data);
  return response.data;
}

export async function remove(id: string): Promise<void> {
  await client.delete(`/projects/${id}`);
}
