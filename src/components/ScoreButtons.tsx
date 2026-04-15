"use client";

import type { Score } from "@/lib/types";

const BUTTONS: { score: Score; label: string; className: string }[] = [
  { score: "FN", label: "FN", className: "bg-spark-fn hover:brightness-110" },
  { score: "DN", label: "DN", className: "bg-spark-dn hover:brightness-110" },
  { score: "DP", label: "DP", className: "bg-spark-dp hover:brightness-110" },
  { score: "FP", label: "FP", className: "bg-spark-fp hover:brightness-110" },
];

interface Props {
  onScore: (score: Score) => void;
  disabled?: boolean;
}

export default function ScoreButtons({ onScore, disabled }: Props) {
  return (
    <div className="grid grid-cols-2 gap-2.5">
      {BUTTONS.map((b) => (
        <button
          key={b.score}
          disabled={disabled}
          onClick={() => onScore(b.score)}
          className={`${b.className} rounded-md py-4 text-white font-bold text-base uppercase tracking-wide transition-all active:scale-[0.98] disabled:opacity-50`}
        >
          {b.label}
        </button>
      ))}
    </div>
  );
}
