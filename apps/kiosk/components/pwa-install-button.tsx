"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { toast } from "sonner";

export function PwaInstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        toast.success("Thank you for installing Kiosk Terminal App!");
      }
      setDeferredPrompt(null);
    } else {
      toast.info("Kiosk PWA is installed or ready via browser menu.");
    }
  };

  return (
    <button
      onClick={handleInstallClick}
      className="inline-flex items-center gap-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all"
    >
      <Download className="h-4 w-4" /> Install Kiosk PWA
    </button>
  );
}
