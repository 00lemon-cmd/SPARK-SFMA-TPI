"use client";

import { useMemo, useState } from "react";
import type { ResultEntry, Score } from "@/lib/types";
import { SFMA_LOGIC } from "@/engine/sfma-tree";
import { breakoutChainKey } from "@/engine/assessment-helpers";
import {
  buildBreakoutBranchTree,
  findTopTierScoreForPattern,
  type BreakoutBranchNode,
} from "@/engine/breakout-tree-view";
import { getTestCriteria } from "@/engine/test-criteria";
import { getTestSetup } from "@/engine/test-setup";

function scoreTone(score?: Score): {
  bg: string;
  border: string;
  text: string;
  solid: string;
} {
  if (score === "FN")
    return {
      bg: "bg-emerald-50",
      border: "border-emerald-300",
      text: "text-emerald-800",
      solid: "bg-spark-fn",
    };
  if (score === "DN")
    return {
      bg: "bg-amber-50",
      border: "border-amber-300",
      text: "text-amber-900",
      solid: "bg-spark-dn",
    };
  if (score === "DP")
    return {
      bg: "bg-orange-50",
      border: "border-orange-300",
      text: "text-orange-900",
      solid: "bg-spark-dp",
    };
  if (score === "FP")
    return {
      bg: "bg-red-50",
      border: "border-red-300",
      text: "text-red-800",
      solid: "bg-spark-fp",
    };
  return {
    bg: "bg-slate-50",
    border: "border-slate-200",
    text: "text-slate-700",
    solid: "bg-slate-300",
  };
}

