import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import { useAuthStore, AuthUser } from './authStore';

interface AuthResponseData {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

export function useLogin() {
  const setSession = useAuthStore((s) => s.setSession);
  return useMutation({
    mutationFn: async (input: { email: string; password: string }) => {
      const { data } = await apiClient.post<{ success: boolean; data: AuthResponseData }>('/auth/login', input);
      return data.data;
    },
    onSuccess: (data) => setSession(data.user, data.accessToken, data.refreshToken),
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: async (input: { fullName: string; email: string; mobileNumber: string; password: string }) => {
      const { data } = await apiClient.post('/auth/register', input);
      return data;
    },
  });
}
