import { z } from 'zod';

import { AppConstants } from '@/common/AppConstants';

export type ForgotPasswordSchemaMessages = {
  emailRequired: string;
  emailInvalid: string;
};

export function createForgotPasswordSchema(messages: ForgotPasswordSchemaMessages) {
  return z.object({
    email: z
      .string()
      .trim()
      .min(1, { message: messages.emailRequired })
      .regex(AppConstants.Validations.Email, { message: messages.emailInvalid }),
  });
}

export type ForgotPasswordForm = z.infer<ReturnType<typeof createForgotPasswordSchema>>;
