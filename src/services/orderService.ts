import { useTailoringStore } from '@/stores/tailoringStore';
import type { OrderInput } from '@/stores/tailoringStore';
import type { Order, OrderStatus } from '@/models/tailoring';

type OrderUpdateFields = Partial<
  Pick<Order, 'customerId' | 'measurementId' | 'dressType' | 'stitchingCost' | 'embroidery' | 'pocketStyle' | 'buttonType' | 'deliveryDate' | 'isUrgent'>
>;

export const OrderService = {
  getAll: async (): Promise<Order[]> => {
    return useTailoringStore.getState().orders;
  },

  create: async (data: OrderInput): Promise<Order> => {
    return useTailoringStore.getState().addOrder(data);
  },

  updateStatus: async (orderId: string, status: OrderStatus): Promise<void> => {
    useTailoringStore.getState().updateOrderStatus(orderId, status);
  },

  update: async (orderId: string, data: OrderUpdateFields): Promise<void> => {
    useTailoringStore.getState().updateOrder(orderId, data);
  },

  remove: async (orderId: string): Promise<void> => {
    useTailoringStore.getState().removeOrder(orderId);
  },
};
