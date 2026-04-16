import { Routes, Route, Navigate } from 'react-router-dom';

import { AppConstants } from '@/common/AppConstants';
import Login from '@/pages/accounts/Login';
import Register from '@/pages/accounts/Register';
import ForgotPassword from '@/pages/accounts/ForgotPassword';
import Dashboard from '@/pages/Dashboard';
import Profile from '@/pages/accounts/Profile';
import CustomerList from '@/pages/tailoring/CustomerList';
import CustomerCreate from '@/pages/tailoring/CustomerCreate';
import MeasurementList from '@/pages/tailoring/MeasurementList';
import MeasurementCreate from '@/pages/tailoring/MeasurementCreate';
import OrderList from '@/pages/tailoring/OrderList';
import OrderCreate from '@/pages/tailoring/OrderCreate';
import PaymentList from '@/pages/tailoring/PaymentList';
import PaymentCreate from '@/pages/tailoring/PaymentCreate';

import PublicRoutes from './PublicRoutes';
import PrivateRoutes from './PrivateRoutes';

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicRoutes />}>
        <Route
          path={AppConstants.Routes.Public.Login}
          element={<Login />}
        />
        <Route
          path={AppConstants.Routes.Public.Register}
          element={<Register />}
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
          path={AppConstants.Routes.Private.Customers}
          element={(
            <Navigate
              to={AppConstants.Routes.Private.CustomersList}
              replace
            />
          )}
        />
        <Route
          path={AppConstants.Routes.Private.CustomersList}
          element={<CustomerList />}
        />
        <Route
          path={AppConstants.Routes.Private.CustomersCreate}
          element={<CustomerCreate />}
        />
        <Route
          path={AppConstants.Routes.Private.Measurements}
          element={(
            <Navigate
              to={AppConstants.Routes.Private.MeasurementsList}
              replace
            />
          )}
        />
        <Route
          path={AppConstants.Routes.Private.MeasurementsList}
          element={<MeasurementList />}
        />
        <Route
          path={AppConstants.Routes.Private.MeasurementsCreate}
          element={<MeasurementCreate />}
        />
        <Route
          path={AppConstants.Routes.Private.Orders}
          element={(
            <Navigate
              to={AppConstants.Routes.Private.OrdersList}
              replace
            />
          )}
        />
        <Route
          path={AppConstants.Routes.Private.OrdersList}
          element={<OrderList />}
        />
        <Route
          path={AppConstants.Routes.Private.OrdersCreate}
          element={<OrderCreate />}
        />
        <Route
          path={AppConstants.Routes.Private.Payments}
          element={(
            <Navigate
              to={AppConstants.Routes.Private.PaymentsList}
              replace
            />
          )}
        />
        <Route
          path={AppConstants.Routes.Private.PaymentsList}
          element={<PaymentList />}
        />
        <Route
          path={AppConstants.Routes.Private.PaymentsCreate}
          element={<PaymentCreate />}
        />
        <Route
          path="*"
          element={<Navigate to={AppConstants.Routes.Private.Dashboard} />}
        />
      </Route>
    </Routes>
  );
}
