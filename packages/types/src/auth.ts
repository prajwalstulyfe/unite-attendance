// ═══════════════════════════════════════════════════════════════
// Unite Attendance — Auth Types
// ═══════════════════════════════════════════════════════════════

import type { GlobalRole, OrgRole } from './enums';

/** User entity as returned by the API */
export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  globalRole: GlobalRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/** Authenticated session data */
export interface Session {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
}

/** JWT access token payload */
export interface AccessTokenPayload {
  sub: string; // userId
  email: string;
  globalRole: GlobalRole;
  iat: number;
  exp: number;
}

/** JWT refresh token payload */
export interface RefreshTokenPayload {
  sub: string; // userId
  jti: string; // unique token ID
  iat: number;
  exp: number;
}

/** User's membership in an org (with role context) */
export interface UserOrgMembership {
  orgId: string;
  orgName: string;
  orgSlug: string;
  orgLogo: string | null;
  role: OrgRole;
  memberId: string;
  departmentName: string | null;
  branchName: string | null;
}

/** Login request */
export interface LoginRequest {
  email: string;
  password: string;
}

/** Register request */
export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

/** Login response */
export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  organizations: UserOrgMembership[];
}

/** Google OAuth request */
export interface GoogleAuthRequest {
  idToken: string;
}

/** Refresh token request */
export interface RefreshTokenRequest {
  refreshToken: string;
}
