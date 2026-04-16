import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';

import TwoColumnsLayout from '@/components/layouts/TwoColumnsLayout';
import LoginBanner from '@/components/layouts/LoginBanner';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import FieldError from '@/components/ui/FieldError';
import PasswordInput from '@/components/ui/PasswordInput';
import { Image } from '@/components/ui/Image';
import { AppConstants } from '@/common/AppConstants';
import { createRegisterSchema, type RegisterForm } from '@/validation-schema/register.schema';
import Logo from '@/assets/logo/logo.svg';

export default function Register() {
  const { t } = useTranslation('register');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const registerSchema = useMemo(
    () =>
      createRegisterSchema({
        fullNameRequired: t('validation.fullNameRequired'),
        emailRequired: t('validation.emailRequired'),
        emailInvalid: t('validation.emailInvalid'),
        passwordRequired: t('validation.passwordRequired'),
        passwordMin: t('validation.passwordMin'),
        confirmRequired: t('validation.confirmRequired'),
        passwordsMismatch: t('validation.passwordsMismatch'),
      }),
    [t],
  );
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });
  const onSubmit = async (_data: RegisterForm) => {
    setError(null);
    setIsSubmitting(true);

    try {
      await new Promise<void>((resolve) => {
        window.setTimeout(resolve, 600);
      });
      navigate(AppConstants.Routes.Public.Login, { replace: true });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : AppConstants.Strings.Errors.Global;

      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <TwoColumnsLayout leftChildren={<LoginBanner />}>
      <div className="w-full space-y-6">
        <div className="flex flex-col justify-center min-h-[calc(100vh-8rem)]">
          <div className="text-center space-y-2 mb-6">
            <div className="flex w-full justify-center">
              <Image
                src={Logo}
                alt=""
                width={220}
                height={72}
                className="object-contain mx-auto"
                priority
              />
            </div>
            <h1 className="text-2xl font-semibold text-gray-900">{t('title')}</h1>
            <p className="text-sm text-gray-600">{t('subtitle')}</p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 w-full flex flex-col"
            noValidate
          >
            <div className="w-full space-y-2">
              <Label htmlFor="fullName">{t('fields.fullName')}</Label>
              <Input
                id="fullName"
                autoComplete="name"
                placeholder={t('placeholders.fullName')}
                {...register('fullName')}
                aria-invalid={errors.fullName ? 'true' : 'false'}
                disabled={isSubmitting}
              />
              <FieldError msg={errors.fullName?.message} />
            </div>

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

            <div className="w-full space-y-2">
              <Label htmlFor="password">{t('fields.password')}</Label>
              <PasswordInput
                id="password"
                name="password"
                register={register}
                placeholder={t('placeholders.password')}
                disabled={isSubmitting}
              />
              <FieldError msg={errors.password?.message} />
            </div>

            <div className="w-full space-y-2">
              <Label htmlFor="confirmPassword">{t('fields.confirmPassword')}</Label>
              <PasswordInput
                id="confirmPassword"
                name="confirmPassword"
                register={register}
                placeholder={t('placeholders.confirmPassword')}
                disabled={isSubmitting}
              />
              <FieldError msg={errors.confirmPassword?.message} />
            </div>

            {error && <FieldError msg={error} />}

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? t('actions.submitting') : t('actions.submit')}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            <Link
              to={AppConstants.Routes.Public.Login}
              className="text-primary font-medium hover:underline"
            >
              {t('actions.backToLogin')}
            </Link>
          </p>
        </div>
      </div>
    </TwoColumnsLayout>
  );
}
