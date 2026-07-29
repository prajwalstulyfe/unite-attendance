// ═══════════════════════════════════════════════════════════════
// Unite Attendance — API Response Types
// ═══════════════════════════════════════════════════════════════

/** Standard API success response */
export interface ApiResponse<T> {
  success: true;
  data: T;
  message?: string;
  timestamp: string;
}

/** Standard API error response */
export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
    statusCode: number;
  };
  timestamp: string;
}

/** Paginated response wrapper */
export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

/** Common pagination query params */
export interface PaginationQuery {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

/** Common error codes */
export const ErrorCodes = {
  // Auth
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  EMAIL_ALREADY_EXISTS: 'EMAIL_ALREADY_EXISTS',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  TOKEN_INVALID: 'TOKEN_INVALID',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',

  // Organization
  ORG_NOT_FOUND: 'ORG_NOT_FOUND',
  ORG_SLUG_TAKEN: 'ORG_SLUG_TAKEN',
  ORG_INACTIVE: 'ORG_INACTIVE',
  PLAN_LIMIT_REACHED: 'PLAN_LIMIT_REACHED',

  // Member
  MEMBER_NOT_FOUND: 'MEMBER_NOT_FOUND',
  MEMBER_ALREADY_EXISTS: 'MEMBER_ALREADY_EXISTS',
  MEMBER_INACTIVE: 'MEMBER_INACTIVE',

  // QR
  QR_NOT_FOUND: 'QR_NOT_FOUND',
  QR_EXPIRED: 'QR_EXPIRED',
  QR_INACTIVE: 'QR_INACTIVE',
  QR_ALREADY_EXISTS: 'QR_ALREADY_EXISTS',

  // Attendance
  DUPLICATE_SCAN: 'DUPLICATE_SCAN',
  NON_WORKING_DAY: 'NON_WORKING_DAY',
  HOLIDAY: 'HOLIDAY',
  GPS_REQUIRED: 'GPS_REQUIRED',
  OUT_OF_GPS_RANGE: 'OUT_OF_GPS_RANGE',
  LATE_CHECKIN: 'LATE_CHECKIN',
  OUTSIDE_WORKING_HOURS: 'OUTSIDE_WORKING_HOURS',

  // General
  NOT_FOUND: 'NOT_FOUND',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
} as const;

export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];
