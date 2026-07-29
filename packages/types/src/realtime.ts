// ═══════════════════════════════════════════════════════════════
// Unite Attendance — Real-Time Event Types
// ═══════════════════════════════════════════════════════════════

import type { AttendanceStatus, AttendanceType, AttendanceMethod } from './enums';

/** WebSocket event names */
export enum WsEvent {
  // Attendance events
  ATTENDANCE_CHECKIN = 'attendance:checkin',
  ATTENDANCE_CHECKOUT = 'attendance:checkout',
  ATTENDANCE_STATS_UPDATE = 'attendance:stats',

  // Member events
  MEMBER_STATUS_CHANGE = 'member:status',

  // Notification events
  NOTIFICATION = 'notification:new',

  // Room management
  ORG_ROOM_JOIN = 'org:join',
  ORG_ROOM_LEAVE = 'org:leave',

  // Connection
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  ERROR = 'error',
}

/** Real-time attendance event payload */
export interface WsAttendanceEvent {
  id: string;
  memberId: string;
  memberName: string;
  memberAvatar: string | null;
  employeeId: string | null;
  departmentName: string | null;
  type: AttendanceType;
  method: AttendanceMethod;
  status: AttendanceStatus;
  timestamp: string;
  message: string;
}

/** Real-time stats update payload */
export interface WsStatsUpdateEvent {
  present: number;
  absent: number;
  late: number;
  onLeave: number;
  totalMembers: number;
  attendancePercentage: number;
  timestamp: string;
}

/** Notification payload */
export interface WsNotificationEvent {
  id: string;
  title: string;
  body: string;
  type: 'info' | 'warning' | 'success' | 'error';
  timestamp: string;
  actionUrl?: string;
}

/** WebSocket auth handshake */
export interface WsAuthPayload {
  token: string;
  orgId: string;
}
