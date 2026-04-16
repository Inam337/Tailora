import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { Avatar, AvatarFallback } from '@/components/ui/Avatar';
import { useSidebar } from '@/components/ui/Sidebar';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/Sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import { useAuthStore } from '@/stores/auth';
import { useRolePermissionStore } from '@/stores/rolePermissionStore';
import { AppConstants } from '@/common/AppConstants';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/libs/utils';
import { RbIcon } from '@/components/icons/common/RbIcon';
import { IconColors } from '@/components/icons/types/RbIcon.types';

export function NavUser() {
  const { t } = useTranslation('common');
  const { state, isMobile } = useSidebar();
  const { logout, userEmail } = useAuthStore();
  const { resetUserPermissionsFetch } = useRolePermissionStore();
  const navigate = useNavigate();
  const isMobileDevice = useIsMobile();
  const isCollapsed = state === 'collapsed';
  const ICON_SIZE = 16;

  const initials = (userEmail || 'U').slice(0, 2).toUpperCase();

  const handleLogout = async () => {
    await logout();
    resetUserPermissionsFetch();
    navigate(AppConstants.Routes.Public.Login);
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              tooltip={isCollapsed ? (userEmail || '…') : undefined}
              size="lg"
              className={cn(
                'w-full data-[state=open]:bg-sidebar-accent',
                'data-[state=open]:text-sidebar-accent-foreground',
                isCollapsed && 'justify-center',
              )}
            >
              <Avatar className={cn('h-9 w-9 rounded-full overflow-hidden border border-gray-100', isCollapsed && 'mx-auto')}>
                <AvatarFallback className="bg-blue-600 text-white text-xs font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              {!isCollapsed && (
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-normal text-white">{userEmail || '…'}</span>
                </div>
              )}
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile || isMobileDevice ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-blue-600 text-white text-xs font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-sm leading-tight">
                  <span className="truncate font-semibold">{userEmail || '…'}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-gray-200" />

            <DropdownMenuItem onClick={() => navigate(AppConstants.Routes.Private.Profile)}>
              <RbIcon
                name="settings"
                size={ICON_SIZE}
                color={IconColors.GRAY_COLOR_ICON}
              />
              <span>{t('nav.settings')}</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              variant="destructive"
            >
              <RbIcon
                name="logout"
                size={ICON_SIZE}
                color={IconColors.GRAY_COLOR_ICON}
              />
              <span>{t('nav.logout')}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
