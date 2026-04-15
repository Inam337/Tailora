import { AppConstants } from '@/common/AppConstants';
import { apiClient } from '@/libs/axios';
import type { LoginRes } from '@/models';

export const login = async (email: string, password: string): Promise<LoginRes> => {
  try {
    const response = await apiClient.post(AppConstants.ApiUrls.Login, {
      email,
      password,
    }, {
      skipAuth: true,
    });

    return response.data;
  } catch (error) {
    return null;
  }
};
