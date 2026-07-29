// ═══════════════════════════════════════════════════════════════
// Unite Attendance — Formatter Utilities
// ═══════════════════════════════════════════════════════════════

/**
 * Format a number with comma separators (Indian numbering system)
 * @example formatNumber(1234567) → "12,34,567"
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-IN').format(num);
}

/**
 * Format currency in INR
 * @example formatCurrency(999) → "₹999"
 * @example formatCurrency(12500) → "₹12,500"
 */
export function formatCurrency(amount: number, currency = 'INR'): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format a percentage
 * @example formatPercentage(85.456) → "85.5%"
 */
export function formatPercentage(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Generate initials from a name (for avatar fallback)
 * @example getInitials("Prajwal Kumar") → "PK"
 * @example getInitials("John") → "J"
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .slice(0, 2)
    .join('');
}

/**
 * Truncate a string with ellipsis
 * @example truncate("Hello World", 5) → "Hello..."
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return `${str.slice(0, maxLength)}...`;
}

/**
 * Generate a URL-friendly slug from a string
 * @example slugify("My Organization Name") → "my-organization-name"
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Capitalize first letter of each word
 * @example titleCase("hello world") → "Hello World"
 */
export function titleCase(str: string): string {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
}

/**
 * Format file size in human readable format
 * @example formatFileSize(1024) → "1 KB"
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const size = bytes / Math.pow(k, i);
  return `${size.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

/**
 * Format a plan limit value for display
 * @example formatLimit(-1) → "Unlimited"
 * @example formatLimit(25) → "25"
 */
export function formatLimit(limit: number): string {
  return limit === -1 ? 'Unlimited' : formatNumber(limit);
}
