import type { Metadata } from "next";
import "./globals.css";
import { QueryProvider } from "@repo/api-client";
import { ThemeAwareToaster } from "@/components/theme-aware-toaster";

export const metadata: Metadata = {
  title: "Unite Member App",
  description: "Employee and Student Attendance PWA",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-zinc-950 text-zinc-100 min-h-screen">
        <QueryProvider>
          {children}
          <ThemeAwareToaster position="bottom-center" />
        </QueryProvider>
      </body>
    </html>
  );
}
