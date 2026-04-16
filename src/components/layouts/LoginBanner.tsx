import type { ReactNode } from 'react';

import LoginBannerImage from '@/assets/bg/bg_01.jpg';
import { Image } from '@/components/ui/Image';

interface LoginBannerProps {
  children?: ReactNode;
}

export default function LoginBanner({
  children,
}: LoginBannerProps) {
  return (
    <div className="relative w-full h-full min-h-screen">
      {/* Background Image */}
      <Image
        src={LoginBannerImage}
        alt="Background"
        fill
        priority
        className="object-cover"
      />

      {/* Logo and Content Overlay */}
      <div className="absolute inset-0 z-20 flex flex-col p-8 md:p-12">
        {/* Logo Section - Top Left */}

      </div>

      {/* Additional Children Content */}
      {children && (
        <div className="absolute inset-0 z-30 w-full h-full">
          {children}
        </div>
      )}
    </div>
  );
}
