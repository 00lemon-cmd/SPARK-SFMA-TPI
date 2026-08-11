"use client";

import { useMemo, useState } from "react";
import type { ResultEntry, Score } from "@/lib/types";
import { TT_ORDER } from "@/engine/top-tier";
import { buildTopTierProgress } from "@/engine/breakout-tree-view";
import { getTestCriteria } from "@/engine/test-criteria";
import { getTestSetup } from "@/engine/test-setup";

function scoreBadgeClass(score: Score): string {
  if (score === "FN") return "bg-emerald-100 text-emerald-700 border-emerald-300";
  if (score === "DN") return "bg-amber-100 text-amber-800 border-amber-300";
  if (score === "DP") return "bg-orange-100 text-orange-800 border-orange-300";
  return "bg-red-100 text-red-700 border-red-300";
}

function scoreDotClass(score?: Score): string {
  if (!score) return "bg-slate-300";
  if (score === "FN") return "bg-spark-fn";
  if (score === "DN") return "bg-spark-dn";
  if (score === "DP") return "bg-spark-dp";
  return "bg-spark-fp";
}

interface Props {
  mode: "TT" | "BO";
  currentTest: string;
  resultsLog: ResultEntry[];
  boQueue: string[];
}

export default function AssessmentProgress({
  mode,
  currentTest,
  resultsLog,
  boQueue,
}: Props) {
  const [detailTest, setDetailTest] = useState<string | null>(null);

  const ttCells = useMemo(
    () => buildTopTierProgress(TT_ORDER, resultsLog, currentTest, mode, boQueue),
    [resultsLog, currentTest, mode, boQueue]
  );

  const detailCriteria = detailTest ? getTestCriteria(detailTest) : null;
  const detailSetup = detailTest ? getTestSetup(detailTest) : null;
  const detailEntry = detailTest
    ? [...resultsLog].reverse().find((r) => r.test === detailTest)
    : undefined;

  return (
    <div className="flex flex-col bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200/80 shadow-sm p-4 sm:p-5 h-full min-h-[420px] max-h-[calc(100vh-8rem)]">
      <div className="flex items-baseline justify-between gap-2 border-b border-slate-200 pb-2.5 mb-3">
        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.14em]">
          Top tier results
        </div>
        <div className="text-[10px] text-slate-400 font-medium">
          Global scan
        </div>
      </div>

      <div className="overflow-y-auto flex-grow breadcrumb-vertical pr-1">
        <div className="grid grid-cols-1 gap-1">
          {ttCells.map((cell) => {
            const isActiveTt = mode === "TT" && cell.status === "current";
            const isActiveBo =
              mode === "BO" && cell.queuedForBreakout && cell.score;
            return (
              <button
                key={cell.name}
                type="button"
                onClick={() =>
                  cell.score || isActiveTt
                    ? setDetailTest(cell.name)
                    : setDetailTest(null)
                }
                className={`flex items-center gap-2 text-left rounded-lg px-2.5 py-1.5 text-xs transition-colors border ${
                  isActiveTt
                    ? "border-slate-800 bg-slate-900 text-white font-semibold"
                    : isActiveBo
                      ? "border-spark-breakout/40 bg-red-50/80 text-slate-800"
                      : cell.status === "scored"
                        ? "border-slate-100 bg-slate-50 hover:bg-slate-100 text-slate-700"
                        : "border-transparent text-slate-400"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full shrink-0 ${
                    isActiveTt ? "bg-white" : scoreDotClass(cell.score)
                  }`}
                />
                <span className="flex-grow truncate leading-tight">
                  {cell.name}
                </span>
                {cell.score && (
                  <span
                    className={`shrink-0 px-1.5 py-0.5 rounded border text-[10px] font-black ${
                      isActiveTt
                        ? "bg-white/15 text-white border-white/30"
                        : scoreBadgeClass(cell.score)
                    }`}
                  >
                    {cell.score}
                  </span>
                )}
                {cell.queuedForBreakout && !isActiveTt && (
                  <span
                    className="shrink-0 w-1.5 h-1.5 rounded-full bg-spark-breakout"
                    title="Breakout queued"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {detailTest && (
        <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-xs text-slate-700 shrink-0">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <span className="font-semibold text-slate-900 leading-snug text-sm">
              {detailTest}
            </span>
            <button
              type="button"
              onClick={() => setDetailTest(null)}
              className="text-slate-400 hover:text-slate-600 font-bold shrink-0"
              aria-label="Close detail"
            >
              X
            </button>
          </div>
          {detailEntry && (
            <div className="mb-1.5">
              <span
                className={`inline-block px-1.5 py-0.5 rounded border text-[10px] font-black ${scoreBadgeClass(detailEntry.score)}`}
              >
                {detailEntry.score}
              </span>
              {detailEntry.diag && (
                <span className="ml-2 text-slate-600">{detailEntry.diag}</span>
              )}
            </div>
          )}
          {detailSetup && (
            <p className="text-[11px] text-slate-600 leading-snug mb-1">
              <span className="font-semibold">{detailSetup.position}.</span>{" "}
              {detailSetup.instructions}
            </p>
          )}
          {detailCriteria && (
            <p className="text-[11px] text-slate-500 leading-snug">
              {detailCriteria}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
