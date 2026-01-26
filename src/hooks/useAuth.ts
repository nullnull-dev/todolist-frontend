'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { setToken, removeToken, getToken } from '@/lib/auth';
import { AuthResponse, LoginRequest, SignupRequest, User } from '@/types';

export const useAuth = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const token = getToken();
      if (!token) return null;
      const response = await api.get<User>('/api/v1/auth/me');
      return response.data;
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  const signupMutation = useMutation({
    mutationFn: async (data: SignupRequest) => {
      const response = await api.post<User>('/api/v1/auth/signup', data);
      return response.data;
    },
    onSuccess: () => {
      router.push('/login');
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginRequest) => {
      const response = await api.post<AuthResponse>('/api/v1/auth/login', data);
      return response.data;
    },
    onSuccess: (data) => {
      setToken(data.accessToken);
      queryClient.invalidateQueries({ queryKey: ['user'] });
      router.push('/dashboard');
    },
  });

  const logout = () => {
    removeToken();
    queryClient.clear();
    router.push('/login');
  };

  return {
    user,
    isLoadingUser,
    isAuthenticated: !!user,
    signup: signupMutation.mutate,
    isSigningUp: signupMutation.isPending,
    signupError: signupMutation.error,
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
    logout,
  };
};
