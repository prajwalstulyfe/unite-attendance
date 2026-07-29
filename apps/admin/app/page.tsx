"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { tokenStorage } from "@repo/api-client";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    const token = tokenStorage.getAccessToken();
    if (!token) {
      router.replace("/login");
    } else {
      router.replace("/dashboard");
    }
  }, [router]);

  return null;
}
