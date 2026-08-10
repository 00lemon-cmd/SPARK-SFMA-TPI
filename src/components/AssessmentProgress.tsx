"use client";

import { useMemo, useState } from "react";
import type { ResultEntry, Score } from "@/lib/types";
import { TT_ORDER } from "@/engine/top-tier";
import { SFMA_LOGIC } from "@/engine/sfma-tree";
import { breakoutChainKey } from "@/engine/assessment-helpers";
import {
  buildBreakoutTreeView,
  buildTopTierProgress,
} from "@/engine/breakout-tree-view";
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
  activePattern: string;
  resultsLog: ResultEntry[];
  boQueue: string[];
}

export default function AssessmentProgress({
  mode,
  currentTest,
  activePattern,
  resultsLog,
  boQueue,
}: Props) {
  const [detailTest, setDetailTest] = useState<string | null>(null);

  const ttCells = useMemo(
    () => buildTopTierProgress(TT_ORDER, resultsLog, currentTest, mode, boQueue),
    [resultsLog, currentTest, mode, boQueue]
  );

  const tree = useMemo(() => {
    if (mode !== "BO" || !activePattern) return null;
    const key = breakoutChainKey(activePattern);
    const chain = SFMA_LOGIC[key] ?? SFMA_LOGIC[activePattern];
    if (!chain) return null;
    return buildBreakoutTreeView(chain, activePattern, resultsLog, currentTest);
  }, [mode, activePattern, resultsLog, currentTest]);

  const detailCriteria = detailTest ? getTestCriteria(detailTest) : null;
  const detailSetup = detailTest ? getTestSetup(detailTest) : null;
  const detailEntry = detailTest
    ? [...resultsLog].reverse().find((r) => r.test === detailTest)
    : undefined;

  return (
    <div className="flex flex-col bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200/80 shadow-sm p-4 sm:p-5 h-full min-h-[520px] max-h-[calc(100vh-8rem)]">
      <div className="flex items-baseline justify-between gap-2 border-b border-slate-200 pb-2.5 mb-3">
        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.14em]">
          {mode === "TT" ? "Assessment map" : "Breakout map"}
        </div>
        <div className="text-[10px] text-slate-400 font-medium">
          {mode === "BO" ? "Path + global scan" : "All top-tier patterns"}
        </div>
      </div>

      <div className="overflow-y-auto flex-grow breadcrumb-vertical pr-1 space-y-4">
        {/* Top tier: compact chip grid on wide panel */}
        <div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.14em] mb-2">
            Global scan
          </div>
          <div className="grid grid-cols-1 gap-1">
            {ttCells.map((cell) => {
              const isActiveTt = mode === "TT" && cell.status === "current";
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

        {mode === "BO" && tree && (
          <div className="border-t border-slate-200 pt-3">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.14em] mb-2">
              {tree.patternLabel}
            </div>
            <div className="relative space-y-0">
              {tree.nodes.map((node, idx) => {
                const takenEdge = tree.edges.find(
                  (e) => e.from === node.id && e.taken
                );
                const showConnector = idx < tree.nodes.length - 1;
                return (
                  <div key={`${node.id}-${idx}`} className="relative">
                    {showConnector && (
                      <div
                        className={`absolute left-[13px] top-8 w-0.5 ${
                          takenEdge ? "bg-slate-400" : "bg-slate-200"
                        }`}
                        style={{ height: "calc(100% - 0.25rem)" }}
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        if (node.score || node.status === "current") {
                          setDetailTest(node.id);
                        }
                      }}
                      className={`relative flex items-start gap-2.5 w-full text-left rounded-xl px-2.5 py-2.5 mb-1.5 border transition-colors ${
                        node.status === "current"
                          ? "border-spark-breakout bg-red-50 font-semibold shadow-sm"
                          : node.status === "scored"
                            ? "border-slate-200 bg-slate-50 hover:bg-slate-100"
                            : node.status === "skipped"
                              ? "border-dashed border-slate-200 bg-white opacity-45"
                              : "border-transparent bg-white/60 opacity-70"
                      }`}
                      style={{ marginLeft: Math.min(node.depth, 5) * 10 }}
                    >
                      <span
                        className={`mt-1 w-2.5 h-2.5 rounded-full shrink-0 z-10 ${
                          node.status === "current"
                            ? "bg-spark-breakout ring-2 ring-red-200"
                            : scoreDotClass(node.score)
                        }`}
                      />
                      <span className="min-w-0 flex-grow">
                        <span className="block text-xs sm:text-sm text-slate-800 leading-snug">
                          {node.label}
                        </span>
                        {node.diag && (
                          <span className="block text-[10px] text-slate-500 mt-0.5 leading-snug">
                            {node.diag}
                          </span>
                        )}
                      </span>
                      {node.score && (
                        <span
                          className={`shrink-0 px-1.5 py-0.5 rounded border text-[10px] font-black ${scoreBadgeClass(node.score)}`}
                        >
                          {node.score}
                        </span>
                      )}
                      {node.status === "current" && (
                        <span className="shrink-0 text-[10px] font-bold text-spark-breakout uppercase tracking-wide">
                          Now
                        </span>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
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
