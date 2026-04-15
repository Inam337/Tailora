import { Navigate, Outlet } from 'react-router-dom';

import { useAuthStore } from '@/stores/auth';
import { AppConstants } from '@/common/AppConstants';

export default function PublicRoutes() {
  const isAuthenticated = useAuthStore(state => state.token != null);

  return isAuthenticated
    ? (
        <Navigate
          to={AppConstants.Routes.Private.Dashboard}
          replace
        />
      )
    : <Outlet />;
}
