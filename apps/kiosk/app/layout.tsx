import type { Metadata } from "next";
import "./globals.css";
import { QueryProvider } from "@repo/api-client";
import { ThemeAwareToaster } from "@/components/theme-aware-toaster";

export const metadata: Metadata = {
  title: "Unite Kiosk Scanner",
  description: "QR Attendance Scanner Kiosk Device App",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-zinc-950 text-zinc-100 h-screen w-screen overflow-hidden">
        <QueryProvider>
          {children}
          <ThemeAwareToaster position="top-center" />
        </QueryProvider>
      </body>
    </html>
  );
}
