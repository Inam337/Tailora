import { z } from 'zod';

import { AppConstants } from '@/common/AppConstants';
import { CUSTOMER_GENDER_VALUES, type CustomerGender } from '@/models/tailoring';

export type CustomerSchemaMessages = {
  nameMin: string;
  phoneMin: string;
  emailInvalid: string;
};

const emptyToUndefined = (val: unknown) =>
  val === '' || val === null || val === undefined ? undefined : val;

const genderTuple = CUSTOMER_GENDER_VALUES as unknown as [
  CustomerGender,
  CustomerGender,
  ...CustomerGender[],
];

export function createCustomerSchema(messages: CustomerSchemaMessages) {
  const emailRegex = AppConstants.Validations.Email;

  return z.object({
    name: z.string().trim().min(3, { message: messages.nameMin }),
    phone: z.string().trim().min(10, { message: messages.phoneMin }),
    email: z.preprocess(
      emptyToUndefined,
      z
        .string()
        .optional()
        .refine(val => val == null || val === '' || emailRegex.test(val), {
          message: messages.emailInvalid,
        }),
    ),
    address: z.preprocess(
      emptyToUndefined,
      z.string().trim().optional(),
    ),
    gender: z.preprocess(
      emptyToUndefined,
      z.enum(genderTuple).optional(),
    ),
  });
}

export type CustomerFormValues = z.infer<ReturnType<typeof createCustomerSchema>>;
