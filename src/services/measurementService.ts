import { useTailoringStore } from '@/stores/tailoringStore';
import type { MeasurementInput } from '@/stores/tailoringStore';
import type { Measurement } from '@/models/tailoring';

export const MeasurementService = {
  getAll: async (): Promise<Measurement[]> => {
    return useTailoringStore.getState().measurements;
  },

  getByCustomerId: async (customerId: string): Promise<Measurement[]> => {
    return useTailoringStore.getState().measurements.filter(m => m.customerId === customerId);
  },

  create: async (data: MeasurementInput): Promise<Measurement> => {
    return useTailoringStore.getState().addMeasurement(data);
  },

  update: async (id: string, data: MeasurementInput): Promise<void> => {
    useTailoringStore.getState().updateMeasurement(id, data);
  },

  remove: async (id: string): Promise<void> => {
    useTailoringStore.getState().removeMeasurement(id);
  },
};
