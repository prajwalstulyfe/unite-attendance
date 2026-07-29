"use client";

import { useState, useEffect } from "react";

/**
 * Centralized URL configuration for all Unite Attendance portals.
 *
 * In production, URLs are set via NEXT_PUBLIC_ env vars at build time.
 * In local dev (localhost), they fallback to localhost ports.
 */
export function usePortalUrls() {
  const [urls, setUrls] = useState({
    admin: process.env.NEXT_PUBLIC_ADMIN_URL || "https://admin.unite-attendance.com",
    kiosk: process.env.NEXT_PUBLIC_KIOSK_URL || "https://kiosk.unite-attendance.com",
    app: process.env.NEXT_PUBLIC_APP_URL || "https://app.unite-attendance.com",
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
      if (isLocal) {
        setUrls({
          admin: "http://localhost:3002",
          kiosk: "http://localhost:3003",
          app: "http://localhost:3004",
        });
      }
    }
  }, []);

  return urls;
}
