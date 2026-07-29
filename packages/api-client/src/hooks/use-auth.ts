'use client';
// ═══════════════════════════════════════════════════════════════
// Unite Attendance — Auth Hooks
// ═══════════════════════════════════════════════════════════════

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../client';
import { tokenStorage } from '../lib/token-storage';
import type {
  ApiResponse,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  GoogleAuthRequest,
  User,
  UserOrgMembership,
} from '@repo/types';

/** Query key factory */
export const authKeys = {
  all: ['auth'] as const,
  session: () => [...authKeys.all, 'session'] as const,
  organizations: () => [...authKeys.all, 'organizations'] as const,
};

/** Get current user session */
export function useSession() {
  return useQuery({
    queryKey: authKeys.session(),
    queryFn: async () => {
      const { data } = await apiClient.get<ApiResponse<{ user: User; organizations: UserOrgMembership[] }>>('/auth/me');
      return data.data;
    },
    enabled: tokenStorage.isAuthenticated(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });
}

/** Login with email/password */
export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: LoginRequest) => {
      const { data } = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
      return data.data;
    },
    onSuccess: (data) => {
      tokenStorage.setTokens(data.accessToken, data.refreshToken);
      queryClient.setQueryData(authKeys.session(), {
        user: data.user,
        organizations: data.organizations,
      });
    },
  });
}

/** Register a new account */
export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: RegisterRequest) => {
      const { data } = await apiClient.post<ApiResponse<AuthResponse>>('/auth/register', credentials);
      return data.data;
    },
    onSuccess: (data) => {
      tokenStorage.setTokens(data.accessToken, data.refreshToken);
      queryClient.setQueryData(authKeys.session(), {
        user: data.user,
        organizations: data.organizations,
      });
    },
  });
}

/** Login with Google OAuth */
export function useGoogleLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: GoogleAuthRequest) => {
      const { data } = await apiClient.post<ApiResponse<AuthResponse>>('/auth/google', payload);
      return data.data;
    },
    onSuccess: (data) => {
      tokenStorage.setTokens(data.accessToken, data.refreshToken);
      queryClient.setQueryData(authKeys.session(), {
        user: data.user,
        organizations: data.organizations,
      });
    },
  });
}

/** Logout */
export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await apiClient.post('/auth/logout');
    },
    onSettled: () => {
      tokenStorage.clear();
      queryClient.clear();
    },
  });
}
