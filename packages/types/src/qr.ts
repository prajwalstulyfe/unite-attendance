// ═══════════════════════════════════════════════════════════════
// Unite Attendance — QR Code Types
// ═══════════════════════════════════════════════════════════════

import type { QRType } from './enums';

/** QR code entity */
export interface QRCode {
  id: string;
  memberId: string;
  orgId: string;
  qrToken: string;
  qrImageUrl: string | null;
  type: QRType;
  isActive: boolean;
  expiresAt: string | null;
  createdAt: string;
}

/** QR code with member info */
export interface QRCodeWithMember extends QRCode {
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

/** JWT payload embedded in QR code token */
export interface QRPayload {
  sub: string; // memberId
  org: string; // orgId
  type: QRType;
  iat: number;
  exp: number;
}

/** Generate QR request */
export interface GenerateQRRequest {
  memberId: string;
  type: QRType;
  expiresInDays?: number; // default: 365
}

/** Bulk generate QR request */
export interface BulkGenerateQRRequest {
  memberIds?: string[]; // if empty, generate for all members without active QR
  type: QRType;
  expiresInDays?: number;
}

/** Bulk generate result */
export interface BulkGenerateQRResult {
  totalRequested: number;
  generated: number;
  skipped: number;
  errors: Array<{
    memberId: string;
    memberName: string;
    reason: string;
  }>;
}

/** QR validation result */
export interface QRValidationResult {
  isValid: boolean;
  memberId: string | null;
  orgId: string | null;
  type: QRType | null;
  error: string | null;
}
