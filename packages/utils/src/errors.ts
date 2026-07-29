// ═══════════════════════════════════════════════════════════════
// Unite Attendance — Error Code Utilities
// ═══════════════════════════════════════════════════════════════

import { ErrorCodes } from '@repo/types';
import type { ErrorCode } from '@repo/types';

/** Human-readable error messages for each error code */
export const ERROR_MESSAGES: Record<ErrorCode, string> = {
  // Auth
  [ErrorCodes.INVALID_CREDENTIALS]: 'Invalid email or password',
  [ErrorCodes.EMAIL_ALREADY_EXISTS]: 'An account with this email already exists',
  [ErrorCodes.TOKEN_EXPIRED]: 'Your session has expired. Please log in again',
  [ErrorCodes.TOKEN_INVALID]: 'Invalid authentication token',
  [ErrorCodes.UNAUTHORIZED]: 'You need to log in to access this resource',
  [ErrorCodes.FORBIDDEN]: 'You do not have permission to perform this action',

  // Organization
  [ErrorCodes.ORG_NOT_FOUND]: 'Organization not found',
  [ErrorCodes.ORG_SLUG_TAKEN]: 'This organization URL is already taken',
  [ErrorCodes.ORG_INACTIVE]: 'This organization has been deactivated',
  [ErrorCodes.PLAN_LIMIT_REACHED]: 'You have reached your plan limit. Please upgrade',

  // Member
  [ErrorCodes.MEMBER_NOT_FOUND]: 'Member not found',
  [ErrorCodes.MEMBER_ALREADY_EXISTS]: 'This member already exists in the organization',
  [ErrorCodes.MEMBER_INACTIVE]: 'This member account has been deactivated',

  // QR
  [ErrorCodes.QR_NOT_FOUND]: 'QR code not found',
  [ErrorCodes.QR_EXPIRED]: 'This QR code has expired. Please request a new one',
  [ErrorCodes.QR_INACTIVE]: 'This QR code has been deactivated',
  [ErrorCodes.QR_ALREADY_EXISTS]: 'An active QR code already exists for this member',

  // Attendance
  [ErrorCodes.DUPLICATE_SCAN]: 'This QR was already scanned recently',
  [ErrorCodes.NON_WORKING_DAY]: 'Today is not a working day',
  [ErrorCodes.HOLIDAY]: 'Today is a holiday',
  [ErrorCodes.GPS_REQUIRED]: 'GPS location is required for attendance',
  [ErrorCodes.OUT_OF_GPS_RANGE]: 'You are outside the allowed location range',
  [ErrorCodes.LATE_CHECKIN]: 'Late check-in recorded',
  [ErrorCodes.OUTSIDE_WORKING_HOURS]: 'Outside working hours',

  // General
  [ErrorCodes.NOT_FOUND]: 'Resource not found',
  [ErrorCodes.VALIDATION_ERROR]: 'Validation error. Please check your input',
  [ErrorCodes.INTERNAL_ERROR]: 'An unexpected error occurred. Please try again',
  [ErrorCodes.RATE_LIMIT_EXCEEDED]: 'Too many requests. Please slow down',
};

/**
 * Get human-readable error message for an error code
 */
export function getErrorMessage(code: string): string {
  return ERROR_MESSAGES[code as ErrorCode] ?? 'An unexpected error occurred';
}
