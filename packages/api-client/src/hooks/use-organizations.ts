'use client';
// ═══════════════════════════════════════════════════════════════
// Unite Attendance — Organization Hooks
// ═══════════════════════════════════════════════════════════════

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../client';
import type {
  ApiResponse,
  PaginatedResponse,
  Organization,
  OrganizationWithStats,
  CreateOrganizationRequest,
  UpdateOrganizationRequest,
  PaginationQuery,
} from '@repo/types';

export const orgKeys = {
  all: ['organizations'] as const,
  lists: () => [...orgKeys.all, 'list'] as const,
  list: (params: PaginationQuery) => [...orgKeys.lists(), params] as const,
  details: () => [...orgKeys.all, 'detail'] as const,
  detail: (id: string) => [...orgKeys.details(), id] as const,
};

/** List organizations (super admin) or user's organizations */
export function useOrganizations(params: PaginationQuery = {}) {
  return useQuery({
    queryKey: orgKeys.list(params),
    queryFn: async () => {
      const { data } = await apiClient.get<ApiResponse<PaginatedResponse<OrganizationWithStats>>>('/organizations', { params });
      return data.data;
    },
  });
}

/** Get single organization */
export function useOrganization(orgId: string) {
  return useQuery({
    queryKey: orgKeys.detail(orgId),
    queryFn: async () => {
      const { data } = await apiClient.get<ApiResponse<OrganizationWithStats>>(`/organizations/${orgId}`);
      return data.data;
    },
    enabled: !!orgId,
  });
}

/** Create organization */
export function useCreateOrganization() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateOrganizationRequest) => {
      const { data } = await apiClient.post<ApiResponse<Organization>>('/organizations', payload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orgKeys.lists() });
    },
  });
}

/** Update organization */
export function useUpdateOrganization(orgId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: UpdateOrganizationRequest) => {
      const { data } = await apiClient.patch<ApiResponse<Organization>>(`/organizations/${orgId}`, payload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orgKeys.detail(orgId) });
      queryClient.invalidateQueries({ queryKey: orgKeys.lists() });
    },
  });
}
