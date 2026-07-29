// ═══════════════════════════════════════════════════════════════
// Unite Attendance — Token Storage
// Stores JWT tokens in memory + localStorage for persistence
// ═══════════════════════════════════════════════════════════════

const STORAGE_KEYS = {
  ACCESS_TOKEN: 'ua_access_token',
  REFRESH_TOKEN: 'ua_refresh_token',
} as const;

class TokenStorage {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  constructor() {
    // Hydrate from localStorage on initialization (client-side only)
    if (typeof window !== 'undefined') {
      this.accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      this.refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    }
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  getRefreshToken(): string | null {
    return this.refreshToken;
  }

  setTokens(accessToken: string, refreshToken: string): void {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;

    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    }
  }

  setAccessToken(accessToken: string): void {
    this.accessToken = accessToken;
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    }
  }

  clear(): void {
    this.accessToken = null;
    this.refreshToken = null;

    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    }
  }

  isAuthenticated(): boolean {
    return this.accessToken !== null;
  }
}

export const tokenStorage = new TokenStorage();
