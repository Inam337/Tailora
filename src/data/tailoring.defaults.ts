import type { Customer, Measurement, Order, Payment } from '@/models/tailoring';

/** Default JSON-style seed data for the mock tailoring API */
export const defaultCustomers: Customer[] = [
  {
    id: '1',
    name: 'Ali Khan',
    phone: '03001234567',
    email: 'ali@gmail.com',
    address: 'Lahore, Pakistan',
    gender: 'MALE',
  },
  {
    id: '2',
    name: 'Sara Ahmed',
    phone: '03219876543',
    email: 'sara@example.com',
    gender: 'FEMALE',
  },
];

export const defaultMeasurements: Measurement[] = [
  {
    id: 'm1',
    customerId: '1',
    stitchType: 'SHALWAR_KAMEEZ',
    name: 'Wedding SK',
    sections: {
      kameez: {
        kurtaLength: 42,
        chest: 40,
        waist: 36,
        shoulder: 18,
        sleeveLength: 24,
        neck: 15,
        daman: 26,
        shalwarLength: 38,
        thigh: 24,
      },
      shalwar: {
        waist: 32,
        hip: 38,
        thigh: 24,
        rise: 12,
        length: 40,
        bottom: 14,
        knee: 16,
      },
    },
  },
  {
    id: 'm2',
    customerId: '2',
    stitchType: 'WINTER_COAT',
    name: 'Coat fitting',
    simple: {
      chest: 36,
      waist: 32,
      shoulder: 16,
      sleeveLength: 24,
      coatLength: 44,
      backLength: 42,
      lapelWidth: 3.5,
    },
  },
];

export const defaultOrders: Order[] = [
  {
    id: 'o1',
    customerId: '1',
    measurementId: 'm1',
    dressType: 'Shalwar Kameez',
    stitchingCost: 2000,
    embroidery: false,
    totalAmount: 2000,
    status: 'PENDING',
    isUrgent: false,
  },
  {
    id: 'o2',
    customerId: '2',
    measurementId: 'm2',
    dressType: 'Kurta',
    stitchingCost: 1500,
    embroidery: true,
    totalAmount: 1800,
    status: 'IN_PROGRESS',
    deliveryDate: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
  },
];

export const defaultPayments: Payment[] = [
  {
    id: 'p1',
    orderId: 'o2',
    amount: 1000,
    paymentMethod: 'CASH',
    paymentDate: new Date().toISOString(),
  },
];
