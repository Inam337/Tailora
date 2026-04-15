import React from 'react';
import clsx from 'clsx';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

interface AppButtonProps {
  children: React.ReactNode;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'flat';
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
};

export default function AppButton({
  children,
  color,
  loading,
  disabled,
  className,
  onClick,
}: AppButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={clsx(
        'btn',
        `btn-${color}`,
        className,
      )}
    >
      {
        loading
          ? (
              <ArrowPathIcon className="w-10 h-5 animate-spin" />
            )
          : (
              children
            )
      }
    </button>
  );
}
