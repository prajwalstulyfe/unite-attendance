'use client';
// ═══════════════════════════════════════════════════════════════
// Unite Attendance — Members Hooks
// ═══════════════════════════════════════════════════════════════

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../client';
import type {
  ApiResponse,
  PaginatedResponse,
  MemberWithProfile,
  MemberWithStats,
  CreateMemberRequest,
  UpdateMemberRequest,
  BulkImportResult,
  PaginationQuery,
} from '@repo/types';

export const memberKeys = {
  all: (orgId: string) => ['organizations', orgId, 'members'] as const,
  lists: (orgId: string) => [...memberKeys.all(orgId), 'list'] as const,
  list: (orgId: string, params?: unknown) =>
    [...memberKeys.lists(orgId), params] as const,
  details: (orgId: string) => [...memberKeys.all(orgId), 'detail'] as const,
  detail: (orgId: string, memberId: string) => [...memberKeys.details(orgId), memberId] as const,
};

/** List members with pagination and filters */
export function useMembers(
  orgId: string,
  params: PaginationQuery & {
    departmentId?: string;
    branchId?: string;
    role?: string;
    isActive?: boolean;
  } = {},
) {
  return useQuery({
    queryKey: memberKeys.list(orgId, params),
    queryFn: async () => {
      const { data } = await apiClient.get<ApiResponse<PaginatedResponse<MemberWithProfile>>>(
        `/organizations/${orgId}/members`,
        { params },
      );
      return data.data;
    },
    enabled: !!orgId,
  });
}

/** Get single member with stats */
export function useMember(orgId: string, memberId: string) {
  return useQuery({
    queryKey: memberKeys.detail(orgId, memberId),
    queryFn: async () => {
      const { data } = await apiClient.get<ApiResponse<MemberWithStats>>(
        `/organizations/${orgId}/members/${memberId}`,
      );
      return data.data;
    },
    enabled: !!orgId && !!memberId,
  });
}

/** Add a new member */
export function useCreateMember(orgId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateMemberRequest) => {
      const { data } = await apiClient.post<ApiResponse<MemberWithProfile>>(
        `/organizations/${orgId}/members`,
        payload,
      );
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: memberKeys.lists(orgId) });
    },
  });
}

/** Update a member */
export function useUpdateMember(orgId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ memberId, payload }: { memberId: string; payload: UpdateMemberRequest }) => {
      const { data } = await apiClient.patch<ApiResponse<MemberWithProfile>>(
        `/organizations/${orgId}/members/${memberId}`,
        payload,
      );
      return data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: memberKeys.detail(orgId, variables.memberId) });
      queryClient.invalidateQueries({ queryKey: memberKeys.lists(orgId) });
    },
  });
}

/** Delete a member */
export function useDeleteMember(orgId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (memberId: string) => {
      const { data } = await apiClient.delete<ApiResponse<{ success: boolean }>>(
        `/organizations/${orgId}/members/${memberId}`,
      );
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: memberKeys.lists(orgId) });
    },
  });
}

/** Bulk import members from CSV */
export function useBulkImportMembers(orgId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      const { data } = await apiClient.post<ApiResponse<BulkImportResult>>(
        `/organizations/${orgId}/members/bulk-import`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } },
      );
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: memberKeys.lists(orgId) });
    },
  });
}
