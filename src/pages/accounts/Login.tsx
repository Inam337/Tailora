import { useEffect, useMemo, useRef, useState } from 'react';
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
import PasswordInput from '@/components/ui/PasswordInput';
import { Image } from '@/components/ui/Image';
import { useAuthStore } from '@/stores/auth';
import { AppConstants } from '@/common/AppConstants';
import { createLoginSchema, type LoginForm } from '@/validation-schema/login.schema';
import Logo from '@/assets/logo/logo.svg';

export default function Login() {
  const { t } = useTranslation('login');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const emailInputRef = useRef<HTMLInputElement>(null);
  const loginSchema = useMemo(
    () =>
      createLoginSchema({
        emailRequired: t('validation.emailRequired'),
        emailInvalid: t('validation.emailInvalid'),
        passwordRequired: t('validation.passwordRequired'),
        passwordMin: t('validation.passwordMin'),
      }),
    [t],
  );
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: AppConstants.DemoAuth.Email,
      password: AppConstants.DemoAuth.Password,
    },
  });

  useEffect(() => {
    const timer = window.setTimeout(() => {
      emailInputRef.current?.focus();
    }, 50);

    return () => window.clearTimeout(timer);
  }, []);

  const { ref: registerRef, ...registerEmail } = register('email');
  const onSubmit = async (data: LoginForm) => {
    setError(null);
    setIsLoading(true);

    try {
      const success = await login(data.email, data.password);

      if (success) {
        navigate(AppConstants.Routes.Private.Dashboard, { replace: true });
      } else {
        setError(AppConstants.Strings.Errors.InvalidCredentials);
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error
        ? err.message
        : AppConstants.Strings.Errors.InvalidCredentials;

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TwoColumnsLayout
      leftChildren={<LoginBanner />}
    >
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
            <p className="text-sm text-gray-600">{t('subtitle')}</p>
          </div>

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
                className="focus:ring-0 focus:border-gray-500"
                ref={(el) => {
                  registerRef(el);
                  emailInputRef.current = el;
                }}
                {...registerEmail}
                aria-invalid={errors.email ? 'true' : 'false'}
                disabled={isLoading}
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
                disabled={isLoading}
              />
              <FieldError msg={errors.password?.message} />
            </div>

            <div className="flex justify-end">
              <Link
                to={AppConstants.Routes.Public.ForgotPassword}
                className="text-sm text-primary hover:underline"
              >
                {t('actions.forgotPassword')}
              </Link>
            </div>

            {error && <FieldError msg={error} />}

            <Button
              type="submit"
              variant="default"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? t('actions.loggingIn') : t('actions.login')}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            {t('footer.noAccount')}
            {' '}
            <Link
              to={AppConstants.Routes.Public.Register}
              className="text-primary font-medium hover:underline"
            >
              {t('actions.register')}
            </Link>
          </p>
        </div>
      </div>
    </TwoColumnsLayout>
  );
}
