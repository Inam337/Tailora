import React from 'react';
import clsx from 'clsx';

type StyleLevels = 'sm' | 'md' | 'lg' | 'xl';

interface CardProps {
  children: React.ReactNode;
  radius?: StyleLevels;
  shadow?: StyleLevels;
  className?: string;
}

const shadowClassMap = {
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
  xl: 'shadow-xl',
};
const radiusClassMap = {
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
};

export default function Card({
  children,
  radius = 'sm',
  shadow = 'sm',
  className,
}: CardProps) {
  const radiusClass = radiusClassMap[radius];
  const shadowClass = shadow ? shadowClassMap[shadow] : '';

  return (
    <div className={clsx('bg-light', radiusClass, shadowClass, 'p-[2rem]', className)}>
      {children}
    </div>
  );
}

const Title = ({ children }: { children: React.ReactNode }) => (
  <section className="mb-4">
    <h2 className="text-xl text-center">{children}</h2>
  </section>
);

Title.displayName = 'Card.Title';

const Body = ({ children }: { children: React.ReactNode }) => (
  <section className="py-5">{children}</section>
);

Body.displayName = 'Card.Body';

const Footer = ({ children }: { children: React.ReactNode }) => (
  <footer className="mt-3">{children}</footer>
);

Footer.displayName = 'Card.Footer';

Card.Title = Title;
Card.Body = Body;
Card.Footer = Footer;
