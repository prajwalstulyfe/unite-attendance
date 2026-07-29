// ═══════════════════════════════════════════════════════════════
// Unite Attendance — Member Types
// ═══════════════════════════════════════════════════════════════

import type { OrgRole } from './enums';

/** Organization member entity */
export interface OrgMember {
  id: string;
  userId: string;
  orgId: string;
  role: OrgRole;
  departmentId: string | null;
  branchId: string | null;
  employeeId: string | null;
  designation: string | null;
  phone: string | null;
  isActive: boolean;
  joinedAt: string;
  updatedAt: string;
}

/** Member with user profile data (joined) */
export interface MemberWithProfile extends OrgMember {
  user: {
    id: string;
    email: string;
    name: string;
    avatarUrl: string | null;
  };
  department: {
    id: string;
    name: string;
  } | null;
  branch: {
    id: string;
    name: string;
  } | null;
}

/** Member with attendance stats */
export interface MemberWithStats extends MemberWithProfile {
  totalPresent: number;
  totalAbsent: number;
  totalLate: number;
  attendancePercentage: number;
  lastCheckIn: string | null;
  hasActiveQr: boolean;
}

/** Create member request */
export interface CreateMemberRequest {
  email: string;
  name: string;
  role: OrgRole;
  departmentId?: string;
  branchId?: string;
  employeeId?: string;
  designation?: string;
  phone?: string;
  sendInvitation?: boolean;
}

/** Update member request */
export interface UpdateMemberRequest {
  name?: string;
  role?: OrgRole;
  departmentId?: string | null;
  branchId?: string | null;
  employeeId?: string;
  designation?: string;
  phone?: string;
  isActive?: boolean;
}

/** Bulk import row from CSV */
export interface BulkImportRow {
  name: string;
  email: string;
  phone?: string;
  department?: string;
  branch?: string;
  employeeId?: string;
  role?: OrgRole;
  designation?: string;
}

/** Bulk import result */
export interface BulkImportResult {
  totalRows: number;
  successCount: number;
  failedCount: number;
  skippedCount: number;
  errors: Array<{
    row: number;
    email: string;
    reason: string;
  }>;
}

/** Invite member request */
export interface InviteMemberRequest {
  email: string;
  name: string;
  role: OrgRole;
  departmentId?: string;
  branchId?: string;
  message?: string;
}
