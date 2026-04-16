import { useTailoringStore } from '@/stores/tailoringStore';
import type { CustomerInput } from '@/stores/tailoringStore';
import type { Customer } from '@/models/tailoring';

export const CustomerService = {
  getAll: async (): Promise<Customer[]> => {
    return useTailoringStore.getState().customers;
  },

  create: async (data: CustomerInput): Promise<Customer> => {
    return useTailoringStore.getState().addCustomer(data);
  },

  update: async (id: string, data: CustomerInput): Promise<void> => {
    useTailoringStore.getState().updateCustomer(id, data);
  },

  remove: async (id: string): Promise<void> => {
    useTailoringStore.getState().removeCustomer(id);
  },
};
