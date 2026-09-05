import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/services/api/types/models';
import { API_CONFIG } from '@/services/api/config';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user: User, token: string) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem(API_CONFIG.TOKEN_KEY, token);
          localStorage.setItem(API_CONFIG.USER_KEY, JSON.stringify(user));
        }
        set({ user, token, isAuthenticated: true });
      },
      logout: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem(API_CONFIG.TOKEN_KEY);
          localStorage.removeItem(API_CONFIG.USER_KEY);
        }
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
