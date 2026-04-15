"use client";

import { useMemo, useState } from "react";
import type { ResultEntry } from "@/lib/types";
import { matchExercises, resolvePattern, buildTodaysProgram } from "@/exercise/matcher";
import type { PrescribedExercise } from "@/exercise/matcher";

interface Props {
  client: string;
  results: ResultEntry[];
  agg: {
    topTier: ResultEntry[];
    breakouts: Map<string, ResultEntry[]>;
    terminalDiagnoses: ResultEntry[];
  };
}

interface ProgramEntry {
  diagnosis: string;
  side: string;
  exercises: { name: string; description: string; category: string }[];
}

type ProgramTab = "today" | "full";

export default function ProgramReport({ client, agg }: Props) {
  const [programTab, setProgramTab] = useState<ProgramTab>("today");
  const date = new Date().toLocaleDateString("en-AU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const todaysProgram: PrescribedExercise[] = useMemo(
    () => buildTodaysProgram(agg.terminalDiagnoses),
    [agg.terminalDiagnoses]
  );

  const program: ProgramEntry[] = useMemo(() => {
    const entries: ProgramEntry[] = [];

    for (const r of agg.terminalDiagnoses) {
      const pattern = resolvePattern(r.pattern);
      const matched = matchExercises([r], pattern);

      let side = "";
      if (r.test.endsWith(" L")) side = " [LEFT]";
      else if (r.test.endsWith(" R")) side = " [RIGHT]";

      if (matched.length > 0) {
        entries.push({
          diagnosis: r.diag || "",
          side,
          exercises: matched.slice(0, 5).map((e) => ({
            name: e.name,
            description: e.description,
            category: e.category,
          })),
        });
      }
    }

    return entries;
  }, [agg.terminalDiagnoses]);

  const hasExercises = todaysProgram.length > 0 || program.length > 0;

  return (
    <div className="p-6">
      <div className="bg-spark-program text-white rounded-md px-6 py-4 text-center mb-2">
        <h1 className="text-lg font-bold tracking-wider">
          IN-HOUSE CLINICAL PROGRAM
        </h1>
      </div>
      <div className="flex justify-between px-1 py-2 text-sm font-bold text-slate-700 mb-4">
        <span>PATIENT: {client}</span>
        <span>DATE: {date}</span>
      </div>

      {!hasExercises ? (
        <div className="text-center text-slate-400 italic py-8 text-sm">
          No terminal diagnoses &mdash; no corrective exercises needed.
        </div>
      ) : (
        <>
          <div className="flex gap-2 mb-5">
            <button
              onClick={() => setProgramTab("today")}
              className={`flex-1 py-2 rounded-md text-sm font-bold transition-all ${
                programTab === "today"
                  ? "bg-spark-program text-white"
                  : "bg-slate-200 text-slate-600 hover:bg-slate-300"
              }`}
            >
              Today&apos;s Program
            </button>
            <button
              onClick={() => setProgramTab("full")}
              className={`flex-1 py-2 rounded-md text-sm font-bold transition-all ${
                programTab === "full"
                  ? "bg-spark-program text-white"
                  : "bg-slate-200 text-slate-600 hover:bg-slate-300"
              }`}
            >
              Full Exercise Library
            </button>
          </div>

          {programTab === "today" && (
            <div>
              <div className="bg-slate-700 text-white rounded-md px-4 py-2.5 text-center font-bold text-sm mb-1 tracking-wide">
                TODAY&apos;S PROGRAM
              </div>
              <div className="text-xs text-slate-400 text-center mb-3">
                {todaysProgram.length} prioritized exercises &middot; MD (mobility) addressed first, then SMCD (motor control)
              </div>

              {todaysProgram.length === 0 ? (
                <div className="text-center text-slate-400 italic py-6 text-sm">
                  No exercises matched the current findings.
                </div>
              ) : (
                <div className="space-y-3">
                  {todaysProgram.map((rx, i) => (
                    <div
                      key={i}
                      className="border border-slate-200 rounded-lg overflow-hidden"
                    >
                      <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-sm text-slate-800">
                              {i + 1}. {rx.exercise.name}
                            </span>
                            {rx.side && (
                              <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-bold">
                                {rx.side}
                              </span>
                            )}
                            <span className={`text-xs px-1.5 py-0.5 rounded font-bold ${
                              rx.exercise.dysfunctionType === "MD"
                                ? "bg-orange-100 text-orange-700"
                                : "bg-blue-100 text-blue-700"
                            }`}>
                              {rx.exercise.dysfunctionType}
                            </span>
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5">
                            {rx.exercise.category}
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-sm font-bold text-spark-program">
                            {rx.sets} &times; {rx.reps}
                          </div>
                        </div>
                      </div>
                      <div className="px-4 py-3">
                        <div className="text-sm text-slate-600 italic">
                          {rx.exercise.description}
                        </div>
                        <div className="text-xs text-slate-400 mt-1.5">
                          For: {rx.forDiagnosis}
                        </div>
                        <div className="mt-2 h-20 bg-slate-50 rounded border border-dashed border-slate-300 flex items-center justify-center text-slate-400 text-xs">
                          GIF placeholder
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {programTab === "full" && (
            <div>
              <div className="bg-slate-700 text-white rounded-md px-4 py-2.5 text-center font-bold text-sm mb-3 tracking-wide">
                FULL EXERCISE LIBRARY (BY DIAGNOSIS)
              </div>

              <div className="space-y-4">
                {program.map((p, i) => (
                  <div
                    key={i}
                    className="border border-slate-200 rounded-lg overflow-hidden"
                  >
                    <div className="bg-slate-100 px-4 py-2.5 font-bold text-sm text-slate-700 border-b border-slate-200">
                      {p.diagnosis}
                      {p.side && (
                        <span className="text-blue-600 ml-1">{p.side}</span>
                      )}
                    </div>
                    <div className="divide-y divide-slate-100">
                      {p.exercises.map((ex, j) => (
                        <div key={j} className="px-4 py-3">
                          <div className="font-bold text-sm text-slate-800">
                            {ex.name}
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5">
                            {ex.category}
                          </div>
                          <div className="text-sm text-slate-600 italic mt-1">
                            {ex.description}
                          </div>
                          <div className="mt-2 h-24 bg-slate-50 rounded border border-dashed border-slate-300 flex items-center justify-center text-slate-400 text-xs">
                            GIF placeholder
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
