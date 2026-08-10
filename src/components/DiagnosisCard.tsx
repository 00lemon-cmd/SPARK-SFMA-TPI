"use client";

interface Props {
  diagnosis: string | null;
}

export default function DiagnosisCard({ diagnosis }: Props) {
  if (!diagnosis) return null;

  return (
    <div className="mb-4 rounded-xl border border-red-200 bg-gradient-to-r from-red-50 to-orange-50 px-4 py-3.5">
      <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-spark-breakout mb-1">
        Finding
      </div>
      <p className="text-spark-breakout font-semibold text-sm sm:text-base leading-relaxed">
        {diagnosis}
      </p>
    </div>
  );
}
