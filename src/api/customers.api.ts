import client from './client';
import type { Customer, CreateCustomerDTO, UpdateCustomerDTO } from '../types';

export async function list(): Promise<Customer[]> {
  const response = await client.get<Customer[]>('/customers');
  return response.data;
}

export async function getById(id: string): Promise<Customer> {
  const response = await client.get<Customer>(`/customers/${id}`);
  return response.data;
}

export async function create(data: CreateCustomerDTO): Promise<Customer> {
  const response = await client.post<Customer>('/customers', data);
  return response.data;
}

export async function update(id: string, data: UpdateCustomerDTO): Promise<Customer> {
  const response = await client.put<Customer>(`/customers/${id}`, data);
  return response.data;
}

export async function remove(id: string): Promise<void> {
  await client.delete(`/customers/${id}`);
}
