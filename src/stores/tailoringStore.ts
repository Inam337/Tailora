import { create } from 'zustand';

import {
  defaultCustomers,
  defaultMeasurements,
  defaultOrders,
  defaultPayments,
} from '@/data/tailoring.defaults';
import { generateEntityId } from '@/common/AppUtils';
import type {
  CoatMeasures,
  Customer,
  CustomerGender,
  Measurement,
  MeasurementGarmentSections,
  MeasurementStitchType,
  Order,
  OrderStatus,
  Payment,
  PaymentMethod,
} from '@/models/tailoring';

function cloneSeed() {
  return {
    customers: structuredClone(defaultCustomers),
    measurements: structuredClone(defaultMeasurements),
    orders: structuredClone(defaultOrders),
    payments: structuredClone(defaultPayments),
  };
}

export interface CustomerInput {
  name: string;
  phone: string;
  email?: string;
  address?: string;
  gender?: CustomerGender;
}

export interface MeasurementInput {
  customerId: string;
  stitchType: MeasurementStitchType;
  name?: string;
  sections?: MeasurementGarmentSections;
  simple?: CoatMeasures;
}

export interface OrderInput {
  customerId: string;
  measurementId?: string;
  dressType: string;
  stitchingCost: number;
  embroidery?: boolean;
  pocketStyle?: string;
  buttonType?: string;
  deliveryDate?: string;
  isUrgent?: boolean;
}

export interface PaymentInput {
  orderId: string;
  amount: number;
  paymentMethod: PaymentMethod;
}

interface TailoringState {
  customers: Customer[];
  measurements: Measurement[];
  orders: Order[];
  payments: Payment[];
  resetToDefaults: () => void;
  addCustomer: (data: CustomerInput) => Customer;
  updateCustomer: (id: string, data: CustomerInput) => void;
  removeCustomer: (id: string) => void;
  addMeasurement: (data: MeasurementInput) => Measurement;
  updateMeasurement: (id: string, data: MeasurementInput) => void;
  removeMeasurement: (id: string) => void;
  addOrder: (data: OrderInput) => Order;
  updateOrder: (
    orderId: string,
    patch: Partial<Pick<Order, 'customerId' | 'measurementId' | 'dressType' | 'stitchingCost' | 'embroidery' | 'pocketStyle' | 'buttonType' | 'deliveryDate' | 'isUrgent' | 'status'>>,
  ) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  removeOrder: (orderId: string) => void;
  addPayment: (data: PaymentInput) => Payment;
  updatePayment: (id: string, patch: Partial<Pick<Payment, 'amount' | 'paymentMethod'>>) => void;
  removePayment: (id: string) => void;
}

export const useTailoringStore = create<TailoringState>(set => ({
  ...cloneSeed(),

  resetToDefaults: () => {
    set(cloneSeed());
  },

  addCustomer: (data: CustomerInput) => {
    const customer: Customer = {
      id: generateEntityId('c'),
      ...data,
    };

    set(state => ({ customers: [...state.customers, customer] }));

    return customer;
  },

  updateCustomer: (id, data) => {
    set(state => ({
      customers: state.customers.map(c =>
        c.id === id ? { ...c, ...data } : c,
      ),
    }));
  },

  removeCustomer: (id) => {
    set(state => {
      const orderIds = state.orders.filter(o => o.customerId === id).map(o => o.id);

      return {
        customers: state.customers.filter(c => c.id !== id),
        measurements: state.measurements.filter(m => m.customerId !== id),
        orders: state.orders.filter(o => o.customerId !== id),
        payments: state.payments.filter(p => !orderIds.includes(p.orderId)),
      };
    });
  },

  addMeasurement: (data: MeasurementInput) => {
    const measurement: Measurement = {
      id: generateEntityId('m'),
      ...data,
    };

    set(state => ({ measurements: [...state.measurements, measurement] }));

    return measurement;
  },

  updateMeasurement: (id, data) => {
    set(state => ({
      measurements: state.measurements.map(m =>
        m.id === id ? { ...m, ...data } : m,
      ),
    }));
  },

  removeMeasurement: (id) => {
    set(state => ({
      measurements: state.measurements.filter(m => m.id !== id),
      orders: state.orders.map(o =>
        o.measurementId === id ? { ...o, measurementId: undefined } : o,
      ),
    }));
  },

  addOrder: (data: OrderInput) => {
    const extras = data.embroidery ? 300 : 0;
    const totalAmount = data.stitchingCost + extras;
    const order: Order = {
      id: generateEntityId('o'),
      ...data,
      status: 'PENDING',
      totalAmount,
    };

    set(state => ({ orders: [...state.orders, order] }));

    return order;
  },

  updateOrder: (orderId, patch) => {
    set(state => ({
      orders: state.orders.map((o) => {
        if (o.id !== orderId) return o;
        const next: Order = { ...o, ...patch };
        const extras = next.embroidery ? 300 : 0;

        next.totalAmount = next.stitchingCost + extras;

        return next;
      }),
    }));
  },

  updateOrderStatus: (orderId: string, status: OrderStatus) => {
    set(state => ({
      orders: state.orders.map(o =>
        o.id === orderId ? { ...o, status } : o,
      ),
    }));
  },

  removeOrder: (orderId) => {
    set(state => ({
      orders: state.orders.filter(o => o.id !== orderId),
      payments: state.payments.filter(p => p.orderId !== orderId),
    }));
  },

  addPayment: (data: PaymentInput) => {
    const payment: Payment = {
      id: generateEntityId('p'),
      paymentDate: new Date().toISOString(),
      ...data,
    };

    set(state => ({ payments: [...state.payments, payment] }));

    return payment;
  },

  updatePayment: (id, patch) => {
    set(state => ({
      payments: state.payments.map(p =>
        p.id === id ? { ...p, ...patch } : p,
      ),
    }));
  },

  removePayment: (id) => {
    set(state => ({
      payments: state.payments.filter(p => p.id !== id),
    }));
  },
}));
