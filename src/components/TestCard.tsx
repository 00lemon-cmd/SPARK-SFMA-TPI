"use client";

import type { Score } from "@/lib/types";
import { getTestCriteria } from "@/engine/test-criteria";
import { getTestSetup } from "@/engine/test-setup";
import ScoreButtons from "./ScoreButtons";

interface Props {
  testName: string;
  pattern?: string;
  onScore: (score: Score) => void;
  disabled?: boolean;
}

function detectSide(text: string): "L" | "R" | null {
  if (/ L$| L[ )]/.test(text) || text.startsWith("L ")) return "L";
  if (/ R$| R[ )]/.test(text) || text.startsWith("R ")) return "R";
  if (/\bLeft\b/i.test(text)) return "L";
  if (/\bRight\b/i.test(text)) return "R";
  return null;
}

export default function TestCard({ testName, pattern, onScore, disabled }: Props) {
  const side = detectSide(testName) ?? (pattern ? detectSide(pattern) : null);
  const criteria = getTestCriteria(testName);
  const setup = getTestSetup(testName);

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200/80 shadow-sm p-5 sm:p-6 flex flex-col h-full min-h-[420px]">
      <div className="flex items-center justify-between gap-3 mb-3">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.14em]">
          Current test
        </span>
        {side && (
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-[0.16em] ${
              side === "L"
                ? "bg-sky-50 text-sky-700 ring-1 ring-sky-200"
                : "bg-teal-50 text-teal-700 ring-1 ring-teal-200"
            }`}
          >
            {side === "L" ? "Left" : "Right"}
          </span>
        )}
      </div>

      <h2 className="font-semibold text-xl sm:text-2xl text-slate-900 tracking-tight leading-snug mb-4">
        {testName}
      </h2>

      {setup && (
        <div className="mb-3 rounded-xl bg-slate-900 text-slate-100 px-4 py-3.5">
          <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400 mb-1">
            Client position
          </div>
          <p className="text-sm font-semibold text-white leading-snug mb-2">
            {setup.position}
          </p>
          <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400 mb-1">
            Instructions
          </div>
          <p className="text-sm text-slate-200 leading-relaxed">
            {setup.instructions}
          </p>
        </div>
      )}

      {criteria && (
        <div className="mb-5 rounded-xl border border-amber-200/70 bg-amber-50/80 px-4 py-3 text-sm text-amber-950 leading-relaxed">
          <span className="font-bold text-amber-800/90 uppercase tracking-[0.12em] text-[10px] block mb-1">
            Scoring criteria
          </span>
          {criteria}
        </div>
      )}

      <div className="mt-auto pt-2">
        <ScoreButtons onScore={onScore} disabled={disabled} />
      </div>
    </div>
  );
}
