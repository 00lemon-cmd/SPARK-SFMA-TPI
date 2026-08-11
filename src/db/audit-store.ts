import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { APP_SECURITY } from "@/lib/security-config";

export type AuditAction =
  | "assessment_started"
  | "assessment_saved"
  | "assessment_deleted"
  | "report_viewed"
  | "swing_audit_started"
  | "tpi_quick_started"
  | "pdf_export_audit"
  | "pdf_export_program"
  | "pdf_export_tpi"
  | "pdf_export_all"
  | "send_to_training_app"
  | "audit_log_exported"
  | "staff_logout";

export interface AuditLogEntry {
  id: string;
  ts: string;
  action: AuditAction;
  client?: string;
  notes?: string;
}

interface AuditStore {
  logs: AuditLogEntry[];
  add: (entry: Omit<AuditLogEntry, "id" | "ts">) => void;
  clear: () => void;
}

export const useAuditStore = create<AuditStore>()(
  persist(
    (set, get) => ({
      logs: [],
      add(entry) {
        const next: AuditLogEntry = {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
          ts: new Date().toISOString(),
          ...entry,
        };
        const combined = [next, ...get().logs];
        set({ logs: combined.slice(0, APP_SECURITY.maxAuditEntries) });
      },
      clear() {
        set({ logs: [] });
      },
    }),
    {
      name: "spark-sfma-audit-log",
      storage: createJSONStorage(() => {
        if (typeof window === "undefined") {
          return {
            getItem: () => null,
            setItem: () => {},
            removeItem: () => {},
          };
        }
        return localStorage;
      }),
    }
  )
);
