export const APP_SECURITY = {
  authStorageKey: "spark_staff_auth",
  authExpiryDays: 7,
  defaultRetentionDays: 90,
  maxAuditEntries: 2000,
} as const;

export function getRetentionDays(): number {
  const raw = process.env.NEXT_PUBLIC_RETENTION_DAYS;
  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed < 1 || parsed > 3650) {
    return APP_SECURITY.defaultRetentionDays;
  }
  return Math.floor(parsed);
}

export function getStaffPassword(): string {
  return process.env.NEXT_PUBLIC_STAFF_PASSWORD ?? "";
}

export function isAppEnabled(): boolean {
  const flag = process.env.NEXT_PUBLIC_APP_ENABLED;
  if (flag === undefined || flag === "") return true;
  return flag === "true" || flag === "1";
}

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  const stored = localStorage.getItem(APP_SECURITY.authStorageKey);
  if (!stored) return false;
  try {
    const { expiry } = JSON.parse(stored) as { expiry: number };
    if (Date.now() > expiry) {
      localStorage.removeItem(APP_SECURITY.authStorageKey);
      return false;
    }
    return true;
  } catch {
    localStorage.removeItem(APP_SECURITY.authStorageKey);
    return false;
  }
}

export function setAuthenticated(): void {
  const expiry = Date.now() + APP_SECURITY.authExpiryDays * 24 * 60 * 60 * 1000;
  localStorage.setItem(APP_SECURITY.authStorageKey, JSON.stringify({ expiry }));
}

export function clearAuthentication(): void {
  localStorage.removeItem(APP_SECURITY.authStorageKey);
}
