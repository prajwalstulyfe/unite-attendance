import type { Metadata, Viewport } from "next";
import "./globals.css";
import { QueryProvider } from "@repo/api-client";
import { ThemeAwareToaster } from "../components/theme-aware-toaster";
import { ThemeProvider } from "next-themes";
import { PwaRegister } from "../components/pwa-register";

export const metadata: Metadata = {
  title: {
    default: "Unite Attendance — Enterprise Control Center",
    template: "%s | Unite Attendance",
  },
  description:
    "Next-generation enterprise attendance management, telemetry tracking, and dynamic QR verification platform.",
  applicationName: "Unite Attendance",
  authors: [{ name: "Unite India", url: "https://unite-attendance.com" }],
  keywords: ["Attendance", "Telemetry", "Dynamic QR", "Geofencing", "Enterprise", "PWA"],
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://unite-attendance.com",
    siteName: "Unite Attendance",
    title: "Unite Attendance — Enterprise Control Center",
    description:
      "Next-generation enterprise attendance management, telemetry tracking, and dynamic QR verification platform.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Unite Attendance Dashboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Unite Attendance — Enterprise Control Center",
    description:
      "Next-generation enterprise attendance management, telemetry tracking, and dynamic QR verification platform.",
    images: ["/og-image.png"],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Unite Admin",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 min-h-screen transition-colors duration-200">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <QueryProvider>
            <PwaRegister />
            {children}
            <ThemeAwareToaster position="top-right" />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
