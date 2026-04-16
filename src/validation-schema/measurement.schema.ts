import { z } from 'zod';

import { MEASUREMENT_STITCH_TYPES, type MeasurementStitchType } from '@/models/tailoring';

export type MeasurementSchemaMessages = {
  customerRequired: string;
};

const numOrEmpty = z.preprocess(
  (val) => {
    if (val === '' || val === null || val === undefined) {
      return undefined;
    }

    const n = Number(val);

    return Number.isFinite(n) ? n : undefined;
  },
  z.number().optional(),
);
const kameezSectionSchema = z.object({
  kurtaLength: numOrEmpty,
  chest: numOrEmpty,
  waist: numOrEmpty,
  shoulder: numOrEmpty,
  sleeveLength: numOrEmpty,
  neck: numOrEmpty,
  daman: numOrEmpty,
  shalwarLength: numOrEmpty,
  thigh: numOrEmpty,
});
const shalwarSectionSchema = z.object({
  waist: numOrEmpty,
  hip: numOrEmpty,
  thigh: numOrEmpty,
  rise: numOrEmpty,
  length: numOrEmpty,
  bottom: numOrEmpty,
  knee: numOrEmpty,
});
const trouserSectionSchema = z.object({
  waist: numOrEmpty,
  hip: numOrEmpty,
  thigh: numOrEmpty,
  knee: numOrEmpty,
  bottom: numOrEmpty,
  length: numOrEmpty,
  rise: numOrEmpty,
});
const waistcoatSectionSchema = z.object({
  chest: numOrEmpty,
  waist: numOrEmpty,
  shoulder: numOrEmpty,
  length: numOrEmpty,
  armhole: numOrEmpty,
});
const coatSchema = z.object({
  chest: numOrEmpty,
  waist: numOrEmpty,
  shoulder: numOrEmpty,
  sleeveLength: numOrEmpty,
  coatLength: numOrEmpty,
  backLength: numOrEmpty,
  lapelWidth: numOrEmpty,
});
const sectionsSchema = z.object({
  kameez: kameezSectionSchema.optional(),
  shalwar: shalwarSectionSchema.optional(),
  waistcoat: waistcoatSectionSchema.optional(),
  trouser: trouserSectionSchema.optional(),
});
const stitchTuple = MEASUREMENT_STITCH_TYPES as unknown as [
  MeasurementStitchType,
  MeasurementStitchType,
  ...MeasurementStitchType[],
];

export function createMeasurementSchema(messages: MeasurementSchemaMessages) {
  return z.object({
    customerId: z.string().min(1, { message: messages.customerRequired }),
    stitchType: z.enum(stitchTuple),
    name: z.string().trim().optional(),
    sections: sectionsSchema.optional(),
    simple: coatSchema.optional(),
  });
}

export type MeasurementFormValues = z.infer<ReturnType<typeof createMeasurementSchema>>;
