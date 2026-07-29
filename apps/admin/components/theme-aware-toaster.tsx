"use client";

import { useEffect, useState } from "react";
import { Toaster as SonnerToaster } from "sonner";

export function ThemeAwareToaster(props: React.ComponentProps<typeof SonnerToaster>) {
  const [activeTheme, setActiveTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const updateTheme = () => {
      const isDark = document.documentElement.classList.contains("dark");
      setActiveTheme(isDark ? "dark" : "light");
    };

    updateTheme();

    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return <SonnerToaster theme={activeTheme} richColors {...props} />;
}
