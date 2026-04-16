import type { IconKey } from '@/components/icons/config/icons.registry';
import { AppConstants } from '@/common/AppConstants';

export type MenuItem = {
  title: string;
  url: string;
  icon?: IconKey;
  iconWidth?: number;
  iconFill?: string;
  items?: MenuItem[];
};

export const menuData = {
  navMain: [
    {
      title: 'menu.dashboard',
      url: AppConstants.Routes.Private.Dashboard,
      icon: 'dashboard',
    },
    {
      title: 'menu.customers',
      url: AppConstants.Routes.Private.Customers,
      icon: 'users',
      items: [
        {
          title: 'menu.customersCreate',
          url: AppConstants.Routes.Private.CustomersCreate,
        },
        {
          title: 'menu.customersList',
          url: AppConstants.Routes.Private.CustomersList,
        },
      ],
    },
    {
      title: 'menu.measurements',
      url: AppConstants.Routes.Private.Measurements,
      icon: 'categories',
      items: [
        {
          title: 'menu.measurementsCreate',
          url: AppConstants.Routes.Private.MeasurementsCreate,
        },
        {
          title: 'menu.measurementsList',
          url: AppConstants.Routes.Private.MeasurementsList,
        },
      ],
    },
    {
      title: 'menu.orders',
      url: AppConstants.Routes.Private.Orders,
      icon: 'openBox',
      items: [
        {
          title: 'menu.ordersCreate',
          url: AppConstants.Routes.Private.OrdersCreate,
        },
        {
          title: 'menu.ordersList',
          url: AppConstants.Routes.Private.OrdersList,
        },
      ],
    },
    {
      title: 'menu.payments',
      url: AppConstants.Routes.Private.Payments,
      icon: 'handDollar',
      items: [
        {
          title: 'menu.paymentsCreate',
          url: AppConstants.Routes.Private.PaymentsCreate,
        },
        {
          title: 'menu.paymentsList',
          url: AppConstants.Routes.Private.PaymentsList,
        },
      ],
    },
  ] satisfies MenuItem[],
};
