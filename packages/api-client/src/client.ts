// ═══════════════════════════════════════════════════════════════
// Unite Attendance — API Client (Axios Instance)
// ═══════════════════════════════════════════════════════════════

import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import type { ApiError } from '@repo/types';
import { tokenStorage } from './lib/token-storage';

/** Extended axios config to track retry state */
interface RetryConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

/**
 * Create the configured Axios instance for API communication.
 * Features:
 * - Auto-attaches JWT access token to every request
 * - Auto-refreshes expired access tokens using refresh token
 * - Standardized error handling
 */
const apiClient = axios.create({
  baseURL: typeof window !== 'undefined'
    ? (window as unknown as Record<string, string>).__NEXT_PUBLIC_API_URL ?? process.env['NEXT_PUBLIC_API_URL'] ?? 'http://localhost:3001'
    : process.env['NEXT_PUBLIC_API_URL'] ?? 'http://localhost:3001',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// ─── Request Interceptor: Attach access token ───────────────
apiClient.interceptors.request.use(
  (config) => {
    const token = tokenStorage.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ─── Response Interceptor: Auto-refresh on 401 ─────────────
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config as RetryConfig | undefined;

    // If 401 and we haven't retried yet, try refreshing the token
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = tokenStorage.getRefreshToken();
        if (!refreshToken) {
          tokenStorage.clear();
          throw error;
        }

        const response = await axios.post<{
          data: { accessToken: string; refreshToken: string };
        }>(
          `${apiClient.defaults.baseURL}/auth/refresh`,
          { refreshToken },
          { headers: { 'Content-Type': 'application/json' } },
        );

        const { accessToken, refreshToken: newRefreshToken } = response.data.data;
        tokenStorage.setTokens(accessToken, newRefreshToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch {
        // Refresh failed — clear tokens and redirect to login
        tokenStorage.clear();
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        throw error;
      }
    }

    throw error;
  },
);

export { apiClient };
