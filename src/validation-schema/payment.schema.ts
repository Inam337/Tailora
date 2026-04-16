import { z } from 'zod';

import { AppConstants } from '@/common/AppConstants';

export type PaymentSchemaMessages = {
  orderRequired: string;
  amountInvalid: string;
};

export function createPaymentSchema(messages: PaymentSchemaMessages) {
  return z.object({
    orderId: z.string().min(1, { message: messages.orderRequired }),
    amount: z.preprocess(
      val => {
        if (val === '' || val === null || val === undefined) return NaN;

        return Number(val);
      },
      z
        .number()
        .refine(n => Number.isFinite(n) && !Number.isNaN(n), { message: messages.amountInvalid })
        .positive({ message: messages.amountInvalid }),
    ),
    paymentMethod: z.enum(AppConstants.Tailoring.PaymentMethods),
  });
}

export type PaymentFormValues = z.infer<ReturnType<typeof createPaymentSchema>>;
