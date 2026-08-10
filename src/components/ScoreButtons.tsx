"use client";

import type { Score } from "@/lib/types";

const BUTTONS: {
  score: Score;
  label: string;
  hint: string;
  className: string;
}[] = [
  {
    score: "FN",
    label: "FN",
    hint: "Functional · No pain",
    className: "bg-spark-fn hover:brightness-105",
  },
  {
    score: "DN",
    label: "DN",
    hint: "Dysfunctional · No pain",
    className: "bg-spark-dn hover:brightness-105",
  },
  {
    score: "DP",
    label: "DP",
    hint: "Dysfunctional · Pain",
    className: "bg-spark-dp hover:brightness-105",
  },
  {
    score: "FP",
    label: "FP",
    hint: "Functional · Pain",
    className: "bg-spark-fp hover:brightness-105",
  },
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
          className={`${b.className} rounded-xl py-3.5 px-3 text-white transition-all active:scale-[0.98] disabled:opacity-45 shadow-sm`}
        >
          <span className="block font-black text-lg tracking-wide">{b.label}</span>
          <span className="block text-[10px] font-medium text-white/85 mt-0.5 leading-tight">
            {b.hint}
          </span>
        </button>
      ))}
    </div>
  );
}
