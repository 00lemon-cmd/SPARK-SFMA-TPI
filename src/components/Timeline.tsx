"use client";

import type { ResultEntry } from "@/lib/types";

function scoreColor(s: string) {
  if (s === "FN") return "text-emerald-500";
  if (s.includes("P")) return "text-red-500";
  return "text-amber-500";
}

interface Props {
  entries: ResultEntry[];
  label: string;
  mode: "TT" | "BO";
}

export default function Timeline({ entries, label, mode }: Props) {
  return (
    <div className="flex flex-col bg-white rounded-lg border border-slate-200 p-5 max-h-[450px]">
      <div className="text-xs font-bold text-slate-500 uppercase border-b-2 border-slate-200 pb-2 mb-3 tracking-wide">
        {label}
      </div>
      <div className="flex flex-col gap-2 overflow-y-auto flex-grow breadcrumb-vertical pr-2">
        {entries.map((r, i) => (
          <div
            key={i}
            className="text-sm bg-slate-50 px-3 py-2.5 rounded-md border-l-4 border-slate-400"
          >
            <span className="text-slate-500 block mb-1 text-xs">{r.test}</span>
            <b className={scoreColor(r.score)}>{r.score}</b>
          </div>
        ))}
        <div
          className={`text-sm px-3 py-2.5 rounded-md border-l-[6px] font-bold ${
            mode === "TT"
              ? "border-spark-primary bg-blue-50 text-slate-800"
              : "border-spark-breakout bg-red-50 text-slate-800"
          }`}
        >
          {mode === "TT" ? "Current Scan" : "Current Step"}
        </div>
      </div>
    </div>
  );
}
