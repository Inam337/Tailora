import clsx from 'clsx';

interface FieldErrorProps {
  msg: string;
  className?: string;
}

export default function FieldError({ msg, className }: FieldErrorProps) {
  return (
    msg && (
      <p className={clsx('text-danger text-xs', className)}>
        {msg}
      </p>
    )
  );
}
