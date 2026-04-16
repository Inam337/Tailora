import { useTailoringStore } from '@/stores/tailoringStore';
import type { PaymentInput } from '@/stores/tailoringStore';
import type { Payment } from '@/models/tailoring';

export const PaymentService = {
  getAll: async (): Promise<Payment[]> => {
    return useTailoringStore.getState().payments;
  },

  create: async (data: PaymentInput): Promise<Payment> => {
    return useTailoringStore.getState().addPayment(data);
  },

  update: async (id: string, data: Partial<Pick<Payment, 'amount' | 'paymentMethod'>>): Promise<void> => {
    useTailoringStore.getState().updatePayment(id, data);
  },

  remove: async (id: string): Promise<void> => {
    useTailoringStore.getState().removePayment(id);
  },
};
