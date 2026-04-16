import type { ReactNode } from 'react';

import { cn } from '@/libs/utils';
import { useSidebar } from '@/components/ui/Sidebar';

export function TailoringListShell({ children }: { children: ReactNode }) {
  const { state } = useSidebar();
  const isSidebarExpanded = state === 'expanded';

  return (
    <div
      className="p-0 rounded-none flex flex-col h-[calc(100vh-240px)] overflow-hidden
      max-w-full min-w-0"
    >
      <div className="flex flex-col h-full max-w-full min-w-0">
        <div
          className={cn(
            'flex-1 min-h-0 overflow-y-auto overflow-x-auto',
            'lg:overflow-x-hidden max-w-full min-w-0',
            isSidebarExpanded
              ? 'lg:max-w-[calc(100vw-338px)]'
              : 'lg:max-w-[calc(100vw-85px)]',
          )}
        >
          <div className="w-full max-w-full min-w-0">{children}</div>
        </div>
      </div>
    </div>
  );
}
