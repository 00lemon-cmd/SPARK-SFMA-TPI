"use client";

import type { ResultEntry } from "@/lib/types";

function scoreBadge(score: string) {
  if (score === "FN")
    return "bg-emerald-500 text-white";
  if (score.includes("P"))
    return "bg-red-500 text-white";
  return "bg-amber-400 text-slate-800";
}

function scoreBorderColor(score: string) {
  if (score === "FN") return "text-emerald-500";
  if (score.includes("P")) return "text-red-500";
  return "text-amber-500";
}

interface Props {
  client: string;
  agg: {
    topTier: ResultEntry[];
    breakouts: Map<string, ResultEntry[]>;
    terminalDiagnoses: ResultEntry[];
  };
  results: ResultEntry[];
}

export default function ClinicalAudit({ client, agg }: Props) {
  const date = new Date().toLocaleDateString("en-AU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="p-6">
      <div className="bg-spark-audit text-white rounded-md px-6 py-4 text-center mb-2">
        <h1 className="text-lg font-bold tracking-wider">
          SFMA CLINICAL MOVEMENT AUDIT
        </h1>
      </div>
      <div className="flex justify-between px-1 py-2 text-sm font-bold text-slate-700 mb-4">
        <span>PATIENT: {client}</span>
        <span>DATE: {date}</span>
      </div>

      {/* Part I: Top Tier */}
      <div className="bg-slate-600 text-cyan-400 rounded-md px-4 py-2.5 text-center font-bold text-sm mb-3 tracking-wide">
        PART I: GLOBAL MOVEMENT STATUS (TOP TIER)
      </div>

      <div className="space-y-1 mb-6">
        {agg.topTier.map((r, i) => (
          <div
            key={i}
            className="flex items-center border border-slate-200 rounded"
          >
            <div className="flex-1 bg-slate-50 px-3 py-2 font-bold text-sm text-slate-700">
              {r.pattern}
            </div>
            <div
              className={`w-16 text-center px-2 py-2 font-bold text-sm rounded-r ${scoreBadge(
                r.score
              )}`}
            >
              {r.score}
            </div>
          </div>
        ))}
      </div>

      {/* Part II: Breakout Chains */}
      <div className="bg-slate-600 text-cyan-400 rounded-md px-4 py-2.5 text-center font-bold text-sm mb-3 tracking-wide">
        PART II: CLINICAL BREAKOUT CHAINS
      </div>

      {Array.from(agg.breakouts.entries()).map(([pattern, entries]) => (
        <div key={pattern} className="mb-4">
          <div className="bg-slate-300 text-slate-800 rounded-md px-3 py-2 font-bold text-sm mb-1">
            {pattern.toUpperCase()} SEQUENCE
          </div>
          <div className="space-y-px">
            {entries.map((r, i) => (
              <div
                key={i}
                className="flex items-start border-b border-slate-100 py-1.5 px-2"
              >
                <div className="flex-1 text-sm italic text-slate-600 pl-4">
                  &darr; {r.test}
                </div>
                <div
                  className={`w-12 text-center font-bold text-sm ${scoreBorderColor(
                    r.score
                  )}`}
                >
                  {r.score}
                </div>
                {r.diag && (
                  <div
                    className={`flex-1 text-sm font-bold ${
                      r.diag.includes("MD")
                        ? "text-orange-600"
                        : "text-blue-600"
                    }`}
                  >
                    {r.diag}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {agg.breakouts.size === 0 && (
        <div className="text-center text-slate-400 italic py-6 text-sm">
          All top-tier tests scored FN &mdash; no breakout chains required.
        </div>
      )}
    </div>
  );
}
