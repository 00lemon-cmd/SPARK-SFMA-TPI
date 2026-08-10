"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Handedness } from "@/lib/types";
import { useAssessmentStore } from "@/db/assessment-store";
import { useAuditStore } from "@/db/audit-store";
import { getRetentionDays, clearAuthentication } from "@/lib/security-config";

type Step = "intake" | "choose";

export default function IntakePage() {
  const [step, setStep] = useState<Step>("intake");
  const [name, setName] = useState("");
  const [handedness, setHandedness] = useState<Handedness>("right");
  const [consentConfirmed, setConsentConfirmed] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const router = useRouter();
  const assessments = useAssessmentStore((s) => s.assessments);
  const removeAssessment = useAssessmentStore((s) => s.remove);
  const pruneExpired = useAssessmentStore((s) => s.pruneExpired);
  const logs = useAuditStore((s) => s.logs);
  const addAudit = useAuditStore((s) => s.add);
  const clearAudit = useAuditStore((s) => s.clear);
  const retentionDays = useMemo(() => getRetentionDays(), []);

  useEffect(() => {
    pruneExpired();
  }, [pruneExpired]);

  function proceedToChoose() {
    if (!name.trim()) return alert("Patient name is required");
    if (!consentConfirmed) {
      return alert("Confirm informed consent and data handling before starting.");
    }
    setStep("choose");
  }

  function startSFMA() {
    addAudit({ action: "assessment_started", client: name.trim() });
    const params = new URLSearchParams({ client: name.trim(), hand: handedness });
    router.push(`/assessment?${params.toString()}`);
  }

  function startSwingAudit() {
    addAudit({ action: "swing_audit_started", client: name.trim() });
    const params = new URLSearchParams({ client: name.trim(), hand: handedness });
    router.push(`/swing-audit?${params.toString()}`);
  }

  function startTpiQuick() {
    addAudit({ action: "tpi_quick_started", client: name.trim() });
    const params = new URLSearchParams({ client: name.trim(), hand: handedness });
    router.push(`/tpi-quick?${params.toString()}`);
  }

  function viewReport(a: (typeof assessments)[0]) {
    addAudit({ action: "report_viewed", client: a.client });
    router.push(`/report?id=${a.id}`);
  }

  function exportAuditLog() {
    const payload = JSON.stringify(logs, null, 2);
    const blob = new Blob([payload], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `spark-audit-log-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    addAudit({ action: "audit_log_exported", notes: `entries=${logs.length}` });
  }

  function logout() {
    setLoggingOut(true);
    addAudit({ action: "staff_logout" });
    clearAuthentication();
    window.location.href = "/sfma/login";
    setLoggingOut(false);
  }

  return (
    <div className="flex min-h-screen items-start justify-center px-5 pt-10 pb-20">
      <div className="w-full max-w-[600px] space-y-6">
        <div className="rounded-xl bg-spark-card p-6 shadow-lg text-center">
          <div className="rounded-md bg-spark-primary px-4 py-4 text-white font-bold text-lg tracking-wide mb-5">
            SPARK CLINICAL INTAKE
          </div>

          {step === "intake" && (
            <>
              <div className="mb-4 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-left text-xs text-amber-900">
                <p className="font-bold mb-1">Clinical use notice</p>
                <p>
                  This tool is decision support for qualified clinicians. Confirm consent before assessment and
                  avoid identifiable notes beyond required patient name.
                </p>
                <p className="mt-1">
                  Local assessments auto-retain for {retentionDays} days.
                </p>
              </div>
              <div className="bg-white rounded-lg border border-slate-200 p-5 mb-5 space-y-4">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Patient Full Name"
                  className="w-full rounded-md border border-slate-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-spark-primary/40"
                  onKeyDown={(e) => e.key === "Enter" && proceedToChoose()}
                />
                <div className="flex items-center justify-center gap-6 text-sm font-semibold text-slate-600">
                  <span>Dominant Hand:</span>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input type="radio" name="hand" checked={handedness === "right"} onChange={() => setHandedness("right")} className="accent-spark-primary" />
                    Right
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input type="radio" name="hand" checked={handedness === "left"} onChange={() => setHandedness("left")} className="accent-spark-primary" />
                    Left
                  </label>
                </div>
                <label className="flex items-start gap-2 text-xs text-slate-600 text-left">
                  <input
                    type="checkbox"
                    checked={consentConfirmed}
                    onChange={(e) => setConsentConfirmed(e.target.checked)}
                    className="mt-0.5 accent-spark-primary"
                  />
                  <span>
                    I confirm informed consent has been obtained and clinic policy permits entry of this patient data.
                  </span>
                </label>
              </div>
              <button onClick={proceedToChoose} className="w-full rounded-md bg-spark-fn py-4 text-white font-bold text-base uppercase tracking-wide hover:brightness-110 active:scale-[0.98] transition-all">
                Continue
              </button>
            </>
          )}

          {step === "choose" && (
            <>
              <div className="mb-4 rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                <span className="font-bold">{name.trim()}</span>
                <span className="text-slate-400 mx-2">&middot;</span>
                <span>{handedness === "right" ? "Right" : "Left"}-handed</span>
              </div>
              <p className="text-sm text-slate-500 mb-5">Choose an assessment pathway:</p>
              <div className="space-y-3">
                <button
                  onClick={startTpiQuick}
                  className="w-full rounded-lg border-2 border-indigo-600 bg-indigo-50 p-5 text-left hover:bg-indigo-100 transition-all group"
                >
                  <div className="font-bold text-indigo-900 text-base mb-1 group-hover:text-indigo-950">
                    TPI quick lookup
                  </div>
                  <p className="text-xs text-indigo-700/85">
                    Dashboard of all swing characteristics: instant SFMA priorities, Level 1 screens,
                    BSC-related patterns, and starter exercises — no SFMA session required.
                  </p>
                </button>
                <button
                  onClick={startSwingAudit}
                  className="w-full rounded-lg border-2 border-blue-600 bg-blue-50 p-5 text-left hover:bg-blue-100 transition-all group"
                >
                  <div className="font-bold text-blue-800 text-base mb-1 group-hover:text-blue-900">
                    TPI Swing Audit
                  </div>
                  <p className="text-xs text-blue-600/80">
                    Select observed swing faults to identify underlying dysfunctions and recommended SFMA tests.
                  </p>
                </button>
                <button
                  onClick={startSFMA}
                  className="w-full rounded-lg border-2 border-spark-primary bg-orange-50 p-5 text-left hover:bg-orange-100 transition-all group"
                >
                  <div className="font-bold text-spark-primary text-base mb-1 group-hover:brightness-110">
                    Full SFMA Assessment
                  </div>
                  <p className="text-xs text-orange-600/80">
                    Run the complete SFMA top-tier screen with automatic breakouts, diagnoses, and TPI cross-referencing.
                  </p>
                </button>
              </div>
              <button
                onClick={() => setStep("intake")}
                className="mt-4 text-xs text-slate-400 hover:text-slate-600 font-bold"
              >
                &larr; Back to client details
              </button>
            </>
          )}
        </div>

        <div className="rounded-xl bg-white p-5 shadow-lg">
          <h2 className="font-bold text-slate-700 text-sm uppercase tracking-wide mb-3 border-b border-slate-200 pb-2">
            Staff Controls
          </h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={exportAuditLog}
              className="px-3 py-2 bg-slate-700 text-white text-xs font-bold rounded hover:bg-slate-800 transition-colors"
            >
              Export Audit Log (JSON)
            </button>
            <button
              onClick={() => {
                if (confirm("Clear local audit log on this device?")) clearAudit();
              }}
              className="px-3 py-2 bg-slate-200 text-slate-700 text-xs font-bold rounded hover:bg-slate-300 transition-colors"
            >
              Clear Audit Log
            </button>
            <button
              onClick={logout}
              disabled={loggingOut}
              className="px-3 py-2 bg-red-600 text-white text-xs font-bold rounded hover:bg-red-700 disabled:opacity-60 transition-colors"
            >
              {loggingOut ? "Signing out..." : "Sign Out"}
            </button>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Audit entries on this device: <b>{logs.length}</b>
          </p>
        </div>

        {assessments.length > 0 && (
          <div className="rounded-xl bg-white p-5 shadow-lg">
            <h2 className="font-bold text-slate-700 text-sm uppercase tracking-wide mb-3 border-b border-slate-200 pb-2">
              Recent Assessments
            </h2>
            <div className="space-y-2 max-h-[350px] overflow-y-auto">
              {assessments.slice(0, 20).map((a) => (
                <div
                  key={a.id}
                  className="flex items-center justify-between bg-slate-50 rounded-lg px-4 py-3 border border-slate-100"
                >
                  <div>
                    <div className="font-bold text-sm text-slate-800">{a.client}</div>
                    <div className="text-xs text-slate-400">
                      {new Date(a.date).toLocaleDateString("en-AU", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      {" · "}
                      {a.results.filter((r) => r.phase === "TOP_TIER").length} top-tier,{" "}
                      {a.results.filter((r) => r.diag).length} diagnoses
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => viewReport(a)}
                      className="px-3 py-1.5 bg-spark-primary text-white text-xs font-bold rounded hover:brightness-110 transition-all"
                    >
                      View
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete assessment for ${a.client}?`)) {
                          removeAssessment(a.id!);
                          addAudit({ action: "assessment_deleted", client: a.client });
                        }
                      }}
                      className="px-3 py-1.5 bg-red-100 text-red-600 text-xs font-bold rounded hover:bg-red-200 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
