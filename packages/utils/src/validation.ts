// ═══════════════════════════════════════════════════════════════
// Unite Attendance — Validation Utilities (Zod Schemas)
// ═══════════════════════════════════════════════════════════════
// Note: These are schema definitions only — Zod is a peer dependency
// that must be installed by consuming packages/apps.

/**
 * Shared validation patterns (used without Zod for environments where Zod isn't available)
 */
export const ValidationPatterns = {
  /** Email pattern (RFC 5322 simplified) */
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,

  /** Password: min 8 chars, at least 1 uppercase, 1 lowercase, 1 number */
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,

  /** Phone: Indian phone number */
  phone: /^(\+91)?[6-9]\d{9}$/,

  /** Slug: lowercase letters, numbers, and hyphens */
  slug: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,

  /** Time in HH:mm format */
  time: /^([01]\d|2[0-3]):([0-5]\d)$/,

  /** UUID v4 */
  uuid: /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,

  /** Employee ID: alphanumeric with dashes */
  employeeId: /^[A-Za-z0-9\-]+$/,
} as const;

/**
 * Validate an email address
 */
export function isValidEmail(email: string): boolean {
  return ValidationPatterns.email.test(email);
}

/**
 * Validate a password meets requirements
 */
export function isValidPassword(password: string): boolean {
  return ValidationPatterns.password.test(password);
}

/**
 * Validate an Indian phone number
 */
export function isValidPhone(phone: string): boolean {
  return ValidationPatterns.phone.test(phone);
}

/**
 * Validate a slug
 */
export function isValidSlug(slug: string): boolean {
  return ValidationPatterns.slug.test(slug);
}

/**
 * Validate a time string (HH:mm)
 */
export function isValidTime(time: string): boolean {
  return ValidationPatterns.time.test(time);
}

/**
 * Get password validation errors (for showing to user)
 */
export function getPasswordErrors(password: string): string[] {
  const errors: string[] = [];
  if (password.length < 8) errors.push('Must be at least 8 characters');
  if (!/[a-z]/.test(password)) errors.push('Must contain a lowercase letter');
  if (!/[A-Z]/.test(password)) errors.push('Must contain an uppercase letter');
  if (!/\d/.test(password)) errors.push('Must contain a number');
  return errors;
}
