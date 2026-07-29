import type { Metadata } from "next";
import "./globals.css";
import { Plus_Jakarta_Sans } from "next/font/google";
import { cn } from "@/lib/utils";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Unite Attendance - Attendance Made Simple",
  description: "Scalable, Secure, and Seamless Attendance Management for Educational Institutions and Organizations.",
  icons: {
    icon: "/uniteIcon.png",
    shortcut: "/uniteIcon.png",
    apple: "/uniteIcon.png",
  },
};

const themeInitScript = `
  (function() {
    try {
      var savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'dark' || (!savedTheme && true)) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {}
  })();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn(plusJakartaSans.variable)} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className={`${plusJakartaSans.className} antialiased`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
