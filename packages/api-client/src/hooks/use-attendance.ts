'use client';
// ═══════════════════════════════════════════════════════════════
// Unite Attendance — Attendance Hooks
// ═══════════════════════════════════════════════════════════════

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../client';
import type {
  ApiResponse,
  PaginatedResponse,
  AttendanceRecordWithMember,
  AttendanceStats,
  AttendanceQueryFilters,
  ScanAttendanceRequest,
  ScanResult,
  ManualAttendanceRequest,
  MemberDailyAttendance,
  MonthlyAttendanceSummary,
} from '@repo/types';

export const attendanceKeys = {
  all: (orgId: string) => ['organizations', orgId, 'attendance'] as const,
  lists: (orgId: string) => [...attendanceKeys.all(orgId), 'list'] as const,
  list: (orgId: string, filters: AttendanceQueryFilters) =>
    [...attendanceKeys.lists(orgId), filters] as const,
  today: (orgId: string) => [...attendanceKeys.all(orgId), 'today'] as const,
  memberHistory: (orgId: string, memberId: string) =>
    [...attendanceKeys.all(orgId), 'member', memberId] as const,
  stats: (orgId: string) => [...attendanceKeys.all(orgId), 'stats'] as const,
};

/** Get today's attendance stats */
export function useTodayStats(orgId: string) {
  return useQuery({
    queryKey: attendanceKeys.today(orgId),
    queryFn: async () => {
      const { data } = await apiClient.get<ApiResponse<AttendanceStats>>(
        `/organizations/${orgId}/attendance/today`,
      );
      return data.data;
    },
    enabled: !!orgId,
    refetchInterval: 30000, // Fallback polling every 30s (WebSocket is primary)
  });
}

/** Query attendance records with filters */
export function useAttendanceRecords(orgId: string, filters: AttendanceQueryFilters = {}) {
  return useQuery({
    queryKey: attendanceKeys.list(orgId, filters),
    queryFn: async () => {
      const { data } = await apiClient.get<ApiResponse<PaginatedResponse<AttendanceRecordWithMember>>>(
        `/organizations/${orgId}/attendance`,
        { params: filters },
      );
      return data.data;
    },
    enabled: !!orgId,
  });
}

/** Get member's attendance history */
export function useMemberAttendance(orgId: string, memberId: string, month?: string) {
  return useQuery({
    queryKey: [...attendanceKeys.memberHistory(orgId, memberId), month],
    queryFn: async () => {
      const { data } = await apiClient.get<ApiResponse<MonthlyAttendanceSummary>>(
        `/organizations/${orgId}/attendance/member/${memberId}`,
        { params: { month } },
      );
      return data.data;
    },
    enabled: !!orgId && !!memberId,
  });
}

/** Scan QR to mark attendance (used by kiosk and app) */
export function useScanAttendance() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: ScanAttendanceRequest) => {
      const { data } = await apiClient.post<ApiResponse<ScanResult>>('/attendance/scan', payload);
      return data.data;
    },
    onSuccess: () => {
      // Invalidate all attendance queries — the scan could affect any org
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
    },
  });
}

/** Manual attendance entry (admin) */
export function useManualAttendance(orgId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: ManualAttendanceRequest) => {
      const { data } = await apiClient.post<ApiResponse<AttendanceRecordWithMember>>(
        `/organizations/${orgId}/attendance/manual`,
        payload,
      );
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: attendanceKeys.all(orgId) });
    },
  });
}
