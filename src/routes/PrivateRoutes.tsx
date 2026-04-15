import { Navigate, Outlet } from 'react-router-dom';

import { useAuthStore } from '@/stores/auth';
import { AppConstants } from '@/common/AppConstants';
import LayoutPrivate from '@/components/layouts/LayoutPrivate';

export default function PrivateRoutes() {
  const isAuthenticated = useAuthStore(state => state.token != null);

  return isAuthenticated
    ? (
        <LayoutPrivate>
          <Outlet />
        </LayoutPrivate>
      )
    : (
        <Navigate
          to={AppConstants.Routes.Public.Login}
          replace
        />
      );
}
