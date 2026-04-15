import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { login } from '@/services/auth';

interface AuthState {
  token: string;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const initialState = {
  token: null,
};

export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      ...initialState,
      login: async (email: string, password: string) => {
        const response = await login(email, password);

        if (response) {
          set({ token: response.access_token });

          return true;
        } else {
          return false;
        }
      },
      logout: () => {
        set(initialState);
      },
    }),
    {
      name: 'store-auth',
      partialize: state => ({
        token: state.token,
      }),
    },
  ),
);
