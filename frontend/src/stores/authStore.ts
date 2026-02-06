import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import apiClient from '@/lib/api-client';
import type { User, LoginCredentials, RegisterData, AuthResponse } from '@/types/user';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  login: (user: User, token: string) => void;
  loginWithCredentials: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
  updateCredits: (credits: number) => void;
  fetchCurrentUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,

        login: (user: User, token: string) => {
          if (typeof window !== 'undefined') {
            localStorage.setItem('auth-token', token);
          }
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
        },

        loginWithCredentials: async (credentials: LoginCredentials) => {
          set({ isLoading: true });
          try {
            const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
            const { access_token, user } = response.data;

            // Store token in localStorage for API client interceptor
            if (typeof window !== 'undefined') {
              localStorage.setItem('auth-token', access_token);
            }

            set({
              user,
              token: access_token,
              isAuthenticated: true,
              isLoading: false,
            });
          } catch (error) {
            set({ isLoading: false });
            throw error;
          }
        },

        register: async (data: RegisterData) => {
          set({ isLoading: true });
          try {
            const response = await apiClient.post<User>('/auth/register', {
              email: data.email,
              password: data.password,
            });

            // Auto-login after registration
            await get().loginWithCredentials({
              email: data.email,
              password: data.password,
            });
          } catch (error) {
            set({ isLoading: false });
            throw error;
          }
        },

        logout: () => {
          // Clear token from localStorage
          if (typeof window !== 'undefined') {
            localStorage.removeItem('auth-token');
          }

          set({
            user: null,
            token: null,
            isAuthenticated: false,
          });
        },

        setUser: (user: User) => {
          set({ user });
        },

        updateCredits: (credits: number) => {
          const { user } = get();
          if (user) {
            set({ user: { ...user, credits } });
          }
        },

        fetchCurrentUser: async () => {
          try {
            const response = await apiClient.get<User>('/auth/me');
            set({ user: response.data, isAuthenticated: true });
          } catch (error) {
            set({ user: null, token: null, isAuthenticated: false });
          }
        },
      }),
      {
        name: 'auth-storage',
        partialize: (state) => ({
          user: state.user,
          token: state.token,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    )
  )
);
