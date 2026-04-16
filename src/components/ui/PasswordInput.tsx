import { useState } from 'react';
import clsx from 'clsx';

import { HidePasswordIcon } from '@/components/icons/HidePassword.icon';
import { ShowPasswordIcon } from '@/components/icons/ShowPassword.icon';

type PasswordInputProps = {
  name: string;
  id?: string;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  /**
   * Using any to avoid type errors with react-hook-form
   * Can be either:
   * - The register function from react-hook-form
   * - Already registered props (result of register(name, options))
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register?: any;
};

export default function PasswordInput({
  name,
  id,
  className,
  placeholder = 'Password',
  disabled = false,
  error,
  register,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  // If register is a function, call it with name. Otherwise, use it as props.
  const inputProps = register
    ? (typeof register === 'function' ? register(name) : register)
    : {};

  return (
    <div className="space-y-1">
      <div className="relative w-full">
        <input
          {...inputProps}
          id={id || name}
          type={showPassword ? 'text' : 'password'}
          disabled={disabled}
          className={clsx(
            'bg-white border',
            error ? 'border-red-500 focus-visible:ring-red-500' : 'border-gray-200',
            'text-foreground',
            'placeholder:text-muted-foreground',
            error ? 'focus-visible:border-red-500' : 'focus-visible:border-gray-500',
            'focus-visible:shadow-sm focus-visible:outline-none',
            'px-3 py-2 rounded-sm h-9 text-sm shadow-xs',
            'transition-[color,box-shadow] disabled:cursor-not-allowed disabled:opacity-50',
            'w-full',
            className,
          )}
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={() => setShowPassword(state => !state)}
          className={clsx(
            'text-gray-500 hover:text-gray-800',
            'cursor-pointer absolute right-2 top-1/2 transform -translate-y-1/2',
            'bg-transparent border-none outline-none p-1',
            'transition-colors',
          )}
          tabIndex={-1}
        >
          {showPassword
            ? (
                <HidePasswordIcon className="w-5 h-5" />
              )
            : (
                <ShowPasswordIcon className="w-5 h-5" />
              )}
        </button>
      </div>
      {error && (
        <p className="text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}
