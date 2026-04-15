import React from 'react';

interface LayoutCenterProps {
  children: React.ReactNode;
}

export default function LayoutCenter({ children }: LayoutCenterProps) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      {children}
    </div>
  );
}
