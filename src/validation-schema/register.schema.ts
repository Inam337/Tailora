import { z } from 'zod';

import { AppConstants } from '@/common/AppConstants';

export type RegisterSchemaMessages = {
  fullNameRequired: string;
  emailRequired: string;
  emailInvalid: string;
  passwordRequired: string;
  passwordMin: string;
  confirmRequired: string;
  passwordsMismatch: string;
};

export function createRegisterSchema(messages: RegisterSchemaMessages) {
  const minLen = AppConstants.Validations.PasswordLength;

  return z
    .object({
      fullName: z.string().trim().min(1, { message: messages.fullNameRequired }),
      email: z
        .string()
        .trim()
        .min(1, { message: messages.emailRequired })
        .regex(AppConstants.Validations.Email, { message: messages.emailInvalid }),
      password: z
        .string()
        .min(1, { message: messages.passwordRequired })
        .min(minLen, { message: messages.passwordMin.replace('{{min}}', String(minLen)) }),
      confirmPassword: z.string().min(1, { message: messages.confirmRequired }),
    })
    .superRefine((data, ctx) => {
      if (data.password !== data.confirmPassword) {
        ctx.addIssue({
          code: 'custom',
          path: ['confirmPassword'],
          message: messages.passwordsMismatch,
        });
      }
    });
}

export type RegisterForm = z.infer<ReturnType<typeof createRegisterSchema>>;
