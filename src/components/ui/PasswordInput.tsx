import { useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

type PasswordInputProps = {
  name: string;
  className?: string;
  /**
   * Using any to avoid type errors with react-hook-form
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register?: any;
};

export default function PasswordInput({
  name,
  className,
  register,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const inputProps = register ? register(name) : {};

  return (
    <div className="relative w-full">
      <input
        {...inputProps}
        type={showPassword ? 'text' : 'password'}
        className={clsx(
          'px-3 py-2 border rounded w-full',
          className,
        )}
        placeholder="Password"
      />
      <button
        type="button"
        onClick={() => setShowPassword(state => !state)}
        className="
          btn-flat cursor-pointer absolute right-2 top-1/2 transform -translate-y-1/2
        "
        tabIndex={-1}
      >
        {showPassword
          ? (
              <EyeSlashIcon className="w-5 h-5" />
            )
          : (
              <EyeIcon className="w-5 h-5" />
            )}
      </button>
    </div>
  );
}