function BranchNode({
  node,
  onSelect,
}: {
  node: BreakoutBranchNode;
  onSelect: (id: string) => void;
}) {
  const tone = scoreTone(node.score);
  const isRoot = node.kind === "top-tier";
  const kids = node.children;
  const selectable = Boolean(node.score) || node.status === "current" || isRoot;

  return (
    <div className="flex flex-col items-center">
      <button
        type="button"
        disabled={!selectable}
        onClick={() => selectable && onSelect(node.id)}
        className={`relative text-left transition-all ${
          isRoot
            ? `min-w-[200px] max-w-[280px] rounded-2xl border-2 px-4 py-3 shadow-sm ${tone.bg} ${tone.border}`
            : node.status === "current"
              ? "min-w-[148px] max-w-[200px] rounded-xl border-2 border-spark-breakout bg-red-50 px-3 py-2.5 shadow-md ring-2 ring-red-100"
              : node.status === "scored"
                ? `min-w-[148px] max-w-[200px] rounded-xl border px-3 py-2.5 shadow-sm ${tone.bg} ${tone.border} hover:brightness-[0.98]`
                : node.status === "skipped"
                  ? "min-w-[132px] max-w-[180px] rounded-xl border border-dashed border-slate-200 bg-white/70 px-3 py-2 opacity-45"
                  : "min-w-[132px] max-w-[180px] rounded-xl border border-slate-200/80 bg-white/80 px-3 py-2 opacity-70"
        } ${selectable ? "cursor-pointer" : "cursor-default"}`}
      >
        {isRoot && (
          <div className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-500 mb-1">
            Top tier
          </div>
        )}
        <div className="flex items-start gap-2">
          <span
            className={`mt-1 w-2.5 h-2.5 rounded-full shrink-0 ${
              node.status === "current" ? "bg-spark-breakout" : tone.solid
            }`}
          />
          <div className="min-w-0 flex-grow">
            <div
              className={`leading-snug ${
                isRoot
                  ? `text-sm font-bold ${tone.text}`
                  : "text-xs font-semibold text-slate-800"
              }`}
            >
              {node.label}
            </div>
            {node.diag && (
              <div className="text-[10px] text-slate-500 mt-0.5 leading-snug line-clamp-2">
                {node.diag}
              </div>
            )}
          </div>
          {node.score && (
            <span
              className={`shrink-0 px-1.5 py-0.5 rounded-md text-[10px] font-black border ${tone.bg} ${tone.border} ${tone.text}`}
            >
              {node.score}
            </span>
          )}
          {node.status === "current" && (
            <span className="shrink-0 text-[9px] font-bold uppercase tracking-wide text-spark-breakout">
              Now
            </span>
          )}
        </div>
      </button>

      {kids.length > 0 && (
        <div className="flex flex-col items-center w-full">
          {/* stem down from parent */}
          <div
            className={`w-0.5 h-4 ${
              kids.some((k) => k.status === "scored" || k.status === "current")
                ? "bg-slate-400"
                : "bg-slate-200"
            }`}
          />

          {kids.length === 1 ? (
            <BranchNode node={kids[0]} onSelect={onSelect} />
          ) : (
            <div className="relative flex items-start justify-center gap-4 sm:gap-6 pt-0">
              {/* horizontal bar across siblings */}
              <div
                className="absolute top-0 left-[12%] right-[12%] h-0.5 bg-slate-300"
                aria-hidden
              />
              {kids.map((child) => (
                <div key={child.id} className="relative flex flex-col items-center pt-0">
                  <div
                    className={`w-0.5 h-4 ${
                      child.status === "skipped" || child.status === "pending"
                        ? "bg-slate-200"
                        : "bg-slate-400"
                    }`}
                  />
                  <BranchNode node={child} onSelect={onSelect} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface Props {
  activePattern: string;
  currentTest: string;
  resultsLog: ResultEntry[];
}

export default function BreakoutChainMap({
  activePattern,
  currentTest,
  resultsLog,
}: Props) {
  const [detailId, setDetailId] = useState<string | null>(null);

  const tree = useMemo(() => {
    if (!activePattern) return null;
    const key = breakoutChainKey(activePattern);
    const chain = SFMA_LOGIC[key] ?? SFMA_LOGIC[activePattern];
    if (!chain) return null;
    const ttScore = findTopTierScoreForPattern(activePattern, resultsLog);
    return buildBreakoutBranchTree(
      chain,
      activePattern,
      ttScore,
      resultsLog,
      currentTest,
    );
  }, [activePattern, resultsLog, currentTest]);

  const detailNode = useMemo(() => {
    if (!tree || !detailId) return null;
    const stack = [tree.root];
    while (stack.length) {
      const n = stack.pop()!;
      if (n.id === detailId) return n;
      stack.push(...n.children);
    }
    return null;
  }, [tree, detailId]);

  const detailTestId =
    detailNode && detailNode.kind === "test" ? detailNode.id : null;
  const detailCriteria = detailTestId ? getTestCriteria(detailTestId) : null;
  const detailSetup = detailTestId ? getTestSetup(detailTestId) : null;

  if (!tree) return null;

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white/90 backdrop-blur-sm shadow-sm overflow-hidden">
      <div className="flex items-baseline justify-between gap-3 px-4 sm:px-5 py-3 border-b border-slate-200">
        <div>
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.14em]">
            Breakout chain
          </div>
          <div className="text-xs text-slate-400 mt-0.5">
            Builds as you score — branches where L/R or path forks allow
          </div>
        </div>
      </div>

      <div className="overflow-x-auto overflow-y-auto max-h-[min(520px,55vh)] px-4 sm:px-6 py-6">
        <div className="min-w-max mx-auto">
          <BranchNode
            node={tree.root}
            onSelect={(id) => setDetailId(id === detailId ? null : id)}
          />
        </div>
      </div>

      {detailNode && (
        <div className="border-t border-slate-200 bg-slate-50 px-4 sm:px-5 py-3 text-xs text-slate-700">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <span className="font-semibold text-slate-900 text-sm leading-snug">
              {detailNode.kind === "top-tier"
                ? detailNode.label
                : detailNode.id}
            </span>
            <button
              type="button"
              onClick={() => setDetailId(null)}
              className="text-slate-400 hover:text-slate-600 font-bold shrink-0"
              aria-label="Close detail"
            >
              X
            </button>
          </div>
          {detailNode.score && (
            <div className="mb-1.5">
              <span
                className={`inline-block px-1.5 py-0.5 rounded border text-[10px] font-black ${scoreTone(detailNode.score).bg} ${scoreTone(detailNode.score).border} ${scoreTone(detailNode.score).text}`}
              >
                {detailNode.score}
              </span>
              {detailNode.diag && (
                <span className="ml-2 text-slate-600">{detailNode.diag}</span>
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
