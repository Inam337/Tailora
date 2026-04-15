const Routes = {
  Index: '/',
  Private: {
    Dashboard: '/dashboard',
    Profile: '/profile',
  },
  Public: {
    Login: '/login',
    ForgotPassword: '/forgot-password',
  },
};
const ApiUrls = {
  Login: '/auth/login',
};
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
  ApiUrls,
  Validations,
  Strings,
};
