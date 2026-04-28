"use client";

import type { Score } from "@/lib/types";
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

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-5 flex flex-col justify-center h-full">
      <div className="text-xs font-bold text-slate-400 uppercase mb-2 tracking-wide">
        Current Assessment:
      </div>
      {side && (
        <div className="mb-2">
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest ${
              side === "L"
                ? "bg-blue-100 text-blue-700 border border-blue-300"
                : "bg-emerald-100 text-emerald-700 border border-emerald-300"
            }`}
          >
            {side === "L" ? "LEFT" : "RIGHT"}
          </span>
        </div>
      )}
      <div className="font-bold text-lg text-slate-800 mb-5 leading-relaxed">
        {testName}
      </div>
      <ScoreButtons onScore={onScore} disabled={disabled} />
    </div>
  );
}
