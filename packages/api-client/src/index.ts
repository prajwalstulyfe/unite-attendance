// ═══════════════════════════════════════════════════════════════
// Unite Attendance — API Client
// Re-exports everything for consuming apps
// ═══════════════════════════════════════════════════════════════

// Core client
export { apiClient } from './client';

// Token management
export { tokenStorage } from './lib/token-storage';

// Socket.IO
export { connectSocket, disconnectSocket, getSocket, isSocketConnected } from './lib/socket';

// Providers
export { QueryProvider } from './providers/query-provider';

// Auth hooks
export { useSession, useLogin, useRegister, useGoogleLogin, useLogout, authKeys } from './hooks/use-auth';

// Organization hooks
export { useOrganizations, useOrganization, useCreateOrganization, useUpdateOrganization, orgKeys } from './hooks/use-organizations';

// Member hooks
export { useMembers, useMember, useCreateMember, useUpdateMember, useDeleteMember, useBulkImportMembers, memberKeys } from './hooks/use-members';

// Attendance hooks
export { useTodayStats, useAttendanceRecords, useMemberAttendance, useScanAttendance, useManualAttendance, attendanceKeys } from './hooks/use-attendance';

// QR hooks
export { useMemberQR, useGenerateQR, useRegenerateQR, useBulkGenerateQR, qrKeys } from './hooks/use-qr';

// Report hooks
export { useDailyReport, useMonthlyReport, useExportReport, reportKeys } from './hooks/use-reports';

// Department hooks
export { useDepartments, useCreateDepartment, useUpdateDepartment, useDeleteDepartment, departmentKeys } from './hooks/use-departments';

// Branch hooks
export { useBranches, useCreateBranch, useUpdateBranch, useDeleteBranch, branchKeys } from './hooks/use-branches';

// Realtime hooks
export { useRealtimeAttendance } from './hooks/use-realtime';
