import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { login as loginRequest } from '@/services/auth';

interface AuthState {
  token: string | null;
  userEmail: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const initialState = {
  token: null as string | null,
  userEmail: null as string | null,
};

export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      ...initialState,
      login: async (email: string, password: string) => {
        const response = await loginRequest(email, password);

        if (response) {
          set({ token: response.access_token, userEmail: email });

          return true;
        }

        return false;
      },
      logout: () => {
        set(initialState);
      },
    }),
    {
      name: 'store-auth',
      partialize: state => ({
        token: state.token,
        userEmail: state.userEmail,
      }),
    },
  ),
);
