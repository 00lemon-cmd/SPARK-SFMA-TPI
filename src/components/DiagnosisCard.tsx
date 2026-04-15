"use client";

interface Props {
  diagnosis: string | null;
}

export default function DiagnosisCard({ diagnosis }: Props) {
  if (!diagnosis) return null;

  return (
    <div className="bg-red-50 border-l-[6px] border-spark-breakout rounded-r-lg px-4 py-3 mb-4 text-left">
      <p className="text-spark-breakout font-bold text-sm leading-relaxed">
        {diagnosis}
      </p>
    </div>
  );
}
