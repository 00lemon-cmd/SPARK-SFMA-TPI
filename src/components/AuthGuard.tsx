"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  getStaffPassword,
  isAuthenticated,
  isAppEnabled,
} from "@/lib/security-config";

const PUBLIC_PATHS = ["/login", "/maintenance"];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isAppEnabled() && pathname !== "/maintenance") {
      router.replace("/maintenance");
      return;
    }

    const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p));
    if (isPublic) {
      setReady(true);
      return;
    }

    const needsAuth = Boolean(getStaffPassword());
    if (needsAuth && !isAuthenticated()) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    setReady(true);
  }, [pathname, router]);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-slate-400 font-bold text-sm">Loading...</div>
      </div>
    );
  }

  return <>{children}</>;
}
