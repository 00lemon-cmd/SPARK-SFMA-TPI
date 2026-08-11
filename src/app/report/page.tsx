"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import type { Handedness, ResultEntry } from "@/lib/types";
import { aggregateDiagnoses } from "@/engine/diagnosis-aggregator";
import { useAuditStore } from "@/db/audit-store";
import { useAssessmentStore } from "@/db/assessment-store";
import ClinicalAudit from "@/report/clinical-audit";
import ProgramReport from "@/report/program";
import TPICrossRef from "@/report/tpi-crossref";
import {
  exportClinicalAuditPDF,
  exportProgramPDF,
  exportTPICrossRefPDF,
} from "@/report/pdf-export";
import {
  buildCompletedAssessmentPayload,
  sendAssessmentToTrainingApp,
} from "@/lib/training-app-handoff";

type Tab = "audit" | "program" | "tpi";

function ReportContent() {
  const params = useSearchParams();
  const getById = useAssessmentStore((s) => s.getById);

  const assessment = useMemo(() => {
    const idParam = params.get("id");
    if (idParam) {
      return getById(Number(idParam));
    }
    return undefined;
  }, [params, getById]);

  const client = assessment?.client ?? params.get("client") ?? "Unknown";
  const hand = (assessment?.handedness ?? params.get("hand") ?? "right") as Handedness;
  const results: ResultEntry[] = useMemo(() => {
    if (assessment) return assessment.results;
    try {
      return JSON.parse(params.get("results") || "[]");
    } catch {
      return [];
    }
  }, [assessment, params]);

  const [tab, setTab] = useState<Tab>("audit");
  const [handoffNote, setHandoffNote] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const agg = useMemo(() => aggregateDiagnoses(results), [results]);
  const addAudit = useAuditStore((s) => s.add);

  async function handleSendToTrainingApp() {
    setSending(true);
    setHandoffNote(null);
    try {
      const payload = buildCompletedAssessmentPayload({
        id: assessment?.id,
        client,
        handedness: hand,
        date: assessment?.date,
        results,
      });
      const mode = await sendAssessmentToTrainingApp(payload);
      addAudit({ action: "send_to_training_app", client });
      setHandoffNote(
        mode === "opened"
          ? "Opened the training app with this assessment loaded."
          : "Assessment JSON copied — paste it under Import on the training app SFMA page (URL was too large for a direct handoff).",
      );
    } catch (err) {
      setHandoffNote(
        err instanceof Error ? err.message : "Could not open the training app.",
      );
    } finally {
      setSending(false);
    }
  }

  const tabs: { id: Tab; label: string; color: string }[] = [
    { id: "audit", label: "Clinical Audit", color: "bg-spark-audit" },
    { id: "program", label: "Exercise Program", color: "bg-spark-program" },
    { id: "tpi", label: "TPI Cross-Reference", color: "bg-blue-700" },
  ];

  if (results.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-slate-500 font-bold text-lg">
          No assessment data found.
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-start justify-center px-5 pt-10 pb-20">
      <div className="w-full max-w-[900px]">
        <div className="text-center mb-6">
          <div className="text-3xl mb-1">&#x2705;</div>
          <h2 className="text-xl font-bold text-slate-800">
            Assessment Complete
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Patient: <b>{client}</b> &middot;{" "}
            {new Date().toLocaleDateString("en-AU", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>

        <div className="flex gap-2 mb-6 justify-center flex-wrap">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-5 py-2.5 rounded-md text-sm font-bold uppercase tracking-wide transition-all ${
                tab === t.id
                  ? `${t.color} text-white shadow-md`
                  : "bg-slate-200 text-slate-600 hover:bg-slate-300"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="rounded-xl bg-white shadow-lg overflow-hidden">
          {tab === "audit" && (
            <ClinicalAudit
              client={client}
              agg={agg}
              results={results}
            />
          )}
          {tab === "program" && (
            <ProgramReport
              client={client}
              results={results}
              agg={agg}
            />
          )}
          {tab === "tpi" && (
            <TPICrossRef
              client={client}
              handedness={hand}
              agg={agg}
              assessmentResults={results}
            />
          )}
        </div>

        <div className="flex gap-3 mt-6 justify-center flex-wrap">
          <button
            onClick={() => void handleSendToTrainingApp()}
            disabled={sending}
            className="px-5 py-3 rounded-md bg-spark-breakout text-white font-bold text-sm hover:brightness-110 transition-all disabled:opacity-50"
          >
            {sending ? "Sending…" : "Send to Training App"}
          </button>
          <button
            onClick={() => {
              addAudit({ action: "pdf_export_audit", client });
              exportClinicalAuditPDF(client, agg, results);
            }}
            className="px-5 py-3 rounded-md bg-spark-audit text-white font-bold text-sm hover:brightness-110 transition-all"
          >
            Export Audit PDF
          </button>
          <button
            onClick={() => {
              addAudit({ action: "pdf_export_program", client });
              exportProgramPDF(client, agg);
            }}
            className="px-5 py-3 rounded-md bg-spark-program text-white font-bold text-sm hover:brightness-110 transition-all"
          >
            Export Program PDF
          </button>
          <button
            onClick={() => {
              addAudit({ action: "pdf_export_tpi", client });
              exportTPICrossRefPDF(client, hand, agg);
            }}
            className="px-5 py-3 rounded-md bg-blue-700 text-white font-bold text-sm hover:brightness-110 transition-all"
          >
            Export TPI PDF
          </button>
          <button
            onClick={() => {
              addAudit({ action: "pdf_export_all", client });
              exportClinicalAuditPDF(client, agg, results);
              exportProgramPDF(client, agg);
              exportTPICrossRefPDF(client, hand, agg);
            }}
            className="px-5 py-3 rounded-md bg-slate-700 text-white font-bold text-sm hover:bg-slate-800 transition-colors"
          >
            Download All PDFs
          </button>
          <button
            onClick={() => (window.location.href = "/")}
            className="px-5 py-3 rounded-md bg-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-300 transition-colors"
          >
            New Patient
          </button>
        </div>

        {handoffNote && (
          <p className="mt-4 text-center text-sm text-slate-600 max-w-xl mx-auto">
            {handoffNote}
          </p>
        )}
      </div>
    </div>
  );
}

export default function ReportPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-slate-500 font-bold">
            Compiling reports...
          </div>
        </div>
      }
    >
      <ReportContent />
    </Suspense>
  );
}
