// ═══════════════════════════════════════════════════════════════
// Unite Attendance — Shared Enums
// ═══════════════════════════════════════════════════════════════

/** Global platform-level role */
export enum GlobalRole {
  SUPER_ADMIN = 'super_admin',
  USER = 'user',
}

/** Organization-level role */
export enum OrgRole {
  ORG_ADMIN = 'org_admin',
  MANAGER = 'manager',
  VIEWER = 'viewer',
  MEMBER = 'member',
}

/** Subscription plan tiers */
export enum Plan {
  FREE = 'free',
  STARTER = 'starter',
  PRO = 'pro',
  ENTERPRISE = 'enterprise',
}

/** How attendance was recorded */
export enum AttendanceMethod {
  QR_MOBILE = 'qr_mobile',
  QR_IDCARD = 'qr_idcard',
  QR_KIOSK = 'qr_kiosk',
  MANUAL = 'manual',
}

/** Attendance validation status */
export enum AttendanceStatus {
  VALID = 'valid',
  INVALID = 'invalid',
  FLAGGED = 'flagged',
}

/** Check-in or check-out */
export enum AttendanceType {
  CHECK_IN = 'check_in',
  CHECK_OUT = 'check_out',
}

/** QR code type */
export enum QRType {
  MOBILE = 'mobile',
  ID_CARD = 'id_card',
}

/** Subscription status */
export enum SubscriptionStatus {
  ACTIVE = 'active',
  PAST_DUE = 'past_due',
  CANCELLED = 'cancelled',
  TRIALING = 'trialing',
}

/** Days of the week */
export enum DayOfWeek {
  MON = 'mon',
  TUE = 'tue',
  WED = 'wed',
  THU = 'thu',
  FRI = 'fri',
  SAT = 'sat',
  SUN = 'sun',
}
