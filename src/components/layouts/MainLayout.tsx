import type { ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/Button';
import { RbIcon } from '@/components/icons/common/RbIcon';
import {
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/Sidebar';
import { AppSidebar } from '@/components/layouts/AppSidebar';
import { IconColors } from '@/components/icons/types/RbIcon.types';
import { AppConstants } from '@/common/AppConstants';
import { NetworkStatusBanner } from '@/components/ui/NetworkStatusBanner';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { useAutoSyncWhenOnline } from '@/hooks/useAutoSyncWhenOnline';

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation('common');
  const { t: tDashboard } = useTranslation('dashboard');
  const { t: tTailoring } = useTranslation(AppConstants.Tailoring.I18nNs);

  useNetworkStatus();
  useAutoSyncWhenOnline();

  const isDashboard = location.pathname === AppConstants.Routes.Private.Dashboard;
  const isProfile = location.pathname === AppConstants.Routes.Private.Profile;
  const tailoringTitleKey = (() => {
    const R = AppConstants.Routes.Private;
    const L = AppConstants.Tailoring.Labels;

    switch (location.pathname) {
      case R.CustomersList:
        return L.CustomersPageTitle;
      case R.CustomersCreate:
        return L.CustomersCreatePageTitle;
      case R.MeasurementsList:
        return L.MeasurementsPageTitle;
      case R.MeasurementsCreate:
        return L.MeasurementsCreatePageTitle;
      case R.OrdersList:
        return L.OrdersPageTitle;
      case R.OrdersCreate:
        return L.OrdersCreatePageTitle;
      case R.PaymentsList:
        return L.PaymentsPageTitle;
      case R.PaymentsCreate:
        return L.PaymentsCreatePageTitle;
      default:
        return null;
    }
  })();
  const pageTitle = isDashboard
    ? tDashboard('pageTitle')
    : isProfile
      ? t('pageTitles.profile')
      : tailoringTitleKey
        ? tTailoring(tailoringTitleKey)
        : t('pageTitles.page');

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <NetworkStatusBanner />
        <header
          className="sticky top-0 z-50 flex gap-4 transition-[width,height] ease-linear
          group-has-data-[collapsible=icon]/sidebar-wrapper:h-14
          bg-white border-b border-gray-200 text-foreground px-4 pl-2 lg:px-4"
        >
          <div className="flex items-center gap-4 flex-1">
            {!isDashboard && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(-1)}
                  className="flex items-center gap-2 p-0"
                >
                  <RbIcon
                    name="arrowChevronLeft"
                    size={16}
                    color={IconColors.BLACK_COLOR_ICON}
                  />
                  <span className="text-gray-900">{t('text.back')}</span>
                </Button>
                <div className="h-14 w-px bg-gray-300" />
              </>
            )}
            <div className="w-full h-14 flex items-center justify-start">
              <h2 className="text-lg font-semibold">{pageTitle}</h2>
            </div>
          </div>
        </header>

        <div className="flex flex-col gap-4 bg-white text-foreground min-h-[calc(100vh-3.5rem)]">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
