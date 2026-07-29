'use client';
// ═══════════════════════════════════════════════════════════════
// Unite Attendance — Departments Hooks
// ═══════════════════════════════════════════════════════════════

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../client';
import type { ApiResponse, Department, CreateDepartmentRequest } from '@repo/types';

export const departmentKeys = {
  all: (orgId: string) => ['organizations', orgId, 'departments'] as const,
  list: (orgId: string) => [...departmentKeys.all(orgId), 'list'] as const,
};

/** List departments */
export function useDepartments(orgId: string) {
  return useQuery({
    queryKey: departmentKeys.list(orgId),
    queryFn: async () => {
      const { data } = await apiClient.get<ApiResponse<Department[]>>(
        `/organizations/${orgId}/departments`,
      );
      return data.data;
    },
    enabled: !!orgId,
  });
}

/** Create department */
export function useCreateDepartment(orgId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateDepartmentRequest) => {
      const { data } = await apiClient.post<ApiResponse<Department>>(
        `/organizations/${orgId}/departments`,
        payload,
      );
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: departmentKeys.list(orgId) });
    },
  });
}

/** Update department */
export function useUpdateDepartment(orgId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      const { data } = await apiClient.patch<ApiResponse<Department>>(
        `/organizations/${orgId}/departments/${id}`,
        { name },
      );
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: departmentKeys.list(orgId) });
    },
  });
}

/** Delete department */
export function useDeleteDepartment(orgId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/organizations/${orgId}/departments/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: departmentKeys.list(orgId) });
    },
  });
}
