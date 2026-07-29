'use client';
// ═══════════════════════════════════════════════════════════════
// Unite Attendance — Branches Hooks
// ═══════════════════════════════════════════════════════════════

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../client';
import type { ApiResponse, Branch, CreateBranchRequest } from '@repo/types';

export const branchKeys = {
  all: (orgId: string) => ['organizations', orgId, 'branches'] as const,
  list: (orgId: string) => [...branchKeys.all(orgId), 'list'] as const,
};

/** List branches */
export function useBranches(orgId: string) {
  return useQuery({
    queryKey: branchKeys.list(orgId),
    queryFn: async () => {
      const { data } = await apiClient.get<ApiResponse<Branch[]>>(
        `/organizations/${orgId}/branches`,
      );
      return data.data;
    },
    enabled: !!orgId,
  });
}

/** Create branch */
export function useCreateBranch(orgId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateBranchRequest) => {
      const { data } = await apiClient.post<ApiResponse<Branch>>(
        `/organizations/${orgId}/branches`,
        payload,
      );
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: branchKeys.list(orgId) });
    },
  });
}

/** Update branch */
export function useUpdateBranch(orgId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: { id: string } & Partial<CreateBranchRequest>) => {
      const { data } = await apiClient.patch<ApiResponse<Branch>>(
        `/organizations/${orgId}/branches/${id}`,
        payload,
      );
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: branchKeys.list(orgId) });
    },
  });
}

/** Delete branch */
export function useDeleteBranch(orgId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/organizations/${orgId}/branches/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: branchKeys.list(orgId) });
    },
  });
}
