"use client";

import type { Score } from "@/lib/types";
import ScoreButtons from "./ScoreButtons";

interface Props {
  testName: string;
  onScore: (score: Score) => void;
  disabled?: boolean;
}

export default function TestCard({ testName, onScore, disabled }: Props) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-5 flex flex-col justify-center h-full">
      <div className="text-xs font-bold text-slate-400 uppercase mb-2 tracking-wide">
        Current Assessment:
      </div>
      <div className="font-bold text-lg text-slate-800 mb-5 leading-relaxed">
        {testName}
      </div>
      <ScoreButtons onScore={onScore} disabled={disabled} />
    </div>
  );
}
