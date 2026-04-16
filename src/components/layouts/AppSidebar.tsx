import * as React from 'react';
import { useEffect } from 'react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/Sidebar';
import { NavMain } from '@/components/ui/NavMain';
import { NavUser } from '@/components/ui/NavUser';
import { menuData } from '@/common/MenuData';
import { cn } from '@/libs/utils';
import LogoMark from '@/assets/logo/logo.svg';
import { useFilteredMenu } from '@/hooks/useFilteredMenu';
import { useRolePermissionStore } from '@/stores/rolePermissionStore';
import { useAuthStore } from '@/stores/auth';
import { useNetworkStore } from '@/stores/networkStore';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';
  const { token } = useAuthStore();
  const isOnline = useNetworkStore(s => s.isOnline);
  const effectivelyOffline = !isOnline || (typeof navigator !== 'undefined' && !navigator.onLine);
  const {
    fetchUserMenuPermissions,
    isLoadingUserPermissions,
    hasFetchedUserPermissions,
    userMenuPermissions, // Subscribe to changes to ensure filteredMenuItems updates
  } = useRolePermissionStore();

  // Fetch permissions when sidebar loads or when token changes (e.g., after login).
  // When offline, skip so we don't call backend APIs; offline menu is shown by useFilteredMenu.
  useEffect(() => {
    if (!token) return;

    if (!isOnline) return;

    if (!hasFetchedUserPermissions && !isLoadingUserPermissions) {
      fetchUserMenuPermissions();
    }
  }, [token, isOnline, fetchUserMenuPermissions, hasFetchedUserPermissions,
    isLoadingUserPermissions]);
  // Ensure component subscribes to userMenuPermissions changes
  // This is needed even though useFilteredMenu also accesses it, to guarantee re-render
  void userMenuPermissions;

  const filteredMenuItems = useFilteredMenu(menuData.navMain);

  return (
    <Sidebar
      collapsible="icon"
      className="bg-sidebar text-sidebar-foreground"
      {...props}
    >
      <SidebarHeader>
        <div
          className={cn(
            'flex items-center justify-between py-2 border-b border-blue-700',
            isCollapsed ? 'px-2' : 'px-2',
          )}
        >
          <div
            className={cn(
              'flex items-center gap-2 transition-opacity duration-200',
              isCollapsed && 'opacity-0 hidden',
            )}
          >
            {!effectivelyOffline
              ? (
                  <img
                    src={LogoMark}
                    alt="Tailora CRM"
                    className="w-[125px] h-[40px] object-contain"
                  />
                )
              : (
                  <span className="text-white font-semibold text-sm w-[118px]
                   h-8 flex items-center justify-center"
                  >
                    Tailora CRM
                  </span>
                )}
          </div>
          <SidebarTrigger className="text-white hover:opacity-80 transition-opacity" />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={filteredMenuItems} />
      </SidebarContent>
      <SidebarFooter className="border-t border-blue-700">
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
