import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import { useAuthStore } from '@/stores/auth';
import LayoutCenter from '@/components/layouts/LayoutCenter';
import AppButton from '@/components/ui/AppButton';
import Card from '@/components/ui/Card';
import FieldError from '@/components/ui/FieldError';
import { AppConstants } from '@/common/AppConstants';
import { useLoaderStore } from '@/stores/loader';
import PasswordInput from '@/components/ui/PasswordInput';

const loginSchema = z.object({
  email: z.email(AppConstants.Strings.Errors.InvalidField('Email')),
  password: z
    .string()
    .min(
      AppConstants.Validations.PasswordLength,
      AppConstants.Strings.Errors.MinLength('Password', AppConstants.Validations.PasswordLength),
    ),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const [error, setError] = useState<string>(null);
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const isLoading = useLoaderStore(state => state.isLoading());
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });
  const onSubmit = async (data: LoginForm) => {
    setError(null);

    const success = await login(data.email, data.password);

    if (success) {
      navigate(AppConstants.Routes.Private.Dashboard, { replace: true });
    } else {
      setError(AppConstants.Strings.Errors.InvalidCredentials);
    }
  };

  return (
    <LayoutCenter>
      <Card
        className="w-[40%]"
        radius="sm"
      >
        <Card.Title>Login</Card.Title>
        <Card.Body>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col items-center w-full space-y-4"
            noValidate
          >
            <div className="w-full max-w-sm">
              {/* john@mail.com */}
              <input
                {...register('email')}
                type="email"
                placeholder="Email"
                className="px-3 py-2 border rounded w-full"
              />
              <FieldError msg={errors.email?.message} />
            </div>

            <div className="w-full max-w-sm">
              {/* changeme */}
              <PasswordInput
                name="password"
                register={register}
              />
              <FieldError msg={errors.password?.message} />
            </div>

            <div className="w-full max-w-sm">
              <FieldError msg={error ? AppConstants.Strings.Errors.InvalidCredentials : null} />
            </div>

            <AppButton
              color="primary"
              loading={isLoading}
            >
              Submit
            </AppButton>
          </form>
        </Card.Body>
        <Card.Footer>
          <div className="flex flex-col items-center">
            <Link to={AppConstants.Routes.Public.ForgotPassword}>
              <AppButton
                color="flat"
                className="text-sm"
              >
                Forgot Password?
              </AppButton>
            </Link>
          </div>
        </Card.Footer>
      </Card>
    </LayoutCenter>
  );
}
