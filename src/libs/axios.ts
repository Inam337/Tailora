import axios from 'axios';

import { useLoaderStore } from '@/stores/loader';
import { useAuthStore } from '@/stores/auth';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    // use skipAuth param to by pass token for public APIs
    if (!config.params?.skipAuth) {
      const token = useAuthStore.getState().token;

      config.headers.Authorization = `Bearer ${token}`;
    }

    useLoaderStore.getState().startLoading();

    return config;
  },
  (error) => {
    useLoaderStore.getState().stopLoading();

    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response) => {
    useLoaderStore.getState().stopLoading();

    return response;
  },
  (error) => {
    useLoaderStore.getState().stopLoading();

    return Promise.reject(error);
  },
);

export const apiClient = axiosInstance;
