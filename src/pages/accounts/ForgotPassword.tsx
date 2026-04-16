import { useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';

import TwoColumnsLayout from '@/components/layouts/TwoColumnsLayout';
import LoginBanner from '@/components/layouts/LoginBanner';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import FieldError from '@/components/ui/FieldError';
import { AppConstants } from '@/common/AppConstants';
import {
  createForgotPasswordSchema,
  type ForgotPasswordForm,
} from '@/validation-schema/forgot-password.schema';

export default function ForgotPassword() {
  const { t } = useTranslation('forgotPassword');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const forgotPasswordSchema = useMemo(
    () =>
      createForgotPasswordSchema({
        emailRequired: t('validation.emailRequired'),
        emailInvalid: t('validation.emailInvalid'),
      }),
    [t],
  );
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });
  const onSubmit = async (_data: ForgotPasswordForm) => {
    setError(null);
    setSuccess(false);
    setIsSubmitting(true);

    try {
      await new Promise<void>((resolve) => {
        window.setTimeout(resolve, 900);
      });
      setSuccess(true);
      window.setTimeout(() => {
        navigate(AppConstants.Routes.Public.Login, { replace: true });
      }, 2500);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error
        ? err.message
        : AppConstants.Strings.Errors.Global;

      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <TwoColumnsLayout
      leftChildren={<LoginBanner />}
    >
      <div className="w-full space-y-6">
        <div className="flex flex-col justify-center min-h-[calc(100vh-8rem)]">
          <div className="text-center space-y-2 mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">{t('title')}</h1>
            <p className="text-sm text-gray-600">{t('subtitle')}</p>
          </div>

          {success && (
            <div className="space-y-4 w-full">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">{t('successMessage')}</p>
              </div>
              <p className="text-sm text-gray-600 text-center">{t('redirectMessage')}</p>
            </div>
          )}

          {!success && (
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4 w-full flex flex-col"
              noValidate
            >
              <div className="w-full space-y-2">
                <Label htmlFor="email">{t('fields.email')}</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder={t('placeholders.email')}
                  {...register('email')}
                  aria-invalid={errors.email ? 'true' : 'false'}
                  disabled={isSubmitting}
                />
                <FieldError msg={errors.email?.message} />
              </div>

              {error && <FieldError msg={error} />}

              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? t('actions.sending') : t('actions.sendResetLink')}
              </Button>
            </form>
          )}

          <div className="text-center pt-6">
            <Link
              to={AppConstants.Routes.Public.Login}
              className="text-sm text-primary hover:underline"
            >
              {t('actions.backToLogin')}
            </Link>
          </div>
        </div>
      </div>
    </TwoColumnsLayout>
  );
}
