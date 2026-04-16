const Routes = {
  Index: '/',
  Private: {
    Dashboard: '/dashboard',
    Profile: '/profile',
    Customers: '/customers',
    CustomersList: '/customers/list',
    CustomersCreate: '/customers/create',
    Measurements: '/measurements',
    MeasurementsList: '/measurements/list',
    MeasurementsCreate: '/measurements/create',
    Orders: '/orders',
    OrdersList: '/orders/list',
    OrdersCreate: '/orders/create',
    Payments: '/payments',
    PaymentsList: '/payments/list',
    PaymentsCreate: '/payments/create',
  },
  Public: {
    Login: '/login',
    Register: '/register',
    ForgotPassword: '/forgot-password',
  },
} as const;
const Tailoring = {
  PaymentMethods: ['CASH', 'CARD', 'JAZZCASH', 'EASYPAISA'] as const,
  OrderStatuses: ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'DELIVERED'] as const,
  I18nNs: 'tailoring',
  /** i18next keys under the `tailoring` namespace for page titles */
  Labels: {
    CustomersPageTitle: 'customers.pageTitle',
    CustomersCreatePageTitle: 'customers.formTitle',
    MeasurementsPageTitle: 'measurements.pageTitle',
    MeasurementsCreatePageTitle: 'measurements.formTitle',
    OrdersPageTitle: 'orders.pageTitle',
    OrdersCreatePageTitle: 'orders.formTitle',
    PaymentsPageTitle: 'payments.pageTitle',
    PaymentsCreatePageTitle: 'payments.formTitle',
  },
} as const;
const ApiUrls = {
  Login: '/auth/login',
};
/** Pre-filled login (see Login page) and accepted by `login` when the API is unreachable. */
const DemoAuth = {
  Email: 'admin@sys.com',
  Password: 'Admin@123',
} as const;
const Validations = {
  Email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PasswordLength: 6,
};
const Strings = {
  Errors: {
    InvalidField: (field: string) => `${field} is invalid`,
    MinLength: (field: string, min: number) => `${field} must be at least ${min} characters`,
    InvalidCredentials: 'Invalid email or password',
    Global: 'Something went wrong, please try again later',
    FieldRequired: 'This field is required',
  },
};

export const AppConstants = {
  Routes,
  Tailoring,
  ApiUrls,
  DemoAuth,
  Validations,
  Strings,
};
