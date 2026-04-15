"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Handedness } from "@/lib/types";
import { useAssessmentStore } from "@/db/assessment-store";

export default function IntakePage() {
  const [name, setName] = useState("");
  const [handedness, setHandedness] = useState<Handedness>("right");
  const router = useRouter();
  const assessments = useAssessmentStore((s) => s.assessments);
  const removeAssessment = useAssessmentStore((s) => s.remove);

  function start() {
    if (!name.trim()) return alert("Patient name is required");
    const params = new URLSearchParams({ client: name.trim(), hand: handedness });
    router.push(`/assessment?${params.toString()}`);
  }

  function viewReport(a: (typeof assessments)[0]) {
    const params = new URLSearchParams({
      client: a.client,
      hand: a.handedness,
      results: JSON.stringify(a.results),
    });
    router.push(`/report?${params.toString()}`);
  }

  return (
    <div className="flex min-h-screen items-start justify-center px-5 pt-10 pb-20">
      <div className="w-full max-w-[600px] space-y-6">
        <div className="rounded-xl bg-spark-card p-6 shadow-lg text-center">
          <div className="rounded-md bg-spark-primary px-4 py-4 text-white font-bold text-lg tracking-wide mb-5">
            SFMA CLINICAL INTAKE
          </div>
          <div className="bg-white rounded-lg border border-slate-200 p-5 mb-5 space-y-4">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Patient Full Name"
              className="w-full rounded-md border border-slate-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-spark-primary/40"
              onKeyDown={(e) => e.key === "Enter" && start()}
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
          </div>
          <button onClick={start} className="w-full rounded-md bg-spark-fn py-4 text-white font-bold text-base uppercase tracking-wide hover:brightness-110 active:scale-[0.98] transition-all">
            Start Assessment
          </button>
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
