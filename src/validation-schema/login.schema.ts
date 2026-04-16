import { z } from 'zod';

import { AppConstants } from '@/common/AppConstants';

export type LoginSchemaMessages = {
  emailRequired: string;
  emailInvalid: string;
  passwordRequired: string;
  passwordMin: string;
};

export function createLoginSchema(messages: LoginSchemaMessages) {
  const minLen = AppConstants.Validations.PasswordLength;

  return z.object({
    email: z
      .string()
      .trim()
      .min(1, { message: messages.emailRequired })
      .regex(AppConstants.Validations.Email, { message: messages.emailInvalid }),
    password: z
      .string()
      .min(1, { message: messages.passwordRequired })
      .min(minLen, { message: messages.passwordMin.replace('{{min}}', String(minLen)) }),
  });
}

export type LoginForm = z.infer<ReturnType<typeof createLoginSchema>>;
