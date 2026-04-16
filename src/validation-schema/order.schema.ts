import { z } from 'zod';

export type OrderSchemaMessages = {
  customerRequired: string;
  dressTypeRequired: string;
  stitchingInvalid: string;
};

const optionalString = z.preprocess(
  val => (val === '' || val === null || val === undefined ? undefined : String(val).trim()),
  z.string().optional(),
);

const optionalId = z.preprocess(
  val => (val === '' || val === null || val === undefined ? undefined : String(val)),
  z.string().optional(),
);

export function createOrderSchema(messages: OrderSchemaMessages) {
  return z.object({
    customerId: z.string().min(1, { message: messages.customerRequired }),
    measurementId: optionalId,
    dressType: z.string().trim().min(1, { message: messages.dressTypeRequired }),
    stitchingCost: z.preprocess(
      val => {
        if (val === '' || val === null || val === undefined) return NaN;

        return Number(val);
      },
      z
        .number()
        .refine(n => Number.isFinite(n) && !Number.isNaN(n), { message: messages.stitchingInvalid })
        .min(0, { message: messages.stitchingInvalid }),
    ),
    embroidery: z.boolean().optional(),
    pocketStyle: optionalString,
    buttonType: optionalString,
    deliveryDate: optionalString,
    isUrgent: z.boolean().optional(),
  });
}

export type OrderFormValues = z.infer<ReturnType<typeof createOrderSchema>>;
