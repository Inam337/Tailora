import * as React from 'react';

import { cn } from '@/libs/utils';

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        data-slot="input"
        className={cn(
          'bg-white border border-gray-200 ',
          'file:text-foreground placeholder:text-muted-foreground',
          'text-foreground',
          'selection:bg-primary selection:text-primary-foreground ',
          'flex w-full min-w-0 ',
          'rounded-sm h-9 px-3 py-2 text-sm shadow-xs ',
          'transition-[color,box-shadow] outline-none file:inline-flex file:h-7 ',
          'file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none',
          'disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          'focus-visible:border-gray-500 ',
          'focus-visible:shadow-sm focus-visible:ring-primary',
          'focus-visible:ring-gray-300 focus-visible:ring-1',
          'aria-invalid:ring-destructive/20 ',
          'aria-invalid:border-destructive',
          className,
        )}
        {...props}
      />
    );
  },
);

Input.displayName = 'Input';

export { Input };
