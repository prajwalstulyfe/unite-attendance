'use client';
// ═══════════════════════════════════════════════════════════════
// Unite Attendance — QR Hooks
// ═══════════════════════════════════════════════════════════════

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../client';
import type {
  ApiResponse,
  QRCodeWithMember,
  GenerateQRRequest,
  BulkGenerateQRRequest,
  BulkGenerateQRResult,
} from '@repo/types';

export const qrKeys = {
  all: (orgId: string) => ['organizations', orgId, 'qr'] as const,
  member: (orgId: string, memberId: string) => [...qrKeys.all(orgId), memberId] as const,
};

/** Get member's active QR code */
export function useMemberQR(orgId: string, memberId: string) {
  return useQuery({
    queryKey: qrKeys.member(orgId, memberId),
    queryFn: async () => {
      const { data } = await apiClient.get<ApiResponse<QRCodeWithMember>>(
        `/organizations/${orgId}/qr/${memberId}`,
      );
      return data.data;
    },
    enabled: !!orgId && !!memberId,
    staleTime: 60 * 60 * 1000, // QR codes rarely change — cache for 1 hour
  });
}

/** Generate QR code for a member */
export function useGenerateQR(orgId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: GenerateQRRequest) => {
      const { data } = await apiClient.post<ApiResponse<QRCodeWithMember>>(
        `/organizations/${orgId}/qr/generate`,
        payload,
      );
      return data.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(qrKeys.member(orgId, data.memberId), data);
    },
  });
}

/** Regenerate QR code (invalidates old one) */
export function useRegenerateQR(orgId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (memberId: string) => {
      const { data } = await apiClient.post<ApiResponse<QRCodeWithMember>>(
        `/organizations/${orgId}/qr/regenerate/${memberId}`,
      );
      return data.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(qrKeys.member(orgId, data.memberId), data);
    },
  });
}

/** Bulk generate QR codes */
export function useBulkGenerateQR(orgId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: BulkGenerateQRRequest) => {
      const { data } = await apiClient.post<ApiResponse<BulkGenerateQRResult>>(
        `/organizations/${orgId}/qr/bulk-generate`,
        payload,
      );
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qrKeys.all(orgId) });
    },
  });
}
