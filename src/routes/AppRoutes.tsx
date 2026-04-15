import { Routes, Route, Navigate } from 'react-router-dom';

import { AppConstants } from '@/common/AppConstants';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import Profile from '@/pages/Profile';
import ForgotPassword from '@/pages/ForgotPassword';

import PublicRoutes from './PublicRoutes';
import PrivateRoutes from './PrivateRoutes';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicRoutes />}>
        <Route
          path={AppConstants.Routes.Public.Login}
          element={<Login />}
        />
        <Route
          path={AppConstants.Routes.Public.ForgotPassword}
          element={<ForgotPassword />}
        />
        <Route
          path="*"
          element={<Navigate to={AppConstants.Routes.Public.Login} />}
        />
      </Route>

      {/* Private Routes */}
      <Route element={<PrivateRoutes />}>
        <Route
          path={AppConstants.Routes.Private.Dashboard}
          element={<Dashboard />}
        />
        <Route
          path={AppConstants.Routes.Private.Profile}
          element={<Profile />}
        />
        <Route
          path="*"
          element={<Navigate to={AppConstants.Routes.Private.Dashboard} />}
        />
      </Route>
    </Routes>
  );
}
