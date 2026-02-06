import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { useAuthStore } from '@/stores/authStore';
import type { User, LoginCredentials, RegisterData } from '@/types/user';

interface TokenResponse {
  access_token: string;
  token_type: string;
}

export function useLogin() {
  const { login } = useAuthStore();

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await apiClient.post<TokenResponse>('/auth/login/json', credentials);
      return response.data;
    },
    onSuccess: async (data) => {
      localStorage.setItem('auth-token', data.access_token);
      // Fetch user data
      const userResponse = await apiClient.get<User>('/auth/me');
      login(userResponse.data, data.access_token);
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: async (data: RegisterData) => {
      const response = await apiClient.post<User>('/auth/register', data);
      return response.data;
    },
  });
}

export function useCurrentUser() {
  const { isAuthenticated, token } = useAuthStore();

  return useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const response = await apiClient.get<User>('/auth/me');
      return response.data;
    },
    enabled: isAuthenticated && !!token,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useLogout() {
  const { logout } = useAuthStore();
  const queryClient = useQueryClient();

  return () => {
    localStorage.removeItem('auth-token');
    logout();
    queryClient.clear();
  };
}
