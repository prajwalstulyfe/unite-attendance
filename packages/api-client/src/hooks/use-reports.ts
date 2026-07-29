'use client';
// ═══════════════════════════════════════════════════════════════
// Unite Attendance — Reports Hooks
// ═══════════════════════════════════════════════════════════════

import { useQuery, useMutation } from '@tanstack/react-query';
import { apiClient } from '../client';
import type { ApiResponse, AttendanceStats } from '@repo/types';

export const reportKeys = {
  all: (orgId: string) => ['organizations', orgId, 'reports'] as const,
  daily: (orgId: string, date: string) => [...reportKeys.all(orgId), 'daily', date] as const,
  monthly: (orgId: string, month: string) => [...reportKeys.all(orgId), 'monthly', month] as const,
  summary: (orgId: string) => [...reportKeys.all(orgId), 'summary'] as const,
};

/** Get daily report */
export function useDailyReport(orgId: string, date: string) {
  return useQuery({
    queryKey: reportKeys.daily(orgId, date),
    queryFn: async () => {
      const { data } = await apiClient.get<ApiResponse<AttendanceStats>>(
        `/organizations/${orgId}/reports/daily`,
        { params: { date } },
      );
      return data.data;
    },
    enabled: !!orgId && !!date,
  });
}

/** Get monthly report */
export function useMonthlyReport(orgId: string, month: string) {
  return useQuery({
    queryKey: reportKeys.monthly(orgId, month),
    queryFn: async () => {
      const { data } = await apiClient.get<ApiResponse<{
        stats: AttendanceStats[];
        summary: {
          avgAttendance: number;
          totalWorkingDays: number;
          bestDay: string;
          worstDay: string;
        };
      }>>(
        `/organizations/${orgId}/reports/monthly`,
        { params: { month } },
      );
      return data.data;
    },
    enabled: !!orgId && !!month,
  });
}

/** Export report as CSV/PDF */
export function useExportReport(orgId: string) {
  return useMutation({
    mutationFn: async (params: {
      format: 'csv' | 'pdf';
      startDate: string;
      endDate: string;
      departmentId?: string;
      branchId?: string;
    }) => {
      const { data } = await apiClient.get(`/organizations/${orgId}/reports/export`, {
        params,
        responseType: 'blob',
      });
      // Create download link
      const blob = new Blob([data as BlobPart]);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `attendance-report-${params.startDate}-${params.endDate}.${params.format}`;
      a.click();
      URL.revokeObjectURL(url);
    },
  });
}
