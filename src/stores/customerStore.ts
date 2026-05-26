import { create } from 'zustand';
import type { Customer, CreateCustomerDTO, UpdateCustomerDTO } from '../types';
import * as customersApi from '../api/customers.api';

export interface CustomerStore {
  customers: Customer[];
  loading: boolean;
  error: string | null;
  fetchCustomers: () => Promise<void>;
  createCustomer: (data: CreateCustomerDTO) => Promise<void>;
  updateCustomer: (id: string, data: UpdateCustomerDTO) => Promise<void>;
  deleteCustomer: (id: string) => Promise<void>;
}

export const useCustomerStore = create<CustomerStore>((set, get) => ({
  customers: [],
  loading: false,
  error: null,

  fetchCustomers: async () => {
    set({ loading: true, error: null });
    try {
      const customers = await customersApi.list();
      set({ customers, loading: false });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch customers';
      set({ error: message, loading: false });
    }
  },

  createCustomer: async (data: CreateCustomerDTO) => {
    set({ error: null });
    try {
      const customer = await customersApi.create(data);
      set({ customers: [...get().customers, customer] });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to create customer';
      set({ error: message });
    }
  },

  updateCustomer: async (id: string, data: UpdateCustomerDTO) => {
    set({ error: null });
    try {
      const updated = await customersApi.update(id, data);
      set({
        customers: get().customers.map((c) => (c._id === id ? updated : c)),
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to update customer';
      set({ error: message });
    }
  },

  deleteCustomer: async (id: string) => {
    set({ error: null });
    try {
      await customersApi.remove(id);
      set({ customers: get().customers.filter((c) => c._id !== id) });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to delete customer';
      set({ error: message });
    }
  },
}));
