import { AppConstants } from '@/common/AppConstants';
import { apiClient } from '@/libs/axios';
import type { LoginRes } from '@/models';

export const login = async (email: string, password: string): Promise<LoginRes | null> => {
  try {
    const response = await apiClient.post(AppConstants.ApiUrls.Login, {
      email,
      password,
    }, {
      skipAuth: true,
    });

    return response.data;
  } catch {
    const { Email, Password } = AppConstants.DemoAuth;

    if (email.trim() === Email && password === Password) {
      return {
        access_token: 'demo-access-token',
        refresh_token: 'demo-refresh-token',
      };
    }

    return null;
  }
};
