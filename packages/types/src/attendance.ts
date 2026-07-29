// ═══════════════════════════════════════════════════════════════
// Unite Attendance — Attendance Types
// ═══════════════════════════════════════════════════════════════

import type {
  AttendanceMethod,
  AttendanceStatus,
  AttendanceType,
  DayOfWeek,
} from './enums';
import type { GeoLocation, Holiday } from './organization';

/** Attendance record entity */
export interface AttendanceRecord {
  id: string;
  memberId: string;
  orgId: string;
  type: AttendanceType;
  timestamp: string;
  method: AttendanceMethod;
  scannedById: string | null;
  deviceInfo: DeviceInfo | null;
  gpsLocation: GeoLocation | null;
  status: AttendanceStatus;
  validationErrors: string[];
  notes: string | null;
  createdAt: string;
}

/** Attendance record with member details (joined) */
export interface AttendanceRecordWithMember extends AttendanceRecord {
  member: {
    id: string;
    employeeId: string | null;
    user: {
      name: string;
      avatarUrl: string | null;
    };
    department: {
      name: string;
    } | null;
  };
}

/** Device information captured during scan */
export interface DeviceInfo {
  userAgent: string;
  platform: string;
  deviceId?: string;
  kioskId?: string;
  branch?: string;
  restrictedDept?: string;
}

/** Attendance rule entity */
export interface AttendanceRule {
  id: string;
  orgId: string;
  name: string;
  workStart: string; // "HH:mm"
  workEnd: string; // "HH:mm"
  lateThresholdMin: number;
  halfDayThresholdMin: number;
  requireGps: boolean;
  allowedLocations: GeoLocation[] | null;
  gpsRadiusMeters: number;
  workingDays: DayOfWeek[];
  holidayCalendar: Holiday[] | null;
  preventDuplicateMin: number;
  isDefault: boolean;
  isActive: boolean;
  createdAt: string;
}

/** Daily attendance stats for dashboard */
export interface AttendanceStats {
  date: string;
  totalMembers: number;
  present: number;
  absent: number;
  late: number;
  onLeave: number;
  checkedOut: number;
  attendancePercentage: number;
}

/** Weekly attendance summary */
export interface WeeklyAttendanceSummary {
  days: Array<{
    date: string;
    dayOfWeek: DayOfWeek;
    status: 'present' | 'absent' | 'late' | 'holiday' | 'weekend' | 'future';
    checkInTime: string | null;
    checkOutTime: string | null;
  }>;
}

/** Member's daily attendance detail */
export interface MemberDailyAttendance {
  date: string;
  status: 'present' | 'absent' | 'late' | 'half_day' | 'holiday' | 'weekend';
  checkInTime: string | null;
  checkOutTime: string | null;
  workingHours: number | null;
  method: AttendanceMethod | null;
  isLate: boolean;
  lateByMinutes: number;
}

/** Monthly attendance summary */
export interface MonthlyAttendanceSummary {
  month: string; // "YYYY-MM"
  totalWorkingDays: number;
  daysPresent: number;
  daysAbsent: number;
  daysLate: number;
  daysHalfDay: number;
  holidays: number;
  attendancePercentage: number;
  averageCheckInTime: string | null;
  averageWorkingHours: number | null;
  records: MemberDailyAttendance[];
}

/** Scan attendance request (from kiosk or app) */
export interface ScanAttendanceRequest {
  qrToken: string;
  deviceInfo: DeviceInfo;
  gpsLocation?: GeoLocation;
}

/** Scan result returned to kiosk/app */
export interface ScanResult {
  success: boolean;
  type: AttendanceType;
  status: AttendanceStatus;
  memberName: string;
  memberAvatar: string | null;
  employeeId: string | null;
  departmentName: string | null;
  timestamp: string;
  message: string;
  errors: string[];
}

/** Manual attendance request (admin) */
export interface ManualAttendanceRequest {
  memberId: string;
  type: AttendanceType;
  timestamp: string;
  notes?: string;
}

/** Attendance query filters */
export interface AttendanceQueryFilters {
  startDate?: string;
  endDate?: string;
  memberId?: string;
  departmentId?: string;
  branchId?: string;
  status?: AttendanceStatus;
  method?: AttendanceMethod;
  type?: AttendanceType;
  page?: number;
  pageSize?: number;
  sortBy?: 'timestamp' | 'memberName';
  sortOrder?: 'asc' | 'desc';
}

/** Create attendance rule request */
export interface CreateAttendanceRuleRequest {
  name: string;
  workStart: string;
  workEnd: string;
  lateThresholdMin?: number;
  halfDayThresholdMin?: number;
  requireGps?: boolean;
  allowedLocations?: GeoLocation[];
  gpsRadiusMeters?: number;
  workingDays?: DayOfWeek[];
  holidayCalendar?: Holiday[];
  preventDuplicateMin?: number;
  isDefault?: boolean;
}
